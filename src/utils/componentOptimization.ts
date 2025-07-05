/**
 * Component Optimization Utilities
 * Advanced memoization, re-render prevention, and performance monitoring
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from "react"

// Development-only re-render tracking
const isDev =
  typeof window !== "undefined" && window.location.hostname === "localhost"

export interface ComponentPerformanceMetrics {
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  slowRenders: number
}

// Track component re-renders in development - DISABLED for performance
export function useRenderTracker(_componentName: string) {
  // Completely disabled for performance - was causing 400-580ms render times
  return
}

// Enhanced useCallback with dependency tracking
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const prevDeps = useRef<React.DependencyList>()

  if (isDev && debugName) {
    if (
      prevDeps.current &&
      deps.some((dep, i) => dep !== prevDeps.current![i])
    ) {
      console.log(`🔄 useStableCallback dependency changed in ${debugName}:`, {
        oldDeps: prevDeps.current,
        newDeps: deps,
      })
    }
    prevDeps.current = deps
  }

  return useCallback(callback, deps)
}

// Enhanced useMemo with dependency tracking
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const prevDeps = useRef<React.DependencyList>()

  if (isDev && debugName) {
    if (
      prevDeps.current &&
      deps.some((dep, i) => dep !== prevDeps.current![i])
    ) {
      console.log(`🔄 useStableMemo dependency changed in ${debugName}:`, {
        oldDeps: prevDeps.current,
        newDeps: deps,
      })
    }
    prevDeps.current = deps
  }

  return useMemo(factory, deps)
}

// Debounced state hook for performance-critical operations
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, T, (value: T) => void] {
  const [immediateValue, setImmediateValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)
  const timeoutRef = useRef<number>()

  const setValue = useCallback(
    (value: T) => {
      setImmediateValue(value)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value)
      }, delay) as unknown as number
    },
    [delay]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [immediateValue, debouncedValue, setValue]
}

// Throttled callback hook
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): T {
  const lastCall = useRef<number>(0)
  const timeoutRef = useRef<number>()

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastCall.current >= delay) {
        lastCall.current = now
        callback(...args)
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now()
          callback(...args)
        }, delay - (now - lastCall.current)) as unknown as number
      }
    },
    [callback, delay]
  ) as T
}

// Optimized intersection observer hook with performance monitoring
export function useOptimizedIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
  debugName?: string
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const observerRef = useRef<IntersectionObserver>()
  const observationCount = useRef(0)

  // Optimized options with better performance defaults
  const optimizedOptions = useMemo(
    () => ({
      threshold: 0.1,
      rootMargin: "50px",
      ...options,
    }),
    [options.threshold, options.rootMargin, options.root]
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Create observer with throttled callback
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0]
      observationCount.current++

      if (isDev && debugName && observationCount.current % 10 === 0) {
        console.log(
          `👁️ Intersection Observer ${debugName}: ${observationCount.current} observations`
        )
      }

      setIsIntersecting(entry.isIntersecting)

      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true)
      }
    }, optimizedOptions)

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [elementRef, optimizedOptions, hasIntersected, debugName])

  return { isIntersecting, hasIntersected }
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    )
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange.startIndex, visibleRange.endIndex])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight

  const handleScroll = useThrottledCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop)
    },
    16
  ) // 60fps

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange,
  }
}

// Performance-optimized state updater
export function useOptimizedState<T>(initialState: T) {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Optimized setter that prevents unnecessary re-renders
  const setOptimizedState = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      setState((prevState) => {
        const nextState =
          typeof newState === "function"
            ? (newState as (prevState: T) => T)(prevState)
            : newState

        // Shallow comparison to prevent unnecessary updates
        if (typeof nextState === "object" && nextState !== null) {
          const isEqual =
            Object.keys(nextState).every(
              (key) => (nextState as any)[key] === (prevState as any)[key]
            ) &&
            Object.keys(prevState as any).every(
              (key) => (nextState as any)[key] === (prevState as any)[key]
            )

          if (isEqual) {
            return prevState
          }
        } else if (nextState === prevState) {
          return prevState
        }

        return nextState
      })
    },
    []
  )

  return [state, setOptimizedState, stateRef.current] as const
}

// Component composition helper for better re-render control
export function createMemoizedComponent<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean,
  debugName?: string
) {
  const MemoizedComponent = React.memo(Component, propsAreEqual)

  if (isDev && debugName) {
    MemoizedComponent.displayName = `Memoized(${debugName})`
  }

  return MemoizedComponent
}

// Performance monitoring for component trees
export function useComponentTreePerformance(componentName: string) {
  const renderStart = useRef<number>(0)
  const childRenderTimes = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    renderStart.current = performance.now()
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current

    if (isDev && renderTime > 16) {
      console.group(`🌳 Component Tree Performance: ${componentName}`)
      console.log(`Total render time: ${renderTime.toFixed(2)}ms`)

      if (childRenderTimes.current.size > 0) {
        console.log("Child components:")
        childRenderTimes.current.forEach((time, child) => {
          console.log(`  ${child}: ${time.toFixed(2)}ms`)
        })
      }

      console.groupEnd()
    }
  })

  const recordChildRender = useCallback(
    (childName: string, renderTime: number) => {
      childRenderTimes.current.set(childName, renderTime)
    },
    []
  )

  return { recordChildRender }
}

export default {
  useRenderTracker,
  useStableCallback,
  useStableMemo,
  useDebouncedState,
  useThrottledCallback,
  useOptimizedIntersectionObserver,
  useVirtualScrolling,
  useOptimizedState,
  createMemoizedComponent,
  useComponentTreePerformance,
}
