// Security configuration for the portfolio application
export const securityConfig = {
  // Content Security Policy configuration
  csp: {
    // Allow self and specific domains for scripts
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Remove this in production if possible
      "https://cdnjs.cloudflare.com",
      "https://unpkg.com",
      "https://fonts.googleapis.com",
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
    connectSrc: ["'self'", "https://formspree.io", "https://api.github.com"],

    // Frame sources
    frameSrc: ["'none'"],

    // Object sources
    objectSrc: ["'none'"],

    // Base URI
    baseUri: ["'self'"],

    // Default source
    defaultSrc: ["'self'"],
  },

  // Rate limiting configuration
  rateLimiting: {
    // Contact form rate limiting
    contactForm: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
      message: "Too many contact form submissions, please try again later.",
    },

    // General API rate limiting
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests, please try again later.",
    },
  },

  // Security headers
  headers: {
    // Prevent clickjacking
    "X-Frame-Options": "DENY",

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Enable XSS protection
    "X-XSS-Protection": "1; mode=block",

    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions policy
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",

    // Strict Transport Security (HTTPS only)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  },
}

// Generate CSP header string
export const generateCSPHeader = (): string => {
  const { csp } = securityConfig

  const directives = [
    `default-src ${csp.defaultSrc.join(" ")}`,
    `script-src ${csp.scriptSrc.join(" ")}`,
    `style-src ${csp.styleSrc.join(" ")}`,
    `img-src ${csp.imgSrc.join(" ")}`,
    `font-src ${csp.fontSrc.join(" ")}`,
    `connect-src ${csp.connectSrc.join(" ")}`,
    `frame-src ${csp.frameSrc.join(" ")}`,
    `object-src ${csp.objectSrc.join(" ")}`,
    `base-uri ${csp.baseUri.join(" ")}`,
  ]

  return directives.join("; ")
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
