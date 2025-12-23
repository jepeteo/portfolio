import React, { ComponentType, LazyExoticComponent } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: {
    preload?: boolean
    fallback?: React.ComponentType
  } = {}
): LazyExoticComponent<T> {
  const { preload = false } = options

  const LazyComponent = React.lazy(importFunc)

  if (preload) {
    // Preload the component after a short delay
    setTimeout(() => {
      importFunc().catch(() => {
        // Silently fail - component will load when actually needed
      })
    }, 100)
  }

  return LazyComponent
}
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static preloadPromises = new Map<string, Promise<any>>()

  static preload(
    componentName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    importFunc: () => Promise<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (this.preloadedComponents.has(componentName)) {
      return Promise.resolve()
    }

    if (this.preloadPromises.has(componentName)) {
      return this.preloadPromises.get(componentName)!
    }

    const promise = importFunc()
      .then(() => {
        this.preloadedComponents.add(componentName)
        this.preloadPromises.delete(componentName)
      })
      .catch((error) => {
        this.preloadPromises.delete(componentName)
        throw error
      })

    this.preloadPromises.set(componentName, promise)
    return promise
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static preloadOnHover(componentName: string, importFunc: () => Promise<any>) {
    return {
      onMouseEnter: () => this.preload(componentName, importFunc),
      onTouchStart: () => this.preload(componentName, importFunc),
    }
  }

  static preloadOnIntersection(
    componentName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    importFunc: () => Promise<any>,
    options: IntersectionObserverInit = {}
  ) {
    return (element: Element | null) => {
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.preload(componentName, importFunc)
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: "50px", ...options }
      )

      observer.observe(element)
      return () => observer.disconnect()
    }
  }
}

export const createRouteComponent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importFunc: () => Promise<{ default: ComponentType<any> }>
) => {
  return createLazyComponent(importFunc, {
    preload: false, // Routes shouldn't preload by default
  })
}

export const createFeatureComponent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  shouldPreload = false
) => {
  return createLazyComponent(importFunc, {
    preload: shouldPreload,
  })
}

export const loadCriticalComponent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importFunc: () => Promise<{ default: ComponentType<any> }>
) => {
  return createLazyComponent(importFunc, {
    preload: true,
  })
}

export const loadNonCriticalComponent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importFunc: () => Promise<{ default: ComponentType<any> }>
) => {
  return createLazyComponent(importFunc, {
    preload: false,
  })
}

export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) => {
  const MonitoredComponent = (props: P) => {
    const startTime = React.useRef<number>()

    React.useEffect(() => {
      startTime.current = performance.now()

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name.includes(componentName)) {
            // Performance entry found for component - can add logging here
          }
        })
      })

      try {
        observer.observe({ entryTypes: ["measure", "navigation"] })
      } catch {
        // Observer not supported
      }

      return () => {
        // Component unmount cleanup
        observer?.disconnect()
      }
    }, [])

    return React.createElement(WrappedComponent, props)
  }

  MonitoredComponent.displayName = `WithPerformanceMonitoring(${componentName})`
  return MonitoredComponent
}

export const getBundleInfo = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[]

    return {
      navigation: {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      },
      resources: resources.map((resource) => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
      })),
      memoryUsage: performance.memory
        ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
          }
        : null,
    }
  }
  return null
}

export default {
  createLazyComponent,
  ComponentPreloader,
  createRouteComponent,
  createFeatureComponent,
  loadCriticalComponent,
  loadNonCriticalComponent,
  withPerformanceMonitoring,
  getBundleInfo,
}
