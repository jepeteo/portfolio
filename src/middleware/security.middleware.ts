import { securityConfig } from "../utils/security"

export interface SecurityHeaders {
  [key: string]: string
}

export function getSecurityHeaders(): SecurityHeaders {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.emailjs.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://eu-assets.i.posthog.com https://app.posthog.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.emailjs.com https://vitals.vercel-insights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com https://app.posthog.com https://fonts.googleapis.com https://fonts.gstatic.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ")

  return {
    "Content-Security-Policy": csp,

    "X-XSS-Protection": "1; mode=block",

    "X-Content-Type-Options": "nosniff",

    "X-Frame-Options": "DENY",

    "Referrer-Policy": "strict-origin-when-cross-origin",

    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "bluetooth=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(", "),

    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",

    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    "Expect-CT": "max-age=86400, enforce",

    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  }
}

export function expressSecurityMiddleware() {
  return (_req: any, res: any, next: any) => {
    const headers = getSecurityHeaders()

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    next()
  }
}

export function fastifySecurityPlugin(fastify: any, _options: any, done: any) {
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

export function viteSecurityPlugin() {
  return {
    name: "security-headers",
    configureServer(server: any) {
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
