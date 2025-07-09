import React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
export const VercelIntegrations: React.FC = () => {
  return (
    <>
      <Analytics debug={false} />
      <SpeedInsights debug={false} />
    </>
  )
}
