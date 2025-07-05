/**
 * Component Performance Optimization Utilities
 * Tools to help optimize component rendering and prevent performance issues
 */

import { useRef, useCallback, useMemo, useState } from "react"

// Cache for expensive computations
const computationCache = new Map<string, any>()

/**
 * Hook to debounce expensive operations to prevent excessive calls
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  ) as T
}

/**
 * Hook to memoize expensive computations with a cache key
 */
export function useMemoizedComputation<T>(
  computation: () => T,
  deps: React.DependencyList,
  cacheKey: string
): T {
  return useMemo(() => {
    const depsKey = `${cacheKey}-${JSON.stringify(deps)}`

    if (computationCache.has(depsKey)) {
      return computationCache.get(depsKey)
    }

    const result = computation()
    computationCache.set(depsKey, result)

    // Clean cache if it gets too large
    if (computationCache.size > 100) {
      const keys = Array.from(computationCache.keys())
      if (keys.length > 0) {
        computationCache.delete(keys[0])
      }
    }

    return result
  }, deps)
}

/**
 * Hook to throttle function calls to prevent excessive execution
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef<boolean>(false)

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args)
        inThrottle.current = true
        setTimeout(() => {
          inThrottle.current = false
        }, limit)
      }
    },
    [callback, limit]
  ) as T
}

/**
 * Hook to batch state updates to prevent multiple re-renders
 */
export function useBatchedUpdates() {
  const updateQueue = useRef<Array<() => void>>([])
  const isScheduled = useRef<boolean>(false)

  const batchUpdate = useCallback((updateFn: () => void) => {
    updateQueue.current.push(updateFn)

    if (!isScheduled.current) {
      isScheduled.current = true

      // Use scheduler if available, otherwise setTimeout
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => {
          updateQueue.current.forEach((fn) => fn())
          updateQueue.current = []
          isScheduled.current = false
        })
      } else {
        setTimeout(() => {
          updateQueue.current.forEach((fn) => fn())
          updateQueue.current = []
          isScheduled.current = false
        }, 0)
      }
    }
  }, [])

  return batchUpdate
}

/**
 * Hook to virtualize large lists for better performance
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = items.slice(visibleStart, visibleEnd)
  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  }
}

/**
 * Clear computation cache manually if needed
 */
export function clearComputationCache(): void {
  computationCache.clear()
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  return {
    size: computationCache.size,
    keys: Array.from(computationCache.keys()),
  }
}

export default {
  useDebounce,
  useMemoizedComputation,
  useThrottle,
  useBatchedUpdates,
  useVirtualization,
  clearComputationCache,
  getCacheStats,
}
