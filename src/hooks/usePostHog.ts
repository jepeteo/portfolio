import { useEffect, useRef } from "react"
import { postHogAnalytics } from "../utils/postHogAnalytics"

interface UsePostHogOptions {
  enableInDevelopment?: boolean
  autoPageTracking?: boolean
}

export const usePostHog = (options: UsePostHogOptions = {}) => {
  const { enableInDevelopment = true, autoPageTracking = true } = options
  const initializationAttempted = useRef(false)

  useEffect(() => {
    if (initializationAttempted.current) {
      return
    }
    initializationAttempted.current = true

    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY
    const host = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com"
    const enabled = import.meta.env.VITE_ENABLE_POSTHOG === "true"
    const isDevelopment = import.meta.env.DEV

    const shouldInitialize =
      apiKey && enabled && (enableInDevelopment || !isDevelopment)

    if (!shouldInitialize) {
      if (!apiKey && enabled) {
        console.warn("🔍 PostHog API key not found. Analytics disabled.")
        console.info(
          "💡 Add VITE_POSTHOG_API_KEY to your .env file to enable analytics"
        )
      }
      return
    }

    try {
      postHogAnalytics.initialize({
        apiKey,
        host,
        options: {
          capture_pageview: autoPageTracking,
          disable_session_recording: isDevelopment ? true : false,
          disable_surveys: isDevelopment,

          respect_dnt: true,
          opt_out_capturing_by_default: false,

          disable_compression: isDevelopment,

          loaded: (posthog: any) => {
            posthog.register({
              portfolio_version: "2.0",
              site_type: "portfolio",
              developer: "theodoros_mentis",
              framework: "react_vite",
              deployment: "vercel",
            })

            if (isDevelopment) {
            }
          },
        },
      })

      if (autoPageTracking) {
        postHogAnalytics.trackPageView(window.location.pathname, {
          initial_load: true,
          referrer: document.referrer || "direct",
          timestamp: new Date().toISOString(),
        })
      }

      const handleContactInteraction = () => {
        const contactForm = document.querySelector('form[id*="contact"]')
        if (contactForm) {
          const emailInput = contactForm.querySelector(
            'input[type="email"]'
          ) as HTMLInputElement
          if (emailInput && emailInput.value) {
            postHogAnalytics.identify(emailInput.value, {
              interaction_type: "contact_form",
              page: window.location.pathname,
            })
          }
        }
      }

      document.addEventListener("input", (e) => {
        if ((e.target as HTMLElement).closest('form[id*="contact"]')) {
          handleContactInteraction()
        }
      })
    } catch (error) {
      console.error("Failed to initialize PostHog:", error)
    }

    return () => {
      postHogAnalytics.trackEvent("session_ended", {
        session_duration: Date.now() - performance.timeOrigin,
        page: window.location.pathname,
      })
    }
  }, []) // Empty dependency array to run only once

  return {
    trackEvent: postHogAnalytics.trackEvent.bind(postHogAnalytics),
    trackPageView: postHogAnalytics.trackPageView.bind(postHogAnalytics),
    identify: postHogAnalytics.identify.bind(postHogAnalytics),
    isFeatureEnabled: postHogAnalytics.isFeatureEnabled.bind(postHogAnalytics),
    getSessionInfo: postHogAnalytics.getSessionInfo.bind(postHogAnalytics),
  }
}

export default usePostHog
