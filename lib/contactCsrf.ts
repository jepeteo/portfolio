import crypto from "node:crypto"

type HeaderValue = string | string[] | undefined

export type CsrfRequest = {
  headers: Record<string, HeaderValue>
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

export function createCsrfToken(): string {
  const nonce = crypto.randomBytes(16).toString("hex")
  const expiry = Date.now() + TOKEN_TTL_MS
  const payload = `${nonce}.${expiry}`
  return `${payload}.${sign(payload)}`
}

export function requestIsHttps(req: CsrfRequest): boolean {
  const forwarded = req.headers["x-forwarded-proto"]
  const proto = Array.isArray(forwarded) ? forwarded[0] : forwarded
  if (proto) {
    return proto.split(",")[0].trim() === "https"
  }

  const hostHeader = req.headers.host
  const host = (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader) || ""
  if (
    host.startsWith("localhost:") ||
    host.startsWith("127.0.0.1:") ||
    host === "localhost" ||
    host === "127.0.0.1"
  ) {
    return false
  }

  return true
}

export function buildCsrfCookie(token: string, secure: boolean): string {
  const maxAge = TOKEN_TTL_MS / 1000
  const secureFlag = secure ? "; Secure" : ""
  return `${CSRF_COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly${secureFlag}; SameSite=Strict`
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

export function verifyCsrf(req: CsrfRequest, providedToken: string): boolean {
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

  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(providedToken)
  )
}
