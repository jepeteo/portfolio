// Enhanced Security Configuration for Portfolio (2025)
// This file centralizes all security configurations for easier management

interface CSPDirectives {
  defaultSrc: string[]
  scriptSrc: string[]
  styleSrc: string[]
  imgSrc: string[]
  fontSrc: string[]
  connectSrc: string[]
  frameSrc: string[]
  objectSrc: string[]
  baseUri: string[]
  formAction: string[]
  upgradeInsecureRequests: boolean
  reportUri: string
}

interface SecurityHeaders {
  "X-Frame-Options": string
  "X-Content-Type-Options": string
  "X-XSS-Protection": string
  "Referrer-Policy": string
  "Permissions-Policy": string
  "Strict-Transport-Security": string
  "Cross-Origin-Embedder-Policy": string
  "Cross-Origin-Opener-Policy": string
  "Cross-Origin-Resource-Policy": string
  "Content-Security-Policy"?: string
}

interface RateLimitConfig {
  windowMs: number
  maxAttempts: number
  blockDuration?: number
  message: string
}

interface ValidationRule {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  blockedPatterns?: RegExp[]
  blockedDomains?: string[]
}

interface SecurityConfig {
  csp: {
    directives: CSPDirectives
  }
  headers: Omit<SecurityHeaders, "Content-Security-Policy">
  rateLimiting: {
    contactForm: RateLimitConfig
    api: RateLimitConfig
    email: RateLimitConfig
  }
  csrf: {
    tokenLength: number
    tokenTTL: number
    cookieName: string
    headerName: string
    cookieOptions: {
      httpOnly: boolean
      secure: boolean
      sameSite: "strict" | "lax" | "none"
      maxAge: number
    }
  }
  validation: {
    name: ValidationRule
    email: ValidationRule
    subject: ValidationRule
    message: ValidationRule
  }
  botDetection: {
    honeypotField: string
    minSubmissionTime: number
    maxSubmissionTime: number
    suspiciousPatterns: RegExp[]
  }
  development: {
    allowUnsafeInline: boolean
    allowUnsafeEval: boolean
    disableCSP: boolean
    logSecurityEvents: boolean
  }
  production: {
    allowUnsafeInline: boolean
    allowUnsafeEval: boolean
    enforceHTTPS: boolean
    enableCSPReporting: boolean
    logSecurityEvents: boolean
  }
}

