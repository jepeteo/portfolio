import posthog from "posthog-js"

interface PostHogConfig {
  apiKey: string
  host?: string
  options?: any
}

class PostHogAnalytics {
  private static instance: PostHogAnalytics
  private isInitialized = false

  static getInstance(): PostHogAnalytics {
    if (!PostHogAnalytics.instance) {
      PostHogAnalytics.instance = new PostHogAnalytics()
    }
    return PostHogAnalytics.instance
  }

  initialize(config: PostHogConfig) {
    if (this.isInitialized) {
      console.warn("PostHog already initialized")
      return
    }

    // Initialize PostHog
    posthog.init(config.apiKey, {
      api_host: config.host || "https://app.posthog.com",
      // Privacy-focused configuration
      capture_pageview: false, // We'll manually track pageviews
      capture_pageleave: true,
      disable_session_recording: false, // Enable session recordings for UX insights
      disable_surveys: false,
      disable_compression: false,

      // Performance optimizations
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          console.log("🔍 PostHog initialized successfully")
          posthog.debug() // Enable debug mode in development
        }
      },

      // Custom configuration for portfolio
      person_profiles: "identified_only", // Only create profiles for identified users
      bootstrap: {
        // Preload user properties if available
      },

      // GDPR compliance
      opt_out_capturing_by_default: false,
      respect_dnt: true, // Respect Do Not Track headers

      ...config.options,
    })

    this.isInitialized = true
  }

  // Page tracking
  trackPageView(path?: string, properties?: Record<string, any>) {
    if (!this.isInitialized) return

    posthog.capture("$pageview", {
      $current_url: path || window.location.href,
      ...properties,
    })
  }

  // Custom event tracking
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.isInitialized) return

    posthog.capture(eventName, {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ...properties,
    })
  }

  // Portfolio-specific tracking methods
  trackProjectView(
    projectName: string,
    projectType: string,
    featured: boolean = false
  ) {
    this.trackEvent("project_viewed", {
      project_name: projectName,
      project_type: projectType,
      is_featured: featured,
      section: "portfolio",
    })
  }

  trackSkillsInteraction(skillCategory: string, skillName?: string) {
    this.trackEvent("skills_interaction", {
      skill_category: skillCategory,
      skill_name: skillName,
      section: "skills",
    })
  }

  trackContactFormSubmission(formData: {
    hasName: boolean
    hasEmail: boolean
    hasPhone: boolean
    hasCompany: boolean
    messageLength: number
  }) {
    this.trackEvent("contact_form_submitted", {
      form_completion: {
        name_provided: formData.hasName,
        email_provided: formData.hasEmail,
        phone_provided: formData.hasPhone,
        company_provided: formData.hasCompany,
        message_length: formData.messageLength,
      },
      section: "contact",
    })
  }

  trackCVDownload() {
    this.trackEvent("cv_downloaded", {
      section: "bio",
      document_type: "pdf",
    })
  }

  trackThemeChange(theme: "light" | "dark") {
    this.trackEvent("theme_changed", {
      new_theme: theme,
      section: "ui",
    })
  }

  trackPerformanceMetric(metric: string, value: number, context?: string) {
    this.trackEvent("performance_metric", {
      metric_name: metric,
      metric_value: value,
      context: context || "general",
      section: "performance",
    })
  }

  trackError(error: {
    name: string
    message: string
    stack?: string
    component?: string
    severity?: "low" | "medium" | "high" | "critical"
  }) {
    this.trackEvent("error_occurred", {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500), // Limit stack trace length
      component: error.component,
      severity: error.severity || "medium",
      section: "errors",
    })
  }

  // User identification (for contact form leads)
  identifyUser(userId: string, properties?: Record<string, any>) {
    if (!this.isInitialized) return

    posthog.identify(userId, {
      timestamp: new Date().toISOString(),
      source: "portfolio_contact",
      ...properties,
    })
  }

  // A/B testing and feature flags
  isFeatureEnabled(featureKey: string, defaultValue: boolean = false): boolean {
    if (!this.isInitialized) return defaultValue

    return posthog.isFeatureEnabled(featureKey) ?? defaultValue
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isInitialized) return

    posthog.people.set(properties)
  }

  // Opt-out functionality for privacy compliance
  optOut() {
    if (!this.isInitialized) return
    posthog.opt_out_capturing()
  }

  optIn() {
    if (!this.isInitialized) return
    posthog.opt_in_capturing()
  }

  // Get session information
  getSessionInfo() {
    if (!this.isInitialized) return null

    return {
      sessionId: posthog.get_session_id(),
      distinctId: posthog.get_distinct_id(),
      isIdentified: posthog.get_property("$identified") || false,
    }
  }

  // Cleanup
  shutdown() {
    if (!this.isInitialized) return

    posthog.capture("session_ended")
    // PostHog doesn't have explicit shutdown, but we can mark as uninitialized
    this.isInitialized = false
  }
}

export const postHogAnalytics = PostHogAnalytics.getInstance()
export default PostHogAnalytics
