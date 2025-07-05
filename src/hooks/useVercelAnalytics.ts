import { useEffect } from "react"

// Vercel Analytics and Speed Insights with failsafe
let analyticsLoaded = false
let speedInsightsLoaded = false

interface VercelConfig {
  analyticsEnabled: boolean
  speedInsightsEnabled: boolean
  debug: boolean
}

const getVercelConfig = (): VercelConfig => {
  // Check if we're in Vercel environment and analytics are enabled
  const isVercel =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "theodorosmentis.com" ||
      process.env.VERCEL === "1")

  // Environment variable controls (set in Vercel dashboard)
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

export const useVercelAnalytics = () => {
  useEffect(() => {
    const config = getVercelConfig()

    // Load Analytics
    if (config.analyticsEnabled && !analyticsLoaded) {
      import("@vercel/analytics")
        .then((_analytics) => {
          if (typeof window !== "undefined") {
            analyticsLoaded = true
            if (config.debug) {
              console.log("✅ Vercel Analytics loaded")
            }
          }
        })
        .catch((error) => {
          if (config.debug) {
            console.warn("⚠️ Failed to load Vercel Analytics:", error)
          }
        })
    }

    // Load Speed Insights
    if (config.speedInsightsEnabled && !speedInsightsLoaded) {
      import("@vercel/speed-insights")
        .then((_speedInsights) => {
          if (typeof window !== "undefined") {
            speedInsightsLoaded = true
            if (config.debug) {
              console.log("✅ Vercel Speed Insights loaded")
            }
          }
        })
        .catch((error) => {
          if (config.debug) {
            console.warn("⚠️ Failed to load Vercel Speed Insights:", error)
          }
        })
    }

    if (config.debug) {
      console.log("🔍 Vercel Config:", {
        analyticsEnabled: config.analyticsEnabled,
        speedInsightsEnabled: config.speedInsightsEnabled,
        isVercel:
          typeof window !== "undefined" &&
          (window.location.hostname.includes("vercel.app") ||
            window.location.hostname === "theodorosmentis.com"),
      })
    }
  }, [])

  return {
    analyticsEnabled: getVercelConfig().analyticsEnabled,
    speedInsightsEnabled: getVercelConfig().speedInsightsEnabled,
  }
}

// Helper function to inject analytics
export const injectVercelAnalytics = () => {
  const config = getVercelConfig()

  if (config.analyticsEnabled && typeof window !== "undefined") {
    // Inject analytics script
    const script = document.createElement("script")
    script.src = "https://va.vercel-scripts.com/v1/script.debug.js"
    script.defer = true
    document.head.appendChild(script)

    if (config.debug) {
      console.log("📊 Vercel Analytics script injected")
    }
  }

  if (config.speedInsightsEnabled && typeof window !== "undefined") {
    // Inject speed insights script
    const script = document.createElement("script")
    script.src =
      "https://va.vercel-scripts.com/v1/speed-insights/script.debug.js"
    script.defer = true
    document.head.appendChild(script)

    if (config.debug) {
      console.log("⚡ Vercel Speed Insights script injected")
    }
  }
}

export default useVercelAnalytics
