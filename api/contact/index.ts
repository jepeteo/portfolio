import crypto from "node:crypto"
import { Resend } from "resend"
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

// Best-effort, per-instance rate limiting. This Map lives in the memory of a
// single serverless instance and is NOT shared across instances or cold starts,
// so it cannot guarantee a global limit. It is a cheap first line of defense
// against bursts; combined with the CSRF double-submit token, honeypot, and
// timing checks it is sufficient for a low-traffic contact form. For a hard
// global guarantee, back this with a shared store (e.g. Upstash Redis / Vercel
// KV) keyed by the request fingerprint.
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

const CANONICAL_ORIGINS = new Set([
  "https://www.theodorosmentis.com",
  "https://theodorosmentis.com",
])

const DEFAULT_FROM = "Portfolio <notifications@send.theodorosmentis.com>"
const DEFAULT_TO = "contact@theodorosmentis.com"

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false
  if (CANONICAL_ORIGINS.has(origin)) return true
  const productionOrigin = process.env.PUBLIC_SITE_ORIGIN
  if (productionOrigin && origin === productionOrigin) {
    return true
  }
  return origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

type DetailRow = {
  label: string
  text: string
  href?: string
}

function present(value: string | undefined): string {
  return value?.trim() ?? ""
}

function formatSubmittedAt(date: Date): string {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date)
  return `${formatted} Europe/Berlin`
}

function websiteHref(value: string): string | undefined {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(withProtocol)
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined
    return url.href
  } catch {
    return undefined
  }
}

function contactDetailRows(data: SecureContactFormData, submittedAt: string): DetailRow[] {
  const rows: DetailRow[] = [
    { label: "Name", text: data.name },
    { label: "Email", text: data.email, href: `mailto:${data.email}` },
  ]

  const requestType = present(data.requestType)
  const urgency = present(data.urgency)
  const budget = present(data.budget)
  const website = present(data.websiteUrl)
  const sourcePage = present(data.sourcePage)

  if (requestType) rows.push({ label: "Request type", text: requestType })
  if (urgency) rows.push({ label: "Urgency", text: urgency })
  if (budget) rows.push({ label: "Budget", text: budget })
  if (website) rows.push({ label: "Website", text: website, href: websiteHref(website) })
  if (sourcePage) rows.push({ label: "Source page", text: sourcePage })
  rows.push({ label: "Submitted", text: submittedAt })

  return rows
}

function renderContactText(data: SecureContactFormData, rows: DetailRow[]): string {
  const details = rows.map((row) => `${row.label}: ${row.text}`).join("\n")
  return [
    "New enquiry",
    "Theodoros Mentis",
    "",
    data.subject,
    "",
    data.message,
    "",
    details,
    "",
    "Reply to this email to reach the visitor.",
  ].join("\n")
}

function renderDetailValue(row: DetailRow): string {
  const text = escapeHtml(row.text)
  if (!row.href) return text
  return `<a href="${escapeHtml(row.href)}" style="color:#0369a1;text-decoration:underline;">${text}</a>`
}

function renderContactHtml(data: SecureContactFormData, rows: DetailRow[]): string {
  const message = escapeHtml(data.message).replace(/\r\n|\n|\r/g, "<br />")
  const detailRows = rows
    .map(
      (row) => `<tr>
        <td style="padding:8px 16px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#64748b;vertical-align:top;width:120px;">${escapeHtml(row.label)}</td>
        <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;color:#0f172a;vertical-align:top;">${renderDetailValue(row)}</td>
      </tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f6f8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:4px;">
            <tr>
              <td style="background:#0369a1;padding:16px 24px;border-radius:4px 4px 0 0;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:#e0f2fe;">New enquiry</p>
                <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.3;font-weight:bold;color:#ffffff;">Theodoros Mentis</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:1.3;font-weight:bold;color:#0f172a;">${escapeHtml(data.subject)}</h1>
                <div style="margin:0 0 24px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0f172a;">${message}</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>
                <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;color:#64748b;">Reply to this email to reach the visitor.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

async function sendViaResend(data: SecureContactFormData, csrfToken: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || DEFAULT_FROM
  const toEmail = process.env.CONTACT_EMAIL || DEFAULT_TO

  if (!apiKey) {
    console.error("Contact email is not configured: RESEND_API_KEY is missing")
    throw new Error("Email provider is not configured")
  }

  const submittedAt = formatSubmittedAt(new Date())
  const rows = contactDetailRows(data, submittedAt)
  const text = renderContactText(data, rows)
  const html = renderContactHtml(data, rows)
  const idempotencyKey = `contact-form/${crypto.createHash("sha256").update(csrfToken).digest("hex")}`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send(
    {
      from,
      to: [toEmail],
      replyTo: data.email,
      subject: data.subject,
      text,
      html,
    },
    { idempotencyKey }
  )

  if (error) {
    console.error("Resend rejected contact email", error)
    throw new Error(error.message)
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
    sourcePage: payload.sourcePage || "",
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
    await sendViaResend(sanitized, csrfToken)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Contact email failed", error)
    res.status(502).json({ error: "Email provider rejected the request" })
  }
}
