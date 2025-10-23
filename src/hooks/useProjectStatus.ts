import { useState, useEffect, useCallback } from "react"

export type ProjectStatus = "online" | "offline" | "checking" | "unknown"

interface ProjectStatusCache {
  [url: string]: {
    status: ProjectStatus
    timestamp: number
  }
}

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const CACHE_KEY = "project-status-cache"
const CHECK_TIMEOUT = 8000 // 8 seconds timeout

// Load cache from localStorage
const loadCache = (): ProjectStatusCache => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.warn("Failed to load project status cache:", error)
  }
  return {}
}

// Save cache to localStorage
const saveCache = (cache: ProjectStatusCache): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn("Failed to save project status cache:", error)
  }
}

// Check if cached status is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION
}

// Check if a URL is accessible
const checkUrlStatus = async (url: string): Promise<ProjectStatus> => {
  console.log(`[Status Check] Starting check for: ${url}`)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT)

    // First, try without no-cors to get real response
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-cache",
    })

    clearTimeout(timeoutId)

    console.log(
      `[Status Check] ${url} - Response status: ${response.status}, type: ${response.type}`
    )

    // If we get here, the request succeeded
    if (response.ok || response.status < 500) {
      console.log(`[Status Check] ${url} - ONLINE (status ${response.status})`)
      return "online"
    }

    console.log(`[Status Check] ${url} - OFFLINE (status ${response.status})`)
    return "offline"
  } catch (error) {
    console.log(`[Status Check] ${url} - Error:`, error)

    if (error instanceof Error) {
      // Timeout = offline
      if (error.name === "AbortError") {
        console.log(`[Status Check] ${url} - OFFLINE (timeout)`)
        return "offline"
      }

      console.log(`[Status Check] ${url} - Trying no-cors fallback...`)

      // Try with no-cors mode as fallback
      try {
        const controller2 = new AbortController()
        const timeoutId2 = setTimeout(() => controller2.abort(), CHECK_TIMEOUT)

        await fetch(url, {
          method: "HEAD",
          mode: "no-cors",
          signal: controller2.signal,
          cache: "no-cache",
        })

        clearTimeout(timeoutId2)

        // If no-cors succeeds, site is online
        console.log(`[Status Check] ${url} - ONLINE (no-cors succeeded)`)
        return "online"
      } catch (noCorsError) {
        // Even no-cors failed - truly offline
        console.log(
          `[Status Check] ${url} - OFFLINE (no-cors also failed)`,
          noCorsError
        )
        return "offline"
      }
    }

    console.log(`[Status Check] ${url} - OFFLINE (unknown error)`)
    return "offline"
  }
}

export const useProjectStatus = (urls: string[], enabled: boolean = true) => {
  const [statuses, setStatuses] = useState<Record<string, ProjectStatus>>({})
  const [isLoading, setIsLoading] = useState(false)

  const checkProjects = useCallback(async () => {
    if (!enabled || urls.length === 0) return

    setIsLoading(true)
    const cache = loadCache()
    const newStatuses: Record<string, ProjectStatus> = {}
    const urlsToCheck: string[] = []

    // First, load from cache
    urls.forEach((url) => {
      const cached = cache[url]
      if (cached && isCacheValid(cached.timestamp)) {
        newStatuses[url] = cached.status
      } else {
        newStatuses[url] = "checking"
        urlsToCheck.push(url)
      }
    })

    // Update state with cached results immediately
    setStatuses(newStatuses)

    // If no URLs need checking, we're done
    if (urlsToCheck.length === 0) {
      setIsLoading(false)
      return
    }

    // Check uncached URLs (batch to avoid overwhelming the browser)
    const batchSize = 5
    for (let i = 0; i < urlsToCheck.length; i += batchSize) {
      const batch = urlsToCheck.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(async (url) => {
          const status = await checkUrlStatus(url)
          return { url, status }
        })
      )

      // Update cache and state
      results.forEach(({ url, status }) => {
        cache[url] = {
          status,
          timestamp: Date.now(),
        }
        newStatuses[url] = status
      })

      setStatuses({ ...newStatuses })
    }

    // Save updated cache
    saveCache(cache)
    setIsLoading(false)
  }, [urls, enabled])

  useEffect(() => {
    checkProjects()
  }, [checkProjects])

  const refreshStatus = useCallback((url: string) => {
    setStatuses((prev) => ({ ...prev, [url]: "checking" }))

    checkUrlStatus(url).then((status) => {
      const cache = loadCache()
      cache[url] = {
        status,
        timestamp: Date.now(),
      }
      saveCache(cache)

      setStatuses((prev) => ({ ...prev, [url]: status }))
    })
  }, [])

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY)
      setStatuses({})
      checkProjects()
    } catch (error) {
      console.warn("Failed to clear project status cache:", error)
    }
  }, [checkProjects])

  return {
    statuses,
    isLoading,
    refreshStatus,
    clearCache,
    checkProjects,
  }
}
