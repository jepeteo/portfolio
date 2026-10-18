// lib/contactCsrf.ts
import crypto from "node:crypto";
var CSRF_COOKIE_NAME = "contact_csrf_token";
var TOKEN_TTL_MS = 30 * 60 * 1e3;
function getSecret() {
  return process.env.CSRF_SECRET || process.env.PUBLIC_SITE_ORIGIN || "tm-portfolio-contact-csrf-fallback-secret";
}
function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}
function createCsrfToken() {
  const nonce = crypto.randomBytes(16).toString("hex");
  const expiry = Date.now() + TOKEN_TTL_MS;
  const payload = `${nonce}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}
function requestIsHttps(req) {
  const forwarded = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (proto) {
    return proto.split(",")[0].trim() === "https";
  }
  const hostHeader = req.headers.host;
  const host = (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader) || "";
  if (host.startsWith("localhost:") || host.startsWith("127.0.0.1:") || host === "localhost" || host === "127.0.0.1") {
    return false;
  }
  return true;
}
function buildCsrfCookie(token, secure) {
  const maxAge = TOKEN_TTL_MS / 1e3;
  const secureFlag = secure ? "; Secure" : "";
  return `${CSRF_COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly${secureFlag}; SameSite=Strict`;
}

// lib/contact/csrfHandler.ts
function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const token = createCsrfToken();
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Set-Cookie", buildCsrfCookie(token, requestIsHttps(req)));
  res.status(200).json({ csrfToken: token });
}
export {
  handler as default
};
