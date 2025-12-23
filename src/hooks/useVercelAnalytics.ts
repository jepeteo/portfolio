import { useEffect } from "react"

let analyticsLoaded = false
let speedInsightsLoaded = false

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

export const useVercelAnalytics = () => {
  useEffect(() => {
    const config = getVercelConfig()

    if (config.analyticsEnabled && !analyticsLoaded) {
      import("@vercel/analytics")
        .then(() => {
          if (typeof window !== "undefined") {
            analyticsLoaded = true
          }
        })
        .catch(() => {
          // Analytics failed to load
        })
    }

    if (config.speedInsightsEnabled && !speedInsightsLoaded) {
      import("@vercel/speed-insights")
        .then(() => {
          if (typeof window !== "undefined") {
            speedInsightsLoaded = true
          }
        })
        .catch(() => {
          // Speed insights failed to load
        })
    }
  }, [])

  return {
    analyticsEnabled: getVercelConfig().analyticsEnabled,
    speedInsightsEnabled: getVercelConfig().speedInsightsEnabled,
  }
}

export const injectVercelAnalytics = () => {
  const config = getVercelConfig()

  if (config.analyticsEnabled && typeof window !== "undefined") {

    const script = document.createElement("script")
    script.src = "https://va.vercel-scripts.com/v1/script.js"
    script.defer = true
    document.head.appendChild(script)
  }

  if (config.speedInsightsEnabled && typeof window !== "undefined") {

    const script = document.createElement("script")
    script.src = "https://va.vercel-scripts.com/v1/speed-insights/script.js"
    script.defer = true
    document.head.appendChild(script)
  }
}

export default useVercelAnalytics
