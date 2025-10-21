import React, { useState, useEffect } from "react"
import { getBundleInfo } from "../utils/performanceOptimization"
import { A11yChecker } from "../utils/accessibilityOptimization"

interface PerformanceMetrics {
  navigation?: {
    domContentLoaded: number
    loadComplete: number
    totalTime: number
  }
  resources?: Array<{
    name: string
    duration: number
    size: number
    type: string
  }>
  memoryUsage?: {
    used: number
    total: number
    limit: number
  } | null
  accessibilityIssues?: {
    images: string[]
    headings: string[]
    keyboard: string[]
  }
}

interface WebVitals {
  LCP?: number
  FID?: number
  CLS?: number
  FCP?: number
  TTFB?: number
}

const PerformanceDashboard: React.FC = () => {
  const isDevelopment =
    process.env.NODE_ENV === "development" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("localhost"))

  if (!isDevelopment) {
    return null
  }

  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [webVitals, setWebVitals] = useState<WebVitals>({})
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const isDevelopment =
      process.env.NODE_ENV === "development" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("localhost"))

    if (!isDevelopment) return

    const collectMetrics = () => {
      const bundleInfo = getBundleInfo()
      const accessibilityIssues = A11yChecker.runAllChecks()

      const metricsData: PerformanceMetrics = {
        ...bundleInfo,
        accessibilityIssues,
      }

      setMetrics(metricsData)
    }

    const observers: PerformanceObserver[] = []

    const collectWebVitals = () => {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            setWebVitals((prev) => ({ ...prev, LCP: lastEntry.startTime }))
          }
        })
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
        observers.push(lcpObserver)

        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find(
            (entry) => entry.name === "first-contentful-paint"
          )
          if (fcpEntry) {
            setWebVitals((prev) => ({ ...prev, FCP: fcpEntry.startTime }))
          }
        })
        fcpObserver.observe({ entryTypes: ["paint"] })
        observers.push(fcpObserver)

        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
              setWebVitals((prev) => ({ ...prev, CLS: clsValue }))
            }
          }
        })
        clsObserver.observe({ entryTypes: ["layout-shift"] })
        observers.push(clsObserver)

        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            setWebVitals((prev) => ({
              ...prev,
              FID: (entry as any).processingStart - entry.startTime,
            }))
          }
        })
        fidObserver.observe({ entryTypes: ["first-input"] })
        observers.push(fidObserver)
      } catch (error) {
        console.warn("Failed to observe FID metric:", error)
      }
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    const metricsTimeout = setTimeout(collectMetrics, 2000)
    collectWebVitals()

    return () => {
      observers.forEach((observer) => {
        try {
          observer.disconnect()
        } catch (error) {
          // Observer already disconnected - safe to ignore
        }
      })

      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)

      clearTimeout(metricsTimeout)
    }
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (time: number) => {
    return `${time.toFixed(2)}ms`
  }

  const getPerformanceGrade = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
    }

    const threshold = thresholds[metric]
    if (!threshold) return "unknown"

    if (value <= threshold.good) return "good"
    if (value <= threshold.poor) return "needs-improvement"
    return "poor"
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-blue-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg hover:bg-blue-700 transition-colors"
        style={{ fontSize: "12px" }}
      >
        📊 Perf
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-w-sm max-h-96 overflow-y-auto">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-sm">Performance Dashboard</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3 text-xs">
        <div>
          <h4 className="font-medium mb-2">Core Web Vitals</h4>
          <div className="space-y-1">
            {Object.entries(webVitals).map(([metric, value]) => {
              if (value === undefined) return null
              const grade = getPerformanceGrade(metric, value)
              return (
                <div key={metric} className="flex justify-between">
                  <span>{metric}:</span>
                  <span
                    className={`font-mono ${
                      grade === "good"
                        ? "text-green-600"
                        : grade === "needs-improvement"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric === "CLS" ? value.toFixed(3) : formatTime(value)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {metrics?.navigation && (
          <div>
            <h4 className="font-medium mb-2">Navigation Timing</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>DOM Content Loaded:</span>
                <span className="font-mono">
                  {formatTime(metrics.navigation.domContentLoaded)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Load Complete:</span>
                <span className="font-mono">
                  {formatTime(metrics.navigation.loadComplete)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Time:</span>
                <span className="font-mono">
                  {formatTime(metrics.navigation.totalTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        {metrics?.memoryUsage && (
          <div>
            <h4 className="font-medium mb-2">Memory Usage</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Used:</span>
                <span className="font-mono">
                  {formatBytes(metrics.memoryUsage.used)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-mono">
                  {formatBytes(metrics.memoryUsage.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Usage:</span>
                <span className="font-mono">
                  {(
                    (metrics.memoryUsage.used / metrics.memoryUsage.total) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        )}

        {metrics?.resources && (
          <div>
            <h4 className="font-medium mb-2">Largest Resources</h4>
            <div className="space-y-1">
              {metrics.resources
                .filter((r) => r.size > 0)
                .sort((a, b) => b.size - a.size)
                .slice(0, 5)
                .map((resource, index) => (
                  <div key={index} className="flex justify-between">
                    <span
                      className="truncate max-w-[120px]"
                      title={resource.name}
                    >
                      {resource.name.split("/").pop()}
                    </span>
                    <span className="font-mono">
                      {formatBytes(resource.size)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {metrics?.accessibilityIssues && (
          <div>
            <h4 className="font-medium mb-2">Accessibility</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Image Issues:</span>
                <span
                  className={`font-mono ${
                    metrics.accessibilityIssues.images.length === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metrics.accessibilityIssues.images.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Heading Issues:</span>
                <span
                  className={`font-mono ${
                    metrics.accessibilityIssues.headings.length === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metrics.accessibilityIssues.headings.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Keyboard Issues:</span>
                <span
                  className={`font-mono ${
                    metrics.accessibilityIssues.keyboard.length === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metrics.accessibilityIssues.keyboard.length}
                </span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2">Tips</h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {webVitals.LCP && webVitals.LCP > 2500 && (
              <div>• Optimize LCP with image preloading</div>
            )}
            {webVitals.CLS && webVitals.CLS > 0.1 && (
              <div>• Reduce CLS with size attributes</div>
            )}
            {webVitals.FID && webVitals.FID > 100 && (
              <div>• Improve FID with code splitting</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceDashboard
