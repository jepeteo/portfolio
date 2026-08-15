/**
 * Vite preview plugin: mirror Vercel filesystem + 404.html behavior.
 * Known static routes (including prerendered nested index.html) return 200.
 * Unknown paths return dist/404.html with HTTP 404.
 */
import fs from "node:fs"
import path from "node:path"

function sendFile(res, filePath, status = 200) {
  const html = fs.readFileSync(filePath)
  res.statusCode = status
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("Cache-Control", "no-cache")
  if (status === 404) {
    res.setHeader("X-Robots-Tag", "noindex, follow")
  }
  res.end(html)
}

function resolveStaticHtml(root, urlPath) {
  const clean = urlPath.split("?")[0].split("#")[0]
  if (clean === "/" || clean === "") {
    const index = path.join(root, "index.html")
    return fs.existsSync(index) ? index : null
  }

  const relative = clean.replace(/^\//, "").replace(/\/$/, "")
  const asFile = path.join(root, `${relative}.html`)
  if (fs.existsSync(asFile)) return asFile

  const asIndex = path.join(root, relative, "index.html")
  if (fs.existsSync(asIndex)) return asIndex

  return null
}

export function previewNotFoundPlugin() {
  return {
    name: "preview-not-found",
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next()

        const urlPath = req.url || "/"
        if (
          urlPath.startsWith("/assets/") ||
          urlPath.startsWith("/images/") ||
          urlPath.startsWith("/api/") ||
          urlPath.startsWith("/@") ||
          urlPath.includes(".")
        ) {
          // Let Vite serve real static assets; fall through if missing.
          return next()
        }

        const root = server.config.preview?.outDir
          ? path.resolve(server.config.root, server.config.preview.outDir)
          : path.resolve(server.config.root, server.config.build.outDir)

        const hit = resolveStaticHtml(root, urlPath)
        if (hit) {
          return sendFile(res, hit, 200)
        }

        const notFound = path.join(root, "404.html")
        if (fs.existsSync(notFound)) {
          return sendFile(res, notFound, 404)
        }

        return next()
      })
    },
  }
}
