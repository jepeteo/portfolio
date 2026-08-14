import React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

export const VercelIntegrations: React.FC = () => {
  // Avoid preview/localhost 404s on /_vercel/insights/script.js
  if (import.meta.env.DEV) {
    return null
  }

  return (
    <>
      <Analytics debug={false} />
      <SpeedInsights debug={false} />
    </>
  )
}
