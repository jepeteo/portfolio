import { sanitizeInput } from "./validation"
import {
  budgetOptions,
  requestTypeOptions,
  urgencyOptions,
} from "../content/services"

const validationPatterns = {
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  name: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s'.-]{2,50}$/,
  websiteUrl:
    /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i,
}

export interface SecureContactFormData {
  name: string
  email: string
  subject: string
  message: string
  requestType?: string
  urgency?: string
  budget?: string
  websiteUrl?: string
  csrfToken?: string
  timestamp?: number
  honeypot?: string // Bot detection
}

export interface ContactFormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  websiteUrl?: string
  general?: string
}

export interface RateLimitState {
  attempts: number
  lastAttempt: number
  blocked: boolean
  blockUntil?: number
}

export const validateEmailSecure = (email: string): boolean => {
  if (!email || typeof email !== "string") return false

  const cleanEmail = email.replace(/\s/g, "")

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

export const validateNameSecure = (name: string): boolean => {
  if (!name || typeof name !== "string") return false

  const trimmed = name.trim()

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

export const validateMessageSecure = (message: string): boolean => {
  if (!message || typeof message !== "string") return false

  const trimmed = message.trim()

  if (trimmed.length < 10 || trimmed.length > 2000) return false

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

export const validateSubjectSecure = (subject: string): boolean => {
  if (!subject || typeof subject !== "string") return false

  const trimmed = subject.trim()

  if (trimmed.length < 3 || trimmed.length > 100) return false

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

export const validateWebsiteUrlOptional = (url: string): boolean => {
  if (!url || !url.trim()) return true
  const trimmed = url.trim()
  if (trimmed.length > 500) return false
  return validationPatterns.websiteUrl.test(trimmed)
}

const allowedRequestTypes = new Set(
  requestTypeOptions.map((option) => option.value)
)
const allowedUrgency = new Set(urgencyOptions.map((option) => option.value))
const allowedBudget = new Set(budgetOptions.map((option) => option.value))

export const sanitizeContactFormData = (
  data: SecureContactFormData
): SecureContactFormData => {
  const requestType =
    data.requestType && allowedRequestTypes.has(data.requestType as never)
      ? data.requestType
      : undefined
  const urgency =
    data.urgency && allowedUrgency.has(data.urgency as never)
      ? data.urgency
      : undefined
  const budget =
    data.budget && allowedBudget.has(data.budget as never)
      ? data.budget
      : undefined

  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email).toLowerCase(),
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
    requestType,
    urgency,
    budget,
    websiteUrl: data.websiteUrl
      ? sanitizeInput(data.websiteUrl).trim()
      : undefined,
    csrfToken: data.csrfToken,
    timestamp: data.timestamp,
    honeypot: data.honeypot,
  }
}

export const detectBot = (data: SecureContactFormData): boolean => {
  if (data.honeypot && data.honeypot.trim() !== "") {
    return true
  }

  if (data.timestamp) {
    const submissionTime = Date.now() - data.timestamp
    if (submissionTime < 3000) {
      return true
    }
  }

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
    /viagra/gi,
    /casino/gi,
    /pharmacy/gi,
    /debt.*relief/gi,
    /weight.*loss/gi,
    /work.*from.*home/gi,
    /make.*money.*fast/gi,
    /free.*consultation/gi,
    /no.*obligation/gi,
    /limited.*time.*offer/gi,
    /act.*now/gi,
  ]

  const matchedPattern = botPatterns.find((pattern) =>
    pattern.test(combinedText)
  )
  if (matchedPattern) {
    return true
  }

  return false
}

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
    } catch {
      state = { attempts: 0, lastAttempt: now, blocked: false }
    }
  }

  if (now - state.lastAttempt > 15 * 60 * 1000) {
    state.attempts = 0
    state.blocked = false
    state.blockUntil = undefined
  }

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
    state.attempts = 0
    state.blocked = false
    state.blockUntil = undefined
  } else {
    state.attempts += 1
    state.lastAttempt = now

    if (state.attempts >= 5) {
      state.blocked = true
      state.blockUntil = now + 30 * 60 * 1000 // Block for 30 minutes
    }
  }

  localStorage.setItem(key, JSON.stringify(state))
  return state
}

export const validateContactFormSecure = (
  data: SecureContactFormData
): {
  isValid: boolean
  errors: ContactFormErrors
  isBot: boolean
} => {
  const errors: ContactFormErrors = {}

  const isBot = detectBot(data)
  if (isBot) {
    return {
      isValid: false,
      errors: { general: "Invalid submission detected" },
      isBot: true,
    }
  }

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

  if (data.websiteUrl && !validateWebsiteUrlOptional(data.websiteUrl)) {
    errors.websiteUrl = "Please enter a valid website URL"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isBot: false,
  }
}
