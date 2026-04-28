import { getAllSecurityHeaders, securityConfig } from "../utils/security"

export interface SecurityHeaders {
  [key: string]: string
}

export function getSecurityHeaders(): SecurityHeaders {
  const isDevelopment = process.env.NODE_ENV !== "production"
  return getAllSecurityHeaders(isDevelopment)
}

// Express middleware types - using any for framework compatibility
export function expressSecurityMiddleware() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (_req: any, res: any, next: any) => {
    const headers = getSecurityHeaders()

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    next()
  }
}

// Fastify plugin types - using any for framework compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fastifySecurityPlugin(fastify: any, _options: any, done: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fastify.addHook("onSend", async (_request: any, reply: any) => {
    const headers = getSecurityHeaders()

    Object.entries(headers).forEach(([key, value]) => {
      reply.header(key, value)
    })
  })

  done()
}

export function nextSecurityHeaders() {
  return getSecurityHeaders()
}

// Vite server types - using any for framework compatibility
export function viteSecurityPlugin() {
  return {
    name: "security-headers",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureServer(server: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      server.middlewares.use((_req: any, res: any, next: any) => {
        const headers = getSecurityHeaders()

        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value)
        })

        next()
      })
    },
  }
}

export function createRateLimitConfig() {
  return {
    windowMs: securityConfig.rateLimiting.api.windowMs,
    max: securityConfig.rateLimiting.api.max,
    message: {
      error: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(securityConfig.rateLimiting.api.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,

    skipSuccessfulRequests: false,

    skipFailedRequests: false,
  }
}

export function createCSRFConfig() {
  return {
    cookie: {
      key: "_csrf",
      path: "/",
      httpOnly: true,
      secure:
        typeof window === "undefined" && typeof globalThis !== "undefined",
      sameSite: "strict" as const,
      maxAge: securityConfig.csrf.tokenTTL,
    },
    ignoreMethods: ["GET", "HEAD", "OPTIONS"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: (req: any) => {
      return (
        req.body?.csrfToken ||
        req.query?.csrfToken ||
        req.headers["x-csrf-token"] ||
        req.headers["x-xsrf-token"]
      )
    },
  }
}

export default {
  getSecurityHeaders,
  expressSecurityMiddleware,
  fastifySecurityPlugin,
  nextSecurityHeaders,
  viteSecurityPlugin,
  createRateLimitConfig,
  createCSRFConfig,
}
