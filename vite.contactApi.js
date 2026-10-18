import path from "node:path"
import { loadEnv } from "vite"

const CONTACT_ENV_KEYS = [
  "RESEND_API_KEY",
  "RESEND_FROM",
  "CONTACT_EMAIL",
  "PUBLIC_SITE_ORIGIN",
  "CSRF_SECRET",
  "TURNSTILE_SECRET_KEY",
]

function applyContactEnv(server) {
  const env = loadEnv(server.config.mode, server.config.envDir, "")
  for (const key of CONTACT_ENV_KEYS) {
    if (env[key] && !process.env[key]) {
      process.env[key] = env[key]
    }
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8")
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(error)
      }
    })
    req.on("error", reject)
  })
}

function toVercelRequest(req, body) {
  const headers = {}
  for (const [key, value] of Object.entries(req.headers)) {
    headers[key.toLowerCase()] = value
  }
  return {
    method: req.method,
    headers,
    body,
    socket: req.socket,
  }
}

function toVercelResponse(res) {
  const vercelRes = {
    status(code) {
      res.statusCode = code
      return vercelRes
    },
    setHeader(name, value) {
      res.setHeader(name, value)
      return vercelRes
    },
    json(body) {
      if (!res.headersSent) {
        if (!res.statusCode) res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
      }
      res.end(JSON.stringify(body))
    },
  }
  return vercelRes
}

export function contactApiPlugin() {
  return {
    name: "contact-api",
    configureServer(server) {
      applyContactEnv(server)

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0]
        if (url !== "/api/contact" && url !== "/api/contact/csrf") {
          next()
          return
        }

        try {
          const vercelReq = toVercelRequest(
            req,
            req.method === "GET" ? undefined : await readJsonBody(req)
          )
          const vercelRes = toVercelResponse(res)
          if (url === "/api/contact/csrf") {
            const csrf = await server.ssrLoadModule(
              path.resolve(server.config.root, "lib/contact/csrfHandler.ts")
            )
            csrf.default(vercelReq, vercelRes)
            return
          }

          const contact = await server.ssrLoadModule(
            path.resolve(server.config.root, "lib/contact/submitHandler.ts")
          )
          await contact.default(vercelReq, vercelRes)
        } catch (error) {
          console.error("Contact API dev handler failed", error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify({ error: "Contact API failed" }))
          }
        }
      })
    },
  }
}
