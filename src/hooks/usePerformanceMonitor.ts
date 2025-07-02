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

      // Only log in development and for slow renders (>16ms for 60fps)
      if (process.env.NODE_ENV === "development" && renderTime > 16) {
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

  // Web Vitals monitoring
  const measureWebVitals = useCallback(() => {
    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            webVitalsRef.current.LCP = lastEntry.startTime
          }
        }).observe({ entryTypes: ["largest-contentful-paint"] })

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (entry.processingStart) {
              webVitalsRef.current.FID = entry.processingStart - entry.startTime
            }
          })
        }).observe({ entryTypes: ["first-input"] })

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          webVitalsRef.current.CLS = clsValue
        }).observe({ entryTypes: ["layout-shift"] })
      } catch (error) {
        // PerformanceObserver not supported
        console.warn("PerformanceObserver not supported")
      }
    }

    // Navigation timing metrics
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
  }, [])

  useEffect(() => {
    measureWebVitals()
  }, [measureWebVitals])

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
