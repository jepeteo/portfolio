import { sanitizeInput, validationPatterns } from "./security"

export interface SecureContactFormData {
  name: string
  email: string
  subject: string
  message: string
  csrfToken?: string
  timestamp?: number
  honeypot?: string // Bot detection
}

export interface ContactFormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  general?: string
}

export interface RateLimitState {
  attempts: number
  lastAttempt: number
  blocked: boolean
  blockUntil?: number
}

// Enhanced email validation with security checks
export const validateEmailSecure = (email: string): boolean => {
  if (!email || typeof email !== "string") return false

  // Remove any spaces (emails shouldn't have spaces)
  const cleanEmail = email.replace(/\s/g, "")

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<.*>/gi, // HTML tags
  ]

  if (suspiciousPatterns.some((pattern) => pattern.test(cleanEmail))) {
    return false
  }

  return (
    validationPatterns.email.test(cleanEmail) &&
    cleanEmail.length >= 5 &&
    cleanEmail.length <= 254
  )
}

// Enhanced name validation with security checks
export const validateNameSecure = (name: string): boolean => {
  if (!name || typeof name !== "string") return false

  const trimmed = name.trim()

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<.*>/gi, // HTML tags
    /\{.*\}/gi, // Template literals
  ]

  if (suspiciousPatterns.some((pattern) => pattern.test(trimmed))) {
    return false
  }

  return validationPatterns.name.test(trimmed)
}

// Enhanced message validation with security checks
export const validateMessageSecure = (message: string): boolean => {
  if (!message || typeof message !== "string") return false

  const trimmed = message.trim()

  if (trimmed.length < 10 || trimmed.length > 2000) return false

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<script.*?>/gi,
    /<iframe.*?>/gi,
    /<object.*?>/gi,
    /<embed.*?>/gi,
  ]

  if (suspiciousPatterns.some((pattern) => pattern.test(trimmed))) {
    return false
  }

  return true
}

// Subject validation with security checks
export const validateSubjectSecure = (subject: string): boolean => {
  if (!subject || typeof subject !== "string") return false

  const trimmed = subject.trim()

  if (trimmed.length < 3 || trimmed.length > 100) return false

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /<.*>/gi, // HTML tags
  ]

  if (suspiciousPatterns.some((pattern) => pattern.test(trimmed))) {
    return false
  }

  return true
}

// Enhanced sanitization
export const sanitizeContactFormData = (
  data: SecureContactFormData
): SecureContactFormData => {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email).toLowerCase(),
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
    csrfToken: data.csrfToken,
    timestamp: data.timestamp,
    honeypot: data.honeypot, // Should always be empty for humans
  }
}

// Bot detection
export const detectBot = (data: SecureContactFormData): boolean => {
  // Check honeypot field (should be empty for humans)
  if (data.honeypot && data.honeypot.trim() !== "") {
    return true
  }

  // Check submission speed (too fast = bot)
  if (data.timestamp) {
    const submissionTime = Date.now() - data.timestamp
    if (submissionTime < 3000) {
      // Less than 3 seconds
      return true
    }
  }

  // Check for suspicious patterns in combined text
  const combinedText =
    `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase()

  const botPatterns = [
    /buy.*now/gi,
    /click.*here/gi,
    /visit.*website/gi,
    /guaranteed/gi,
    /increase.*traffic/gi,
    /seo.*service/gi,
    /lorem ipsum/gi,
    /test.*test/gi,
  ]

  if (botPatterns.some((pattern) => pattern.test(combinedText))) {
    return true
  }

  return false
}

// Rate limiting
export const checkRateLimit = (ip: string): RateLimitState => {
  const key = `rate_limit_${ip}`
  const stored = localStorage.getItem(key)
  const now = Date.now()

  let state: RateLimitState = {
    attempts: 0,
    lastAttempt: now,
    blocked: false,
  }

  if (stored) {
    try {
      state = JSON.parse(stored)
    } catch (error) {
      // Reset if parsing fails
      state = { attempts: 0, lastAttempt: now, blocked: false }
    }
  }

  // Reset counter if enough time has passed (15 minutes)
  if (now - state.lastAttempt > 15 * 60 * 1000) {
    state.attempts = 0
    state.blocked = false
    state.blockUntil = undefined
  }

  // Check if still blocked
  if (state.blockUntil && now < state.blockUntil) {
    state.blocked = true
  } else {
    state.blocked = false
    state.blockUntil = undefined
  }

  return state
}

export const updateRateLimit = (
  ip: string,
  success: boolean = false
): RateLimitState => {
  const key = `rate_limit_${ip}`
  const state = checkRateLimit(ip)
  const now = Date.now()

  if (success) {
    // Reset on successful submission
    state.attempts = 0
    state.blocked = false
    state.blockUntil = undefined
  } else {
    // Increment attempts
    state.attempts += 1
    state.lastAttempt = now

    // Block if too many attempts
    if (state.attempts >= 5) {
      state.blocked = true
      state.blockUntil = now + 30 * 60 * 1000 // Block for 30 minutes
    }
  }

  localStorage.setItem(key, JSON.stringify(state))
  return state
}

// Complete secure form validation
export const validateContactFormSecure = (
  data: SecureContactFormData
): {
  isValid: boolean
  errors: ContactFormErrors
  isBot: boolean
} => {
  const errors: ContactFormErrors = {}

  // Check for bot
  const isBot = detectBot(data)
  if (isBot) {
    return {
      isValid: false,
      errors: { general: "Invalid submission detected" },
      isBot: true,
    }
  }

  // Validate individual fields
  if (!validateNameSecure(data.name)) {
    errors.name = "Please enter a valid name (2-50 characters, letters only)"
  }

  if (!validateEmailSecure(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!validateSubjectSecure(data.subject)) {
    errors.subject = "Please enter a valid subject (3-100 characters)"
  }

  if (!validateMessageSecure(data.message)) {
    errors.message = "Please enter a valid message (10-2000 characters)"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isBot: false,
  }
}
