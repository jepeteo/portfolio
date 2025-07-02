// Server-side Security Middleware for Portfolio (2025)
// This middleware can be used with Express.js, Fastify, or other Node.js frameworks

import { securityConfig } from "../utils/security"

export interface SecurityHeaders {
  [key: string]: string
}

/**
 * Generate comprehensive security headers for server-side enforcement
 */
export function getSecurityHeaders(): SecurityHeaders {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.emailjs.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.emailjs.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ")

  return {
    // Content Security Policy
    "Content-Security-Policy": csp,

    // XSS Protection
    "X-XSS-Protection": "1; mode=block",

    // Content Type Options
    "X-Content-Type-Options": "nosniff",

    // Frame Options
    "X-Frame-Options": "DENY",

    // Referrer Policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions Policy
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

    // Cross-Origin Policies
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",

    // HSTS (HTTP Strict Transport Security)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    // Expect-CT (Certificate Transparency)
    "Expect-CT": "max-age=86400, enforce",

    // Cache Control for security-sensitive responses
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  }
}

/**
 * Express.js middleware for adding security headers
 */
export function expressSecurityMiddleware() {
  return (_req: any, res: any, next: any) => {
    const headers = getSecurityHeaders()

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    next()
  }
}

/**
 * Fastify plugin for adding security headers
 */
export function fastifySecurityPlugin(fastify: any, _options: any, done: any) {
  fastify.addHook("onSend", async (_request: any, reply: any) => {
    const headers = getSecurityHeaders()

    Object.entries(headers).forEach(([key, value]) => {
      reply.header(key, value)
    })
  })

  done()
}

/**
 * Next.js middleware for adding security headers
 */
export function nextSecurityHeaders() {
  return getSecurityHeaders()
}

/**
 * Vite plugin for adding security headers in development
 */
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

/**
 * Rate limiting middleware (to be used with express-rate-limit or similar)
 */
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
    // Skip successful requests in count
    skipSuccessfulRequests: false,
    // Skip failed requests in count
    skipFailedRequests: false,
  }
}

/**
 * CSRF protection configuration for server-side
 */
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
