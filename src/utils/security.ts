// Enhanced Security Configuration for Portfolio (2025)
export const securityConfig = {
  // Content Security Policy configuration - Enhanced
  csp: {
    // Allow self and specific domains for scripts
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for development - remove in production
      "https://cdnjs.cloudflare.com",
      "https://cdn.emailjs.com",
      "https://www.googletagmanager.com", // For analytics
      "https://www.google-analytics.com",
    ],

    // Allow self and specific domains for styles
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Needed for Tailwind CSS
      "https://fonts.googleapis.com",
      "https://cdnjs.cloudflare.com",
    ],

    // Allow images from self and common CDNs
    imgSrc: ["'self'", "data:", "https:", "blob:"],

    // Font sources
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
    ],

    // Connect sources for API calls
    connectSrc: [
      "'self'",
      "https://formspree.io",
      "https://api.github.com",
      "https://api.emailjs.com",
      "https://www.google-analytics.com",
    ],

    // Frame sources
    frameSrc: ["'none'"],

    // Object sources
    objectSrc: ["'none'"],

    // Base URI
    baseUri: ["'self'"],

    // Default source
    defaultSrc: ["'self'"],

    // Form actions
    formAction: ["'self'", "https://formspree.io"],

    // Upgrade insecure requests
    upgradeInsecureRequests: true,
  },

  // Enhanced Rate limiting configuration
  rateLimiting: {
    // Contact form rate limiting - More strict
    contactForm: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // Reduced from 5 to 3 attempts
      blockDuration: 30 * 60 * 1000, // 30 minutes block
      message: "Too many contact form submissions, please try again later.",
    },

    // General API rate limiting
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests, please try again later.",
    },

    // Email specific limits
    email: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // Very strict for emails
      blockDuration: 24 * 60 * 60 * 1000, // 24 hours block
      message: "Email rate limit exceeded, please try again later.",
    },
  },

  // Enhanced Security headers
  headers: {
    // Prevent clickjacking
    "X-Frame-Options": "DENY",

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Enable XSS protection
    "X-XSS-Protection": "1; mode=block",

    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Enhanced Permissions policy
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

    // Strict Transport Security (HTTPS only)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    // Cross-Origin policies
    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  },

  // Enhanced CSRF configuration
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

  // Enhanced validation rules
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
      pattern:
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      blockedDomains: [
        "tempmail.org",
        "10minutemail.com",
        "guerrillamail.com",
        "mailinator.com",
        "throwaway.email",
      ],
    },
    subject: {
      minLength: 3,
      maxLength: 100,
      blockedPatterns: [/script/gi, /javascript/gi, /vbscript/gi, /<.*>/gi],
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

  // Enhanced bot detection
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
      /make.*money/gi,
      /work.*from.*home/gi,
    ],
  },
}

// Generate enhanced CSP header string
export const generateCSPHeader = (isDevelopment = false): string => {
  const { csp } = securityConfig

  const directives = [
    `default-src ${csp.defaultSrc.join(" ")}`,
    `script-src ${
      isDevelopment
        ? csp.scriptSrc.join(" ")
        : csp.scriptSrc.filter((src) => !src.includes("unsafe")).join(" ")
    }`,
    `style-src ${csp.styleSrc.join(" ")}`,
    `img-src ${csp.imgSrc.join(" ")}`,
    `font-src ${csp.fontSrc.join(" ")}`,
    `connect-src ${csp.connectSrc.join(" ")}`,
    `frame-src ${csp.frameSrc.join(" ")}`,
    `object-src ${csp.objectSrc.join(" ")}`,
    `base-uri ${csp.baseUri.join(" ")}`,
    `form-action ${csp.formAction.join(" ")}`,
  ]

  if (csp.upgradeInsecureRequests && !isDevelopment) {
    directives.push("upgrade-insecure-requests")
  }

  return directives.join("; ")
}

// Get all security headers including CSP
export const getAllSecurityHeaders = (
  isDevelopment = false
): Record<string, string> => {
  return {
    ...securityConfig.headers,
    "Content-Security-Policy": generateCSPHeader(isDevelopment),
  }
}

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== "string") {
    return ""
  }

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/data:/gi, "") // Remove data: protocol
    .replace(/vbscript:/gi, "") // Remove vbscript: protocol
    .substring(0, 1000) // Limit length
}

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  )
}

export const validateCSRFToken = (
  token: string,
  sessionToken: string
): boolean => {
  return token === sessionToken && token.length === 64
}

// Input validation patterns
export const validationPatterns = {
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  name: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s\-\'\.]{2,50}$/,
  phone: /^[\+]?[\d\s\-\(\)\.]{10,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
}

// Secure storage utilities
export const secureStorage = {
  // Store data with encryption (basic implementation)
  setItem: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value)
      // In a real implementation, you'd encrypt this
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error("Error storing data:", error)
    }
  },

  // Retrieve and decrypt data
  getItem: (key: string): any => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Error retrieving data:", error)
      return null
    }
  },

  // Remove data
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing data:", error)
    }
  },

  // Clear all data
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  },
}
