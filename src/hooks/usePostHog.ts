import { useEffect } from "react"
import { postHogAnalytics } from "../utils/postHogAnalytics"

interface UsePostHogOptions {
  enableInDevelopment?: boolean
  autoPageTracking?: boolean
}

export const usePostHog = (options: UsePostHogOptions = {}) => {
  const { enableInDevelopment = true, autoPageTracking = true } = options

  useEffect(() => {
    // Get environment variables
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY
    const host = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com"
    const enabled = import.meta.env.VITE_ENABLE_POSTHOG === "true"
    const isDevelopment = import.meta.env.DEV

    // Check if PostHog should be initialized
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

    // Initialize PostHog
    try {
      postHogAnalytics.initialize({
        apiKey,
        host,
        options: {
          // Development-friendly settings
          capture_pageview: autoPageTracking,
          disable_session_recording: isDevelopment ? true : false,
          disable_surveys: isDevelopment,

          // Privacy settings
          respect_dnt: true,
          opt_out_capturing_by_default: false,

          // Performance settings
          disable_compression: isDevelopment,

          // Custom properties for portfolio context
          loaded: (posthog: any) => {
            // Set initial context
            posthog.register({
              portfolio_version: "2.0",
              site_type: "portfolio",
              developer: "theodoros_mentis",
              framework: "react_vite",
              deployment: "vercel",
            })

            if (isDevelopment) {
              console.log("🚀 PostHog initialized successfully")
              console.log("📊 Analytics ready for tracking")
            }
          },
        },
      })

      // Track initial page view if auto tracking is enabled
      if (autoPageTracking) {
        postHogAnalytics.trackPageView(window.location.pathname, {
          initial_load: true,
          referrer: document.referrer || "direct",
          timestamp: new Date().toISOString(),
        })
      }

      // Set up user identification based on contact form interactions
      const handleContactInteraction = () => {
        const contactForm = document.querySelector('form[id*="contact"]')
        if (contactForm) {
          const emailInput = contactForm.querySelector(
            'input[type="email"]'
          ) as HTMLInputElement
          if (emailInput && emailInput.value) {
            // Identify user when they start filling contact form
            postHogAnalytics.identifyUser(emailInput.value, {
              interaction_type: "contact_form",
              page: window.location.pathname,
            })
          }
        }
      }

      // Listen for contact form interactions
      document.addEventListener("input", (e) => {
        if ((e.target as HTMLElement).closest('form[id*="contact"]')) {
          handleContactInteraction()
        }
      })
    } catch (error) {
      console.error("Failed to initialize PostHog:", error)
    }

    // Cleanup function
    return () => {
      // PostHog doesn't need explicit cleanup, but we can track session end
      postHogAnalytics.trackEvent("session_ended", {
        session_duration: Date.now() - performance.timeOrigin,
        page: window.location.pathname,
      })
    }
  }, [enableInDevelopment, autoPageTracking])

  // Return PostHog utilities for components to use
  return {
    trackEvent: postHogAnalytics.trackEvent.bind(postHogAnalytics),
    trackPageView: postHogAnalytics.trackPageView.bind(postHogAnalytics),
    trackProjectView: postHogAnalytics.trackProjectView.bind(postHogAnalytics),
    trackSkillsInteraction:
      postHogAnalytics.trackSkillsInteraction.bind(postHogAnalytics),
    trackContactFormSubmission:
      postHogAnalytics.trackContactFormSubmission.bind(postHogAnalytics),
    trackCVDownload: postHogAnalytics.trackCVDownload.bind(postHogAnalytics),
    trackThemeChange: postHogAnalytics.trackThemeChange.bind(postHogAnalytics),
    identifyUser: postHogAnalytics.identifyUser.bind(postHogAnalytics),
    isFeatureEnabled: postHogAnalytics.isFeatureEnabled.bind(postHogAnalytics),
    getSessionInfo: postHogAnalytics.getSessionInfo.bind(postHogAnalytics),
  }
}

export default usePostHog
