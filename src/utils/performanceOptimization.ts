
import React, { ComponentType, LazyExoticComponent } from "react"
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: {
    preload?: boolean
    fallback?: React.ComponentType
    chunkName?: string
  } = {}
): LazyExoticComponent<T> {
  const { preload = false, chunkName } = options
  const LazyComponent = React.lazy(importFunc)
  if (preload) {
    setTimeout(() => {
      importFunc().catch((error) => {
      })
    }, 100)
  }

  return LazyComponent
}
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>()
  private static preloadPromises = new Map<string, Promise<any>>()

  static preload(
    componentName: string,
    importFunc: () => Promise<any>
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

  static preloadOnHover(componentName: string, importFunc: () => Promise<any>) {
    return {
      onMouseEnter: () => this.preload(componentName, importFunc),
      onTouchStart: () => this.preload(componentName, importFunc),
    }
  }

  static preloadOnIntersection(
    componentName: string,
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
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  routeName: string
) => {
  return createLazyComponent(importFunc, {
    chunkName: `route-${routeName}`,
    preload: false, // Routes shouldn't preload by default
  })
}
export const createFeatureComponent = (
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  featureName: string,
  shouldPreload = false
) => {
  return createLazyComponent(importFunc, {
    chunkName: `feature-${featureName}`,
    preload: shouldPreload,
  })
}
export const loadCriticalComponent = (
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  componentName: string
) => {
  return createLazyComponent(importFunc, {
    chunkName: `critical-${componentName}`,
    preload: true,
  })
}

export const loadNonCriticalComponent = (
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  componentName: string
) => {
  return createLazyComponent(importFunc, {
    chunkName: `non-critical-${componentName}`,
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
          }
        })
      })

      try {
        observer.observe({ entryTypes: ["measure", "navigation"] })
      } catch (error) {
      }

      return () => {
        if (startTime.current) {
          const loadTime = performance.now() - startTime.current
          if (loadTime > 100) {
          }
        }
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
      memoryUsage: (performance as any).memory
        ? {
            used: (performance as any).memory.usedJSHeapSize,
            total: (performance as any).memory.totalJSHeapSize,
            limit: (performance as any).memory.jsHeapSizeLimit,
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
