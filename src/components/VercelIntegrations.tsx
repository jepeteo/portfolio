import React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

// Simple, direct implementation - no conditions, no failsafe
export const VercelIntegrations: React.FC = () => {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
