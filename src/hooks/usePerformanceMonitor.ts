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

  useEffect(() => {
    startTimeRef.current = performance.now()
    renderCountRef.current += 1

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTimeRef.current

      const memoryUsage = performance.memory?.usedJSHeapSize

      const metrics: PerformanceMetrics = {
        componentName,
        renderTime,
        timestamp: Date.now(),
        memoryUsage,
        reRenderCount: renderCountRef.current,
      }

      metricsRef.current.push(metrics)

      // Log slow renders in development (commented out to reduce noise)
      // if (process.env.NODE_ENV === "development" && renderTime > 50) {
      //   console.warn(`Slow render: ${renderTime}ms`)
      // }

      if (metricsRef.current.length > 10) {
        metricsRef.current = metricsRef.current.slice(-10)
      }
    }
  })

  useEffect(() => {
    if (!("PerformanceObserver" in window)) {
      return
    }

    const observers: PerformanceObserver[] = []

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          webVitalsRef.current.LCP = lastEntry.startTime
        }
      })
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
      observers.push(lcpObserver)

      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const firstInputEntry = entry as PerformanceEventTiming
          if (firstInputEntry.processingStart) {
            webVitalsRef.current.FID =
              firstInputEntry.processingStart - firstInputEntry.startTime
          }
        })
      })
      fidObserver.observe({ entryTypes: ["first-input"] })
      observers.push(fidObserver)

      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach((entry) => {
          // Layout shift entries have value and hadRecentInput properties
          const layoutShiftEntry = entry as PerformanceEntry & {
            value: number
            hadRecentInput: boolean
          }
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value
          }
        })
        webVitalsRef.current.CLS = clsValue
      })
      clsObserver.observe({ entryTypes: ["layout-shift"] })
      observers.push(clsObserver)
    } catch (error) {
      console.warn("Failed to observe CLS metrics:", error)
    }

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
      observers.forEach((observer) => {
        try {
          observer.disconnect()
        } catch {
          // Silently ignore disconnect errors - observers may already be disconnected
        }
      })
    }
  }, []) // Empty dependency array - only run once

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
