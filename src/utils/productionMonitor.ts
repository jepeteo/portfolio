/**
 * Production Error Monitoring & Analytics
 * Real-time error tracking and performance monitoring
 */

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

    if (this.isProduction) {
      this.initializeMonitoring()
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserId(): string | undefined {
    // Try to get user ID from localStorage or generate anonymous ID
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
    // Global error handler
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

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError({
        type: "javascript",
        message: event.reason?.message || "Unhandled Promise Rejection",
        stack: event.reason?.stack,
        url: window.location.href,
        reason: event.reason,
      })
    })

    // Network errors
    this.monitorNetworkErrors()

    // Performance monitoring
    this.monitorPerformance()

    // Periodic flush
    setInterval(() => {
      this.flushQueues()
    }, this.flushInterval)

    // Flush on page unload
    window.addEventListener("beforeunload", () => {
      this.flushQueues(true)
    })

    console.log("🔍 Production monitoring initialized")
  }

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

    // Immediate flush for critical errors
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushQueues()
    }

    // Log to console in development
    if (!this.isProduction) {
      console.error("Error captured:", errorReport)
    }
  }

  private monitorNetworkErrors(): void {
    // Override fetch to monitor network errors
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)

        // Log slow requests
        const duration = performance.now() - startTime
        if (duration > 5000) {
          // 5 seconds
          this.captureError({
            type: "performance",
            message: `Slow network request: ${args[0]}`,
            url: args[0]?.toString(),
            duration,
          })
        }

        // Log HTTP errors
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
    // Wait for page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.capturePerformanceMetrics()
      }, 1000)
    })

    // Monitor Core Web Vitals
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
    // LCP - Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry.startTime > 2500) {
            // Budget exceeded
            this.captureError({
              type: "performance",
              message: `LCP budget exceeded: ${lastEntry.startTime}ms`,
              metric: "LCP",
              value: lastEntry.startTime,
            })
          }
        }).observe({ entryTypes: ["largest-contentful-paint"] })

        // CLS - Cumulative Layout Shift
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
              if (clsValue > 0.1) {
                // Budget exceeded
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
        console.warn("PerformanceObserver not supported")
      }
    }
  }

  private getWebVitalsMetrics(): any {
    // This would integrate with web-vitals library
    return {}
  }

  private getConnectionInfo(): any {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection
    return connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        }
      : null
  }

  private getMemoryUsage(): any {
    const memory = (performance as any).memory
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

        // Clear queues after successful send
        this.errorQueue = []
        this.performanceQueue = []
      } catch (error) {
        console.warn("Failed to send analytics data:", error)
        // Keep data in queue for retry, but limit size
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

  private async sendToAnalytics(data: any): Promise<void> {
    // Send to your analytics endpoint
    // For now, we'll use a simple endpoint or service

    const endpoints = [
      "https://your-analytics-endpoint.com/api/track",
      // Fallback endpoints
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          return // Success
        }
      } catch (error) {
        continue // Try next endpoint
      }
    }

    throw new Error("All analytics endpoints failed")
  }

  // Public methods for manual tracking
  public trackEvent(event: string, properties?: Record<string, any>): void {
    if (!this.isProduction) return

    this.captureError({
      type: "event",
      message: event,
      url: window.location.href,
      properties,
    })
  }

  public trackPageView(path?: string): void {
    if (!this.isProduction) return

    this.trackEvent("page_view", {
      path: path || window.location.pathname,
      referrer: document.referrer,
      title: document.title,
    })
  }

  public setUserId(userId: string): void {
    this.userId = userId
    try {
      localStorage.setItem("portfolio_user_id", userId)
    } catch {
      // Ignore localStorage errors
    }
  }
}

// Global instance
const productionMonitor = new ProductionMonitor()

// Export for manual tracking
export default productionMonitor

// Auto-track page views for SPA navigation
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
