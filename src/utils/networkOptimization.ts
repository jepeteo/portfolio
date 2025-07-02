/**
 * API and Network Performance Optimization Utilities
 * Request deduplication, response caching, and error handling
 */

import { useCallback, useEffect, useRef, useState } from "react"

// Request cache interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

// Request deduplication map
const requestMap = new Map<string, Promise<any>>()
const responseCache = new Map<string, CacheEntry<any>>()

// Default cache duration (5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000

// Enhanced fetch with caching and deduplication
export async function enhancedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: {
    cacheDuration?: number
    useCache?: boolean
    deduplicate?: boolean
  } = {}
): Promise<T> {
  const {
    cacheDuration = DEFAULT_CACHE_DURATION,
    useCache = true,
    deduplicate = true,
  } = cacheOptions

  const cacheKey = `${url}:${JSON.stringify(options)}`
  const now = Date.now()

  // Check cache first
  if (useCache) {
    const cached = responseCache.get(cacheKey)
    if (cached && now < cached.expiry) {
      console.log(`📦 Cache hit for ${url}`)
      return cached.data
    }
  }

  // Check for ongoing request (deduplication)
  if (deduplicate && requestMap.has(cacheKey)) {
    console.log(`🔄 Deduplicating request for ${url}`)
    return requestMap.get(cacheKey)!
  }

  // Create new request
  const requestPromise = fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return response.json()
    })
    .then((data) => {
      // Cache the response
      if (useCache) {
        responseCache.set(cacheKey, {
          data,
          timestamp: now,
          expiry: now + cacheDuration,
        })
      }

      // Remove from request map
      requestMap.delete(cacheKey)

      return data
    })
    .catch((error) => {
      // Remove from request map on error
      requestMap.delete(cacheKey)
      throw error
    })

  // Add to request map for deduplication
  if (deduplicate) {
    requestMap.set(cacheKey, requestPromise)
  }

  return requestPromise
}

// Hook for enhanced API calls with loading states
export function useEnhancedFetch<T>(
  url: string | null,
  options: RequestInit = {},
  cacheOptions: {
    cacheDuration?: number
    useCache?: boolean
    deduplicate?: boolean
    retryAttempts?: number
    retryDelay?: number
  } = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)

  const { retryAttempts = 3, retryDelay = 1000, ...fetchOptions } = cacheOptions

  const executeRequest = useCallback(
    async (requestUrl: string) => {
      try {
        setLoading(true)
        setError(null)

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController()

        const requestOptions = {
          ...options,
          signal: abortControllerRef.current.signal,
        }

        const result = await enhancedFetch<T>(
          requestUrl,
          requestOptions,
          fetchOptions
        )

        setData(result)
        retryCountRef.current = 0
      } catch (err) {
        const error = err as Error

        // Don't retry if request was aborted
        if (error.name === "AbortError") {
          return
        }

        // Retry logic
        if (retryCountRef.current < retryAttempts) {
          retryCountRef.current++
          console.log(
            `🔄 Retrying request (${retryCountRef.current}/${retryAttempts}) in ${retryDelay}ms`
          )

          setTimeout(() => {
            executeRequest(requestUrl)
          }, retryDelay * retryCountRef.current)

          return
        }

        setError(error)
      } finally {
        setLoading(false)
      }
    },
    [options, fetchOptions, retryAttempts, retryDelay]
  )

  // Execute request when URL changes
  useEffect(() => {
    if (!url) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    executeRequest(url)

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [url, executeRequest])

  const refetch = useCallback(() => {
    if (url) {
      retryCountRef.current = 0
      executeRequest(url)
    }
  }, [url, executeRequest])

  return { data, loading, error, refetch }
}

