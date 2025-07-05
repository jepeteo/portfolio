import React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

interface VercelConfig {
  analyticsEnabled: boolean
  speedInsightsEnabled: boolean
  isVercel: boolean
  debug: boolean
}

const getVercelConfig = (): VercelConfig => {
  const isVercel =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "theodorosmentis.com" ||
      import.meta.env.VERCEL === "1")

  const analyticsEnabled =
    import.meta.env.VITE_VERCEL_ANALYTICS_ENABLED === "true"
  const speedInsightsEnabled =
    import.meta.env.VITE_VERCEL_SPEED_INSIGHTS_ENABLED === "true"
  const debug = import.meta.env.DEV

  return {
    analyticsEnabled,
    speedInsightsEnabled,
    isVercel,
    debug,
  }
}

export const VercelAnalytics: React.FC = () => {
  const config = getVercelConfig()

  // Only render on Vercel when enabled
  if (!config.isVercel || !config.analyticsEnabled) {
    if (config.debug) {
      console.log("🚫 Vercel Analytics disabled:", {
        isVercel: config.isVercel,
        analyticsEnabled: config.analyticsEnabled,
      })
    }
    return null
  }

  if (config.debug) {
    console.log("✅ Vercel Analytics enabled")
  }

  return <Analytics />
}

export const VercelSpeedInsights: React.FC = () => {
  const config = getVercelConfig()

  // Only render on Vercel when enabled
  if (!config.isVercel || !config.speedInsightsEnabled) {
    if (config.debug) {
      console.log("🚫 Vercel Speed Insights disabled:", {
        isVercel: config.isVercel,
        speedInsightsEnabled: config.speedInsightsEnabled,
      })
    }
    return null
  }

  if (config.debug) {
    console.log("✅ Vercel Speed Insights enabled")
  }

  return <SpeedInsights />
}

// Combined component for convenience
export const VercelIntegrations: React.FC = () => {
  return (
    <>
      <VercelAnalytics />
      <VercelSpeedInsights />
    </>
  )
}
