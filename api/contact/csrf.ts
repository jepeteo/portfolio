import {
  buildCsrfCookie,
  createCsrfToken,
  requestIsHttps,
} from "../../lib/contactCsrf"

type VercelRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
}

type VercelResponse = {
  status: (statusCode: number) => VercelResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string | string[]) => void
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const token = createCsrfToken()

  res.setHeader("Cache-Control", "no-store")
  res.setHeader("Set-Cookie", buildCsrfCookie(token, requestIsHttps(req)))
  res.status(200).json({ csrfToken: token })
}
