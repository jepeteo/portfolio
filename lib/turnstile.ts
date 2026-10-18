const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

type SiteverifyResponse = {
  success?: boolean
  "error-codes"?: string[]
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token.trim()) {
    return false
  }

  const body = new URLSearchParams()
  body.set("secret", secret)
  body.set("response", token)
  if (remoteIp && remoteIp !== "unknown") {
    body.set("remoteip", remoteIp)
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    })
    if (!response.ok) {
      console.error("Turnstile siteverify HTTP error", response.status)
      return false
    }

    const result = (await response.json()) as SiteverifyResponse
    if (!result.success) {
      console.error("Turnstile rejected contact submission", result["error-codes"] || [])
      return false
    }
    return true
  } catch (error) {
    console.error("Turnstile siteverify failed", error)
    return false
  }
}
