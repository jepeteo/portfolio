export const securityConfig = {
  csp: {
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for development - remove in production
      "https://cdnjs.cloudflare.com",
      "https://cdn.emailjs.com",
      "https://www.googletagmanager.com", // For analytics
      "https://www.google-analytics.com",
    ],

    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Needed for Tailwind CSS
      "https://fonts.googleapis.com",
      "https://cdnjs.cloudflare.com",
    ],

    imgSrc: ["'self'", "data:", "https:", "blob:"],

    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
    ],

    connectSrc: [
      "'self'",
      "https://formspree.io",
      "https://api.github.com",
      "https://api.emailjs.com",
      "https://www.google-analytics.com",
    ],

    frameSrc: ["'none'"],

    objectSrc: ["'none'"],

    baseUri: ["'self'"],

    defaultSrc: ["'self'"],

    formAction: ["'self'", "https://formspree.io"],

    upgradeInsecureRequests: true,
  },

  rateLimiting: {
    contactForm: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 3, // Reduced from 5 to 3 attempts
      blockDuration: 30 * 60 * 1000, // 30 minutes block
      message: "Too many contact form submissions, please try again later.",
    },

    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests, please try again later.",
    },

    email: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // Very strict for emails
      blockDuration: 24 * 60 * 60 * 1000, // 24 hours block
      message: "Email rate limit exceeded, please try again later.",
    },
  },

  headers: {
    "X-Frame-Options": "DENY",

    "X-Content-Type-Options": "nosniff",

    "X-XSS-Protection": "1; mode=block",

    "Referrer-Policy": "strict-origin-when-cross-origin",

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

    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  },

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

  validation: {
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s'-]+$/,
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

export const getAllSecurityHeaders = (
  isDevelopment = false
): Record<string, string> => {
  return {
    ...securityConfig.headers,
    "Content-Security-Policy": generateCSPHeader(isDevelopment),
  }
}

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

export const validationPatterns = {
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  name: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s'.-]{2,50}$/,
  phone: /^[+]?[\ds().'-]{10,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
}

export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value)

      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error("Failed to set item in localStorage:", error)
    }
  },

  getItem: (key: string): any => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Failed to get item from localStorage:", error)
      return null
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Failed to remove item from localStorage:", error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error("Failed to clear localStorage:", error)
    }
  },
}
