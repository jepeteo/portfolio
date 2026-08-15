import React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const isLocalHost = () => {
  if (typeof window === "undefined") return false
  const host = window.location.hostname
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]"
}

export const VercelIntegrations: React.FC = () => {
  // Avoid preview/localhost 404s on /_vercel/insights/script.js
  if (import.meta.env.DEV || isLocalHost()) {
    return null
  }

  return (
    <>
      <Analytics debug={false} />
      <SpeedInsights debug={false} />
    </>
  )
}
