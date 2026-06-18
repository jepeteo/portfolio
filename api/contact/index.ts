import { verifyCsrf } from "./csrf"
import {
  detectBot,
  sanitizeContactFormData,
  validateContactFormSecure,
  type SecureContactFormData,
} from "../../src/utils/secureContactValidation"

type VercelRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
  socket?: { remoteAddress?: string }
}

type VercelResponse = {
  status: (statusCode: number) => VercelResponse
  json: (body: unknown) => void
}

type ContactPayload = SecureContactFormData & {
  csrfToken?: string
}

type RateLimitEntry = {
  attempts: number
  windowStart: number
  blockedUntil?: number
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_BLOCK_MS = 30 * 60 * 1000

const rateLimitStore = new Map<string, RateLimitEntry>()

function getHeader(req: VercelRequest, key: string): string {
  const raw = req.headers[key]
  if (Array.isArray(raw)) return raw[0] ?? ""
  return raw ?? ""
}

function getClientIp(req: VercelRequest): string {
  const forwardedFor = getHeader(req, "x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  const realIp = getHeader(req, "x-real-ip")
  return realIp || req.socket?.remoteAddress || "unknown"
}

function getRequestFingerprint(req: VercelRequest): string {
  const ip = getClientIp(req)
  const userAgent = getHeader(req, "user-agent") || "unknown"
  return `${ip}:${userAgent}`
}

function cleanupRateLimits() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.blockedUntil && value.blockedUntil <= now) {
      rateLimitStore.delete(key)
      continue
    }
    if (!value.blockedUntil && now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key)
    }
  }
}

function checkRateLimit(fingerprint: string): { allowed: boolean; retryAfterSec: number } {
  cleanupRateLimits()
  const now = Date.now()
  const current = rateLimitStore.get(fingerprint)

  if (!current) {
    return { allowed: true, retryAfterSec: 0 }
  }

  if (current.blockedUntil && current.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((current.blockedUntil - now) / 1000),
    }
  }

  if (now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    return { allowed: true, retryAfterSec: 0 }
  }

  return {
    allowed: current.attempts < RATE_LIMIT_MAX,
    retryAfterSec: Math.ceil((current.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000),
  }
}

function recordAttempt(fingerprint: string, shouldBlock = false) {
  const now = Date.now()
  const existing = rateLimitStore.get(fingerprint)

  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(fingerprint, {
      attempts: 1,
      windowStart: now,
      blockedUntil: shouldBlock ? now + RATE_LIMIT_BLOCK_MS : undefined,
    })
    return
  }

  const attempts = existing.attempts + 1
  rateLimitStore.set(fingerprint, {
    attempts,
    windowStart: existing.windowStart,
    blockedUntil:
      shouldBlock || attempts >= RATE_LIMIT_MAX ? now + RATE_LIMIT_BLOCK_MS : undefined,
  })
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false
  const productionOrigin = process.env.PUBLIC_SITE_ORIGIN
  if (productionOrigin && origin === productionOrigin) {
    return true
  }
  return origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")
}

async function sendViaEmailJs(data: SecureContactFormData) {
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY
  const toEmail = process.env.CONTACT_EMAIL || process.env.VITE_CONTACT_EMAIL

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Email provider is not configured")
  }

  // TODO: Update the EmailJS template to include request_type, urgency, budget,
  // and website_url variables so lead qualification fields appear in notification emails.
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        request_type: data.requestType || "Not provided",
        urgency: data.urgency || "Not provided",
        budget: data.budget || "Not provided",
        website_url: data.websiteUrl || "Not provided",
        to_email: toEmail || "th.mentis@gmail.com",
        reply_to: data.email,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`EmailJS request failed with status ${response.status}`)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const origin = getHeader(req, "origin")
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ error: "Invalid origin" })
    return
  }

  const payload = (req.body || {}) as ContactPayload
  const csrfToken = payload.csrfToken || getHeader(req, "x-csrf-token")
  if (!verifyCsrf(req, csrfToken || "")) {
    res.status(403).json({ error: "CSRF validation failed" })
    return
  }

  const fingerprint = getRequestFingerprint(req)
  const rateLimit = checkRateLimit(fingerprint)
  if (!rateLimit.allowed) {
    res.status(429).json({
      error: "Too many submissions. Please try again later.",
      retryAfterSeconds: rateLimit.retryAfterSec,
    })
    return
  }

  const secureData: SecureContactFormData = {
    name: payload.name || "",
    email: payload.email || "",
    subject: payload.subject || "",
    message: payload.message || "",
    requestType: payload.requestType || "",
    urgency: payload.urgency || "",
    budget: payload.budget || "",
    websiteUrl: payload.websiteUrl || "",
    honeypot: payload.honeypot || "",
    timestamp: payload.timestamp || 0,
  }

  if (detectBot(secureData)) {
    recordAttempt(fingerprint, true)
    res.status(400).json({ error: "Bot-like submission detected" })
    return
  }

  const validation = validateContactFormSecure(secureData)
  if (!validation.isValid) {
    recordAttempt(fingerprint, false)
    res.status(400).json({
      error: "Validation failed",
      fields: validation.errors,
    })
    return
  }

  const sanitized = sanitizeContactFormData(secureData)

  try {
    await sendViaEmailJs(sanitized)
    res.status(200).json({ success: true })
  } catch {
    res.status(502).json({ error: "Email provider rejected the request" })
  }
}