export const SECURITY_CONFIG: SecurityConfig = {
  // Content Security Policy - Production Ready
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.emailjs.com",
        "https://cdnjs.cloudflare.com",
        "https://www.googletagmanager.com", // For analytics
        "https://www.google-analytics.com",
      ] as string[],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:",
        "https://www.google-analytics.com", // For analytics
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.emailjs.com",
        "https://formspree.io",
        "https://api.github.com",
        "https://www.google-analytics.com", // For analytics
        "https://analytics.google.com",
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'", "https://formspree.io"],
      upgradeInsecureRequests: true,
      reportUri: "/api/csp-report", // For CSP violation reporting
    },

  // Security Headers Configuration
  headers: {
    // Prevent clickjacking
    "X-Frame-Options": "DENY",
    
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    
    // Enable XSS protection
    "X-XSS-Protection": "1; mode=block",
    
    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // Permissions policy (formerly Feature-Policy)
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "accelerometer=()",
      "gyroscope=()",
    ].join(", "),
    
    // Strict Transport Security (HTTPS enforcement)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    
    // Cross-Origin policies
    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  },

  // Rate Limiting Configuration
  rateLimiting: {
    // Contact form specific limits
    contactForm: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 3, // Stricter limit
      blockDuration: 30 * 60 * 1000, // 30 minutes block
      message: "Too many contact form submissions. Please wait before trying again.",
    },
    
    // General API limits
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 100, // Per IP
      message: "Rate limit exceeded. Please try again later.",
    },
    
    // Email submission limits
    email: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxAttempts: 5, // Very strict
      blockDuration: 24 * 60 * 60 * 1000, // 24 hours block
    },
  },

  // CSRF Configuration
  csrf: {
    tokenLength: 32,
    tokenTTL: 30 * 60 * 1000, // 30 minutes
    cookieName: "csrf-token",
    headerName: "X-CSRF-Token",
    cookieOptions: {
      httpOnly: true,
      secure: true, // HTTPS only
      sameSite: "strict" as const,
      maxAge: 30 * 60 * 1000, // 30 minutes
    },
  },

  // Input Validation Rules
  validation: {
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s\-\'\.]+$/,
      blockedPatterns: [
        /script/gi,
        /javascript/gi,
        /vbscript/gi,
        /onload/gi,
        /onerror/gi,
        /eval\(/gi,
        /<.*>/gi,
      ],
    },
    email: {
      maxLength: 254,
      pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      blockedDomains: [
        "tempmail.org",
        "10minutemail.com",
        "guerrillamail.com",
        // Add more disposable email domains
      ],
    },
    subject: {
      minLength: 3,
      maxLength: 100,
      blockedPatterns: [
        /script/gi,
        /javascript/gi,
        /vbscript/gi,
        /<.*>/gi,
      ],
    },
    message: {
      minLength: 10,
      maxLength: 2000,
      blockedPatterns: [
        /script/gi,
        /javascript/gi,
        /vbscript/gi,
        /<.*>/gi,
        /eval\(/gi,
      ],
    },
  },

  // Bot Detection Configuration
  botDetection: {
    honeypotField: "website", // Hidden field name
    minSubmissionTime: 3000, // 3 seconds minimum
    maxSubmissionTime: 30 * 60 * 1000, // 30 minutes maximum
    suspiciousPatterns: [
      /buy.*now/gi,
      /click.*here/gi,
      /visit.*website/gi,
      /guaranteed/gi,
      /increase.*traffic/gi,
      /seo.*service/gi,
      /lorem ipsum/gi,
      /test.*test/gi,
      /viagra/gi,
      /casino/gi,
      /crypto/gi,
      /investment/gi,
    ],
  },

  // Environment specific settings
  development: {
    allowUnsafeInline: true,
    allowUnsafeEval: true,
    disableCSP: false, // Keep CSP even in development for testing
    logSecurityEvents: true,
  },

  production: {
    allowUnsafeInline: false,
    allowUnsafeEval: false,
    enforceHTTPS: true,
    enableCSPReporting: true,
    logSecurityEvents: true,
  },
} as const

// Helper function to generate CSP string
export function generateCSPString(isDevelopment = false): string {
  const config = SECURITY_CONFIG.csp.directives
  const directives: string[] = []

  // Default source
  directives.push(`default-src ${config.defaultSrc.join(" ")}`)

  // Script source - add unsafe-inline only in development
  const scriptSrc = [...config.scriptSrc]
  if (isDevelopment && SECURITY_CONFIG.development.allowUnsafeInline) {
    scriptSrc.push("'unsafe-inline'")
  }
  if (isDevelopment && SECURITY_CONFIG.development.allowUnsafeEval) {
    scriptSrc.push("'unsafe-eval'")
  }
  directives.push(`script-src ${scriptSrc.join(" ")}`)

  // Other directives
  directives.push(`style-src ${config.styleSrc.join(" ")}`)
  directives.push(`img-src ${config.imgSrc.join(" ")}`)
  directives.push(`font-src ${config.fontSrc.join(" ")}`)
  directives.push(`connect-src ${config.connectSrc.join(" ")}`)
  directives.push(`frame-src ${config.frameSrc.join(" ")}`)
  directives.push(`object-src ${config.objectSrc.join(" ")}`)
  directives.push(`base-uri ${config.baseUri.join(" ")}`)
  directives.push(`form-action ${config.formAction.join(" ")}`)

  if (config.upgradeInsecureRequests) {
    directives.push("upgrade-insecure-requests")
  }

  // Add report URI in production
  if (!isDevelopment && config.reportUri) {
    directives.push(`report-uri ${config.reportUri}`)
  }

  return directives.join("; ")
}

// Helper function to get security headers
export function getSecurityHeaders(): SecurityHeaders {
  const headers: SecurityHeaders = { ...SECURITY_CONFIG.headers }
  
  // Add CSP header
  // Note: In a real app, you'd detect environment properly
  const isDevelopment = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  
  headers["Content-Security-Policy"] = generateCSPString(isDevelopment)

  return headers
}
