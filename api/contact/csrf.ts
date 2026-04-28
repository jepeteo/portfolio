import crypto from "node:crypto"

type VercelRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
}

type VercelResponse = {
  status: (statusCode: number) => VercelResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string | string[]) => void
}

const CSRF_COOKIE_NAME = "contact_csrf_token"
const TOKEN_TTL_MS = 30 * 60 * 1000

const tokenStore = new Map<string, number>()

function pruneExpiredTokens() {
  const now = Date.now()
  for (const [token, expiresAt] of tokenStore.entries()) {
    if (expiresAt <= now) {
      tokenStore.delete(token)
    }
  }
}

function createToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

function buildCookie(token: string): string {
  const maxAge = TOKEN_TTL_MS / 1000
  return `${CSRF_COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`
}

function extractCookieValue(cookieHeader: string | undefined, name: string): string {
  if (!cookieHeader) {
    return ""
  }

  const cookie = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : ""
}

export function verifyCsrf(req: VercelRequest, providedToken: string): boolean {
  pruneExpiredTokens()

  if (!providedToken) {
    return false
  }

  const cookieHeader = Array.isArray(req.headers.cookie)
    ? req.headers.cookie.join(";")
    : req.headers.cookie
  const cookieToken = extractCookieValue(cookieHeader, CSRF_COOKIE_NAME)

  if (!cookieToken || cookieToken !== providedToken) {
    return false
  }

  const expiresAt = tokenStore.get(providedToken)
  return typeof expiresAt === "number" && expiresAt > Date.now()
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  pruneExpiredTokens()
  const token = createToken()
  tokenStore.set(token, Date.now() + TOKEN_TTL_MS)

  res.setHeader("Cache-Control", "no-store")
  res.setHeader("Set-Cookie", buildCookie(token))
  res.status(200).json({ csrfToken: token })
}
