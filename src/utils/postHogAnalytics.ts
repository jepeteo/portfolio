

let posthogInstance: any = null

interface PostHogConfig {
  apiKey: string
  host?: string
  options?: any
}

class PostHogAnalytics {
  private static instance: PostHogAnalytics

  static getInstance(): PostHogAnalytics {
    if (!PostHogAnalytics.instance) {
      PostHogAnalytics.instance = new PostHogAnalytics()
    }
    return PostHogAnalytics.instance
  }
  setPostHogInstance(instance: any) {
    posthogInstance = instance
  }

  initialize(_config: PostHogConfig) {
    console.warn(
      "PostHogAnalytics.initialize() is deprecated. Use PostHogProvider instead."
    )
    return
  }

  trackPageView(path?: string, additionalProperties?: Record<string, any>) {
    if (!posthogInstance) {
      return
    }

    posthogInstance.capture("$pageview", {
      $current_url: path || window.location.href,
      timestamp: Date.now(),
      ...additionalProperties,
    })
  }

  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!posthogInstance) {
      return
    }

    posthogInstance.capture(eventName, {
      timestamp: Date.now(),
      url: window.location.href,
      ...properties,
    })
  }

  trackError(errorData: {
    message: string
    stack?: string
    url?: string
    lineNumber?: number
    columnNumber?: number
    userAgent?: string
    timestamp?: number
    component?: string
    props?: Record<string, any>
    severity?: "low" | "medium" | "high" | "critical"
  }) {
    if (!posthogInstance) {
      return
    }

    this.trackEvent("error_occurred", {
      error_message: errorData.message,
      error_stack: errorData.stack,
      error_url: errorData.url || window.location.href,
      error_line: errorData.lineNumber,
      error_column: errorData.columnNumber,
      user_agent: errorData.userAgent || navigator.userAgent,
      component: errorData.component,
      props: errorData.props,
      severity: errorData.severity || "medium",
      timestamp: errorData.timestamp || Date.now(),
    })
  }

  trackPerformanceMetric(metricName: string, value: number, unit?: string) {
    if (!posthogInstance) {
      return
    }

    this.trackEvent("performance_metric", {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit || "ms",
      url: window.location.href,
    })
  }

  trackUserFlow(flowStep: string, additionalData?: Record<string, any>) {
    if (!posthogInstance) {
      return
    }

    this.trackEvent("user_flow_step", {
      flow_step: flowStep,
      timestamp: Date.now(),
      url: window.location.href,
      ...additionalData,
    })
  }

  identify(userId: string, properties?: Record<string, any>) {
    if (!posthogInstance) {
      return
    }

    posthogInstance.identify(userId, {
      ...properties,
    })
  }

  isFeatureEnabled(featureKey: string, defaultValue = false): boolean {
    if (!posthogInstance) {
      return defaultValue
    }
    return posthogInstance.isFeatureEnabled(featureKey) ?? defaultValue
  }

  updateUserProperties(properties: Record<string, any>) {
    if (!posthogInstance) {
      return
    }
    posthogInstance.people?.set(properties)
  }

  optOut() {
    if (!posthogInstance) {
      return
    }
    posthogInstance.opt_out_capturing()
  }

  optIn() {
    if (!posthogInstance) {
      return
    }
    posthogInstance.opt_in_capturing()
  }

  getSessionInfo() {
    if (!posthogInstance) {
      return null
    }
    return {
      sessionId: posthogInstance.get_session_id(),
      distinctId: posthogInstance.get_distinct_id(),
      isIdentified: posthogInstance.get_property("$identified") || false,
    }
  }

  endSession() {
    if (!posthogInstance) {
      return
    }
    posthogInstance.capture("session_ended")
  }
}

export const postHogAnalytics = PostHogAnalytics.getInstance()
