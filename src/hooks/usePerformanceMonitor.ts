import { useEffect, useRef } from "react"

interface PerformanceMetrics {
  componentName: string
  renderTime: number
  timestamp: number
}

const usePerformanceMonitor = (
  componentName: string,
  dependencies: any[] = []
) => {
  const startTimeRef = useRef<number>(0)
  const metricsRef = useRef<PerformanceMetrics[]>([])

  useEffect(() => {
    startTimeRef.current = performance.now()

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTimeRef.current

      const metrics: PerformanceMetrics = {
        componentName,
        renderTime,
        timestamp: Date.now(),
      }

      metricsRef.current.push(metrics)

      // Only log in development and for slow renders (>16ms for 60fps)
      if (import.meta.env.DEV && renderTime > 16) {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        )
      }

      // Keep only last 10 metrics to avoid memory leak
      if (metricsRef.current.length > 10) {
        metricsRef.current = metricsRef.current.slice(-10)
      }
    }
  }, dependencies)

  const getMetrics = () => metricsRef.current
  const getAverageRenderTime = () => {
    if (metricsRef.current.length === 0) return 0
    const total = metricsRef.current.reduce(
      (sum, metric) => sum + metric.renderTime,
      0
    )
    return total / metricsRef.current.length
  }

  return { getMetrics, getAverageRenderTime }
}

export default usePerformanceMonitor
