import { postHogAnalytics } from "./postHogAnalytics"

interface ErrorReport {
  id: string
  timestamp: number
  type: "javascript" | "network" | "resource" | "performance"
  message: string
  stack?: string
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>
}

interface PerformanceReport {
  id: string
  timestamp: number
  metrics: {
    fcp?: number
    lcp?: number
    fid?: number
    cls?: number
    ttfb?: number
  }
  navigation: {
    type: string
    redirectCount: number
    domContentLoaded: number
    loadComplete: number
  }
  resources: Array<{
    name: string
    type: string
    duration: number
    size: number
  }>
  memory?: {
    used: number
    total: number
    limit: number
  }
}

class ProductionMonitor {
  private sessionId: string
  private userId?: string
  private errorQueue: ErrorReport[] = []
  private performanceQueue: PerformanceReport[] = []
  private isProduction: boolean
  private maxQueueSize = 10
  private flushInterval = 30000 // 30 seconds

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isProduction = process.env.NODE_ENV === "production"
    this.userId = this.getUserId()

    const monitoringEnabled = import.meta.env.VITE_ENABLE_MONITORING === "true"

    if (this.isProduction && monitoringEnabled) {
      this.initializeMonitoring()
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserId(): string | undefined {
    try {
      let userId = localStorage.getItem("portfolio_user_id")
      if (!userId) {
        userId = `anon_${Math.random().toString(36).substr(2, 12)}`
        localStorage.setItem("portfolio_user_id", userId)
      }
      return userId
    } catch {
      return undefined
    }
  }

  private initializeMonitoring(): void {
    window.addEventListener("error", (event) => {
      this.captureError({
        type: "javascript",
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    window.addEventListener("unhandledrejection", (event) => {
      this.captureError({
        type: "javascript",
        message: event.reason?.message || "Unhandled Promise Rejection",
        stack: event.reason?.stack,
        url: window.location.href,
        reason: event.reason,
      })
    })

    this.monitorNetworkErrors()

    this.monitorPerformance()

    setInterval(() => {
      this.flushQueues()
    }, this.flushInterval)

    window.addEventListener("beforeunload", () => {
      this.flushQueues(true)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private captureError(errorData: any): void {
    const errorReport: ErrorReport = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: errorData.type || "javascript",
      message: errorData.message,
      stack: errorData.stack,
      url: errorData.url || window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId,
      sessionId: this.sessionId,
      metadata: {
        ...errorData,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        connection: this.getConnectionInfo(),
        memoryUsage: this.getMemoryUsage(),
      },
    }

    this.errorQueue.push(errorReport)

    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushQueues()
    }
    // Development-only error logging can be added here
  }

  private monitorNetworkErrors(): void {
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)

        const duration = performance.now() - startTime
        if (duration > 5000) {
          this.captureError({
            type: "performance",
            message: `Slow network request: ${args[0]}`,
            url: args[0]?.toString(),
            duration,
          })
        }

        if (!response.ok) {
          this.captureError({
            type: "network",
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0]?.toString(),
            status: response.status,
            statusText: response.statusText,
          })
        }

        return response
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown network error"
        this.captureError({
          type: "network",
          message: `Network error: ${errorMessage}`,
          url: args[0]?.toString(),
          error: errorMessage,
        })
        throw error
      }
    }
  }

  private monitorPerformance(): void {
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.capturePerformanceMetrics()
      }, 1000)
    })

    this.monitorWebVitals()
  }

  private capturePerformanceMetrics(): void {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[]

    const performanceReport: PerformanceReport = {
      id: this.generateId(),
      timestamp: Date.now(),
      metrics: this.getWebVitalsMetrics(),
      navigation: {
        type: navigation?.type || "unknown",
        redirectCount: navigation?.redirectCount || 0,
        domContentLoaded:
          navigation?.domContentLoadedEventEnd -
            navigation?.domContentLoadedEventStart || 0,
        loadComplete:
          navigation?.loadEventEnd - navigation?.loadEventStart || 0,
      },
      resources: resources.map((resource) => ({
        name: resource.name,
        type: resource.initiatorType,
        duration: resource.duration,
        size: resource.transferSize || 0,
      })),
      memory: this.getMemoryUsage(),
    }

    this.performanceQueue.push(performanceReport)
  }

  private monitorWebVitals(): void {
    if ("PerformanceObserver" in window) {
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry.startTime > 2500) {
            this.captureError({
              type: "performance",
              message: `LCP budget exceeded: ${lastEntry.startTime}ms`,
              metric: "LCP",
              value: lastEntry.startTime,
            })
          }
        }).observe({ entryTypes: ["largest-contentful-paint"] })

        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as PerformanceEntry & {
              hadRecentInput: boolean
              value: number
            }
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value
              if (clsValue > 0.1) {
                this.captureError({
                  type: "performance",
                  message: `CLS budget exceeded: ${clsValue}`,
                  metric: "CLS",
                  value: clsValue,
                })
              }
            }
          }
        }).observe({ entryTypes: ["layout-shift"] })
      } catch (error) {
        console.warn("Failed to observe layout shifts:", error)
      }
    }
  }

  private getWebVitalsMetrics(): Record<string, unknown> {
    return {}
  }

  private getConnectionInfo(): {
    effectiveType?: string
    downlink?: number
    rtt?: number
  } | null {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection
    return connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        }
      : null
  }

  private getMemoryUsage(): {
    used: number
    total: number
    limit: number
  } | null {
    const memory = performance.memory
    return memory
      ? {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        }
      : null
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async flushQueues(force = false): Promise<void> {
    if (!this.isProduction && !force) return

    if (this.errorQueue.length > 0 || this.performanceQueue.length > 0) {
      try {
        await this.sendToAnalytics({
          errors: [...this.errorQueue],
          performance: [...this.performanceQueue],
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
        })

        this.errorQueue = []
        this.performanceQueue = []
      } catch {
        if (this.errorQueue.length > this.maxQueueSize * 2) {
          this.errorQueue = this.errorQueue.slice(-this.maxQueueSize)
        }
        if (this.performanceQueue.length > this.maxQueueSize * 2) {
          this.performanceQueue = this.performanceQueue.slice(
            -this.maxQueueSize
          )
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendToAnalytics(data: any): Promise<void> {
    try {
      if (data.errors && data.errors.length > 0) {
        data.errors.forEach((error: ErrorReport) => {
          postHogAnalytics.trackError({
            message: `${error.type}: ${error.message}`,
            stack: error.stack,
            url: error.url,
            component: "production_monitor",
            severity: this.getErrorSeverity(error),
            props: {
              errorType: error.type,
              ...error.metadata,
            },
          })
        })
      }

      if (data.performance && data.performance.length > 0) {
        data.performance.forEach((perf: PerformanceReport) => {
          if (perf.metrics.lcp) {
            postHogAnalytics.trackPerformanceMetric(
              "LCP",
              perf.metrics.lcp,
              "core_web_vitals"
            )
          }
          if (perf.metrics.fcp) {
            postHogAnalytics.trackPerformanceMetric(
              "FCP",
              perf.metrics.fcp,
              "core_web_vitals"
            )
          }
          if (perf.metrics.cls) {
            postHogAnalytics.trackPerformanceMetric(
              "CLS",
              perf.metrics.cls,
              "core_web_vitals"
            )
          }
          if (perf.metrics.fid) {
            postHogAnalytics.trackPerformanceMetric(
              "FID",
              perf.metrics.fid,
              "core_web_vitals"
            )
          }
          if (perf.metrics.ttfb) {
            postHogAnalytics.trackPerformanceMetric(
              "TTFB",
              perf.metrics.ttfb,
              "core_web_vitals"
            )
          }

          postHogAnalytics.trackEvent("navigation_performance", {
            navigation_type: perf.navigation.type,
            redirect_count: perf.navigation.redirectCount,
            dom_content_loaded: perf.navigation.domContentLoaded,
            load_complete: perf.navigation.loadComplete,
            session_id: data.sessionId,
          })

          const largeResources = perf.resources.filter(
            (r) => r.duration > 1000 || r.size > 100000
          )
          if (largeResources.length > 0) {
            postHogAnalytics.trackEvent("large_resources_detected", {
              resources: largeResources,
              session_id: data.sessionId,
            })
          }

          if (perf.memory) {
            const memoryUsagePercent =
              (perf.memory.used / perf.memory.total) * 100
            if (memoryUsagePercent > 75) {
              postHogAnalytics.trackEvent("high_memory_usage", {
                memory_used: perf.memory.used,
                memory_total: perf.memory.total,
                usage_percent: memoryUsagePercent,
                session_id: data.sessionId,
              })
            }
          }
        })
      }

      postHogAnalytics.trackEvent("monitoring_data_batch", {
        session_id: data.sessionId,
        error_count: data.errors?.length || 0,
        performance_reports: data.performance?.length || 0,
        batch_timestamp: data.timestamp,
      })
    } catch (error) {
      console.error("Failed to send analytics to PostHog:", error)
      throw new Error("PostHog analytics failed")
    }
  }

  private getErrorSeverity(
    error: ErrorReport
  ): "low" | "medium" | "high" | "critical" {
    if (error.type === "javascript" && error.message.includes("Script error")) {
      return "low" // Often cross-origin script errors
    }

    if (error.type === "network" && error.metadata?.status >= 500) {
      return "high" // Server errors
    }

    if (error.type === "performance") {
      const metric = error.metadata?.metric
      const value = error.metadata?.value

      if (metric === "LCP" && value > 4000) return "high"
      if (metric === "CLS" && value > 0.25) return "high"
      if (metric === "FID" && value > 300) return "medium"

      return "medium"
    }

    if (
      error.message.includes("ChunkLoadError") ||
      error.message.includes("Loading CSS chunk")
    ) {
      return "medium" // Build/deployment issues
    }

    return "medium" // Default severity
  }

  public trackEvent(event: string, properties?: Record<string, unknown>): void {
    postHogAnalytics.trackEvent(event, {
      source: "production_monitor",
      session_id: this.sessionId,
      user_id: this.userId,
      ...properties,
    })
  }

  public trackPageView(path?: string): void {
    postHogAnalytics.trackPageView(path, {
      source: "production_monitor",
      referrer: document.referrer,
      title: document.title,
      session_id: this.sessionId,
      user_id: this.userId,
    })
  }

  public setUserId(userId: string): void {
    this.userId = userId
    try {
      localStorage.setItem("portfolio_user_id", userId)
    } catch {
      // localStorage not available - ignore silently
    }
  }
}

const productionMonitor = new ProductionMonitor()

export default productionMonitor

let currentPath = window.location.pathname
const observer = new MutationObserver(() => {
  if (window.location.pathname !== currentPath) {
    currentPath = window.location.pathname
    productionMonitor.trackPageView(currentPath)
  }
})

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true })
} else {
  document.addEventListener("DOMContentLoaded", () => {
    observer.observe(document.body, { childList: true, subtree: true })
  })
}
