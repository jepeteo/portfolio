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

// Stateless, signed double-submit CSRF tokens.
//
// Serverless functions do not share memory across instances, so an in-memory
// token store is unreliable (the GET that issues a token and the POST that
// verifies it may run on different instances). Instead we issue a token of the
// form `${nonce}.${expiry}.${hmac}` set in an HttpOnly+SameSite=Strict cookie
// and also returned in the response body. Verification recomputes the HMAC and
// checks expiry, then requires the cookie value to match the submitted value
// (double-submit). This is the real CSRF protection: a cross-site attacker can
// neither read the HttpOnly cookie nor forge a matching body token, regardless
// of which instance handles the request. The HMAC + expiry add integrity and a
// lifetime so tokens cannot be replayed indefinitely.
//
// CSRF_SECRET should be set in the deployment environment. A static fallback is
// used otherwise so the feature keeps working, but the double-submit cookie is
// what actually prevents forgery.
function getSecret(): string {
  return (
    process.env.CSRF_SECRET ||
    process.env.PUBLIC_SITE_ORIGIN ||
    "tm-portfolio-contact-csrf-fallback-secret"
  )
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex")
}

function createToken(): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const expiry = Date.now() + TOKEN_TTL_MS
  const payload = `${nonce}.${expiry}`
  return `${payload}.${sign(payload)}`
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

function isValidSignedToken(token: string): boolean {
  const parts = token.split(".")
  if (parts.length !== 3) {
    return false
  }

  const [nonce, expiryRaw, providedSig] = parts
  const expiry = Number(expiryRaw)
  if (!nonce || !Number.isFinite(expiry) || expiry <= Date.now()) {
    return false
  }

  const expectedSig = sign(`${nonce}.${expiry}`)
  const expectedBuf = Buffer.from(expectedSig, "hex")
  const providedBuf = Buffer.from(providedSig, "hex")
  if (expectedBuf.length !== providedBuf.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuf, providedBuf)
}

export function verifyCsrf(req: VercelRequest, providedToken: string): boolean {
  if (!providedToken || !isValidSignedToken(providedToken)) {
    return false
  }

  const cookieHeader = Array.isArray(req.headers.cookie)
    ? req.headers.cookie.join(";")
    : req.headers.cookie
  const cookieToken = extractCookieValue(cookieHeader, CSRF_COOKIE_NAME)

  if (!cookieToken || cookieToken.length !== providedToken.length) {
    return false
  }

  // Constant-time double-submit comparison.
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(providedToken)
  )
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const token = createToken()

  res.setHeader("Cache-Control", "no-store")
  res.setHeader("Set-Cookie", buildCookie(token))
  res.status(200).json({ csrfToken: token })
}
