import React, { useEffect, useState } from "react"

interface VercelConfig {
  analyticsEnabled: boolean
  speedInsightsEnabled: boolean
  debug: boolean
}

const getVercelConfig = (): VercelConfig => {
  const isVercel =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "theodorosmentis.com" ||
      process.env.VERCEL === "1")

  const analyticsEnabled = process.env.VITE_VERCEL_ANALYTICS_ENABLED === "true"
  const speedInsightsEnabled =
    process.env.VITE_VERCEL_SPEED_INSIGHTS_ENABLED === "true"
  const debug = process.env.NODE_ENV === "development"

  return {
    analyticsEnabled: isVercel && analyticsEnabled,
    speedInsightsEnabled: isVercel && speedInsightsEnabled,
    debug,
  }
}

export const VercelAnalytics: React.FC = () => {
  const [loaded, setLoaded] = useState(false)
  const config = getVercelConfig()

  useEffect(() => {
    if (!config.analyticsEnabled || loaded) return

    import("@vercel/analytics/react")
      .then(({ Analytics: _Analytics }) => {
        setLoaded(true)
        if (config.debug) {
          console.log("✅ Vercel Analytics React component loaded")
        }
      })
      .catch((error) => {
        if (config.debug) {
          console.warn(
            "⚠️ Failed to load Vercel Analytics React component:",
            error
          )
        }
      })
  }, [config.analyticsEnabled, config.debug, loaded])

  if (!config.analyticsEnabled) {
    if (config.debug) {
      console.log("🚫 Vercel Analytics disabled")
    }
    return null
  }

  // Dynamically import and render the Analytics component
  const [AnalyticsComponent, setAnalyticsComponent] =
    useState<React.ComponentType | null>(null)

  useEffect(() => {
    if (config.analyticsEnabled && !AnalyticsComponent) {
      import("@vercel/analytics/react")
        .then(({ Analytics }) => {
          setAnalyticsComponent(() => Analytics)
        })
        .catch(() => {
          // Fail silently in production
        })
    }
  }, [config.analyticsEnabled, AnalyticsComponent])

  return AnalyticsComponent ? React.createElement(AnalyticsComponent) : null
}

export const VercelSpeedInsights: React.FC = () => {
  const [loaded, setLoaded] = useState(false)
  const config = getVercelConfig()

  useEffect(() => {
    if (!config.speedInsightsEnabled || loaded) return

    import("@vercel/speed-insights/react")
      .then(({ SpeedInsights: _SpeedInsights }) => {
        setLoaded(true)
        if (config.debug) {
          console.log("✅ Vercel Speed Insights React component loaded")
        }
      })
      .catch((error) => {
        if (config.debug) {
          console.warn(
            "⚠️ Failed to load Vercel Speed Insights React component:",
            error
          )
        }
      })
  }, [config.speedInsightsEnabled, config.debug, loaded])

  if (!config.speedInsightsEnabled) {
    if (config.debug) {
      console.log("🚫 Vercel Speed Insights disabled")
    }
    return null
  }

  // Dynamically import and render the SpeedInsights component
  const [SpeedInsightsComponent, setSpeedInsightsComponent] =
    useState<React.ComponentType | null>(null)

  useEffect(() => {
    if (config.speedInsightsEnabled && !SpeedInsightsComponent) {
      import("@vercel/speed-insights/react")
        .then(({ SpeedInsights }) => {
          setSpeedInsightsComponent(() => SpeedInsights)
        })
        .catch(() => {
          // Fail silently in production
        })
    }
  }, [config.speedInsightsEnabled, SpeedInsightsComponent])

  return SpeedInsightsComponent
    ? React.createElement(SpeedInsightsComponent)
    : null
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
