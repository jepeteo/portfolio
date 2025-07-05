import { useEffect, useRef, useCallback } from "react"

interface PerformanceMetrics {
  componentName: string
  renderTime: number
  timestamp: number
  memoryUsage?: number
  reRenderCount: number
}

interface WebVitalsMetrics {
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  FCP?: number // First Contentful Paint
  TTFB?: number // Time to First Byte
}

const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number>(0)
  const renderCountRef = useRef<number>(0)
  const metricsRef = useRef<PerformanceMetrics[]>([])
  const webVitalsRef = useRef<WebVitalsMetrics>({})

  // Start timing when component mounts or updates
  useEffect(() => {
    startTimeRef.current = performance.now()
    renderCountRef.current += 1

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTimeRef.current

      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize

      const metrics: PerformanceMetrics = {
        componentName,
        renderTime,
        timestamp: Date.now(),
        memoryUsage,
        reRenderCount: renderCountRef.current,
      }

      metricsRef.current.push(metrics)

      // Only log in development and for slow renders (>50ms threshold for complex components)
      if (process.env.NODE_ENV === "development" && renderTime > 50) {
        console.warn(
          `🐌 Slow render in ${componentName}: ${renderTime.toFixed(
            2
          )}ms (Render #${renderCountRef.current})`
        )
      }

      // Keep only last 10 metrics to avoid memory leak
      if (metricsRef.current.length > 10) {
        metricsRef.current = metricsRef.current.slice(-10)
      }
    }
  })

  // Web Vitals monitoring - only initialize once
  useEffect(() => {
    if (!("PerformanceObserver" in window)) {
      console.warn("PerformanceObserver not supported")
      return
    }

    const observers: PerformanceObserver[] = []

    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          webVitalsRef.current.LCP = lastEntry.startTime
        }
      })
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
      observers.push(lcpObserver)

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.processingStart) {
            webVitalsRef.current.FID = entry.processingStart - entry.startTime
          }
        })
      })
      fidObserver.observe({ entryTypes: ["first-input"] })
      observers.push(fidObserver)

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        webVitalsRef.current.CLS = clsValue
      })
      clsObserver.observe({ entryTypes: ["layout-shift"] })
      observers.push(clsObserver)
    } catch (error) {
      console.warn("PerformanceObserver setup error:", error)
    }

    // Navigation timing metrics - only once
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[]
      if (navEntries.length > 0) {
        const nav = navEntries[0]
        webVitalsRef.current.FCP = nav.responseStart - nav.requestStart
        webVitalsRef.current.TTFB = nav.responseStart - nav.requestStart
      }
    }

    return () => {
      // Clean up all observers
      observers.forEach((observer) => {
        try {
          observer.disconnect()
        } catch (error) {
          console.warn("Error disconnecting performance observer:", error)
        }
      })
    }
  }, []) // Empty dependency array - only run once

  // Performance report
  const getPerformanceReport = useCallback(() => {
    const avgRenderTime =
      metricsRef.current.length > 0
        ? metricsRef.current.reduce((sum, m) => sum + m.renderTime, 0) /
          metricsRef.current.length
        : 0

    const slowRenders = metricsRef.current.filter(
      (m) => m.renderTime > 16
    ).length

    return {
      componentName,
      avgRenderTime: Number(avgRenderTime.toFixed(2)),
      totalRenders: renderCountRef.current,
      slowRenders,
      slowRenderPercentage:
        renderCountRef.current > 0
          ? Number(((slowRenders / renderCountRef.current) * 100).toFixed(2))
          : 0,
      webVitals: webVitalsRef.current,
      recentMetrics: metricsRef.current.slice(-5), // Last 5 renders
    }
  }, [componentName])

  return {
    getMetrics: () => metricsRef.current,
    getPerformanceReport,
    getWebVitals: () => webVitalsRef.current,
    getRenderCount: () => renderCountRef.current,
  }
}

export default usePerformanceMonitor