// Cache management utilities
export const CacheManager = {
  // Clear all cached responses
  clearAll() {
    responseCache.clear()
    requestMap.clear()
    console.log("🗑️ Cleared all cache entries")
  },

  // Clear expired cache entries
  clearExpired() {
    const now = Date.now()
    let removedCount = 0

    for (const [key, entry] of responseCache.entries()) {
      if (now >= entry.expiry) {
        responseCache.delete(key)
        removedCount++
      }
    }

    console.log(`🗑️ Removed ${removedCount} expired cache entries`)
  },

  // Get cache statistics
  getStats() {
    const now = Date.now()
    let activeEntries = 0
    let expiredEntries = 0
    let totalSize = 0

    for (const entry of responseCache.values()) {
      if (now < entry.expiry) {
        activeEntries++
      } else {
        expiredEntries++
      }
      totalSize += JSON.stringify(entry.data).length
    }

    return {
      totalEntries: responseCache.size,
      activeEntries,
      expiredEntries,
      ongoingRequests: requestMap.size,
      totalSizeBytes: totalSize,
    }
  },

  // Preload data into cache
  async preload<T>(
    url: string,
    options: RequestInit = {},
    cacheDuration?: number
  ) {
    try {
      await enhancedFetch<T>(url, options, { cacheDuration, useCache: true })
      console.log(`📦 Preloaded data for ${url}`)
    } catch (error) {
      console.warn(`⚠️ Failed to preload ${url}:`, error)
    }
  },
}

// Batch request utility
export async function batchRequests<T>(
  requests: Array<{
    url: string
    options?: RequestInit
    cacheOptions?: any
  }>,
  options: {
    concurrency?: number
    failFast?: boolean
  } = {}
): Promise<Array<{ success: boolean; data?: T; error?: Error }>> {
  const { concurrency = 5, failFast = false } = options
  const results: Array<{ success: boolean; data?: T; error?: Error }> = []

  // Execute requests in batches
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency)

    const batchPromises = batch.map(
      async ({ url, options = {}, cacheOptions = {} }) => {
        try {
          const data = await enhancedFetch<T>(url, options, cacheOptions)
          return { success: true, data }
        } catch (error) {
          if (failFast) {
            throw error
          }
          return { success: false, error: error as Error }
        }
      }
    )

    try {
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    } catch (error) {
      if (failFast) {
        throw error
      }
    }
  }

  return results
}

// WebSocket connection manager with reconnection
export class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string
  private protocols?: string | string[]
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners = new Map<string, Set<Function>>()

  constructor(
    url: string,
    protocols?: string | string[],
    options: {
      maxReconnectAttempts?: number
      reconnectDelay?: number
    } = {}
  ) {
    this.url = url
    this.protocols = protocols
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5
    this.reconnectDelay = options.reconnectDelay || 1000
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url, this.protocols)

      this.ws.onopen = () => {
        console.log("🔌 WebSocket connected")
        this.reconnectAttempts = 0
        this.emit("open")
      }

      this.ws.onmessage = (event) => {
        this.emit("message", event.data)
      }

      this.ws.onclose = () => {
        console.log("🔌 WebSocket disconnected")
        this.emit("close")
        this.handleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("🔌 WebSocket error:", error)
        this.emit("error", error)
      }
    } catch (error) {
      console.error("🔌 Failed to create WebSocket:", error)
      this.emit("error", error)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

      console.log(
        `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
      )

      setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.error("🔌 Max reconnection attempts reached")
      this.emit("maxReconnectAttemptsReached")
    }
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    } else {
      console.warn("🔌 WebSocket is not connected")
    }
  }

  close() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }
}

// Network performance monitoring
export function useNetworkPerformance() {
  const [connectionType, setConnectionType] = useState<string>("unknown")
  const [effectiveType, setEffectiveType] = useState<string>("unknown")
  const [downlink, setDownlink] = useState<number>(0)
  const [rtt, setRtt] = useState<number>(0)

  useEffect(() => {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection

    if (connection) {
      const updateConnectionInfo = () => {
        setConnectionType(connection.type || "unknown")
        setEffectiveType(connection.effectiveType || "unknown")
        setDownlink(connection.downlink || 0)
        setRtt(connection.rtt || 0)
      }

      updateConnectionInfo()
      connection.addEventListener("change", updateConnectionInfo)

      return () => {
        connection.removeEventListener("change", updateConnectionInfo)
      }
    }
  }, [])

  return {
    connectionType,
    effectiveType,
    downlink,
    rtt,
    isSlowConnection: effectiveType === "slow-2g" || effectiveType === "2g",
  }
}

// Automatic cache cleanup
setInterval(() => {
  CacheManager.clearExpired()
}, 60000) // Run every minute

export default {
  enhancedFetch,
  useEnhancedFetch,
  CacheManager,
  batchRequests,
  WebSocketManager,
  useNetworkPerformance,
}
