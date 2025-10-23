import { useState, useEffect, useCallback } from 'react';

export type ProjectStatus = 'online' | 'offline' | 'checking' | 'unknown';

interface ProjectStatusCache {
  [url: string]: {
    status: ProjectStatus;
    timestamp: number;
  };
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = 'project-status-cache';
const CHECK_TIMEOUT = 8000; // 8 seconds timeout

// Load cache from localStorage
const loadCache = (): ProjectStatusCache => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to load project status cache:', error);
  }
  return {};
};

// Save cache to localStorage
const saveCache = (cache: ProjectStatusCache): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save project status cache:', error);
  }
};

// Check if cached status is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Check if a URL is accessible
const checkUrlStatus = async (url: string): Promise<ProjectStatus> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

    await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors', // To avoid CORS issues
      signal: controller.signal,
      cache: 'no-cache',
    });

    clearTimeout(timeoutId);

    // With no-cors, we can't read the status, but if fetch succeeds, site is likely online
    // If it fails, it will throw an error
    return 'online';
  } catch (error) {
    // Network error, timeout, or CORS issue - assume offline
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log(`Timeout checking ${url}`);
      }
    }
    return 'offline';
  }
};

export const useProjectStatus = (urls: string[], enabled: boolean = true) => {
  const [statuses, setStatuses] = useState<Record<string, ProjectStatus>>({});
  const [isLoading, setIsLoading] = useState(false);

  const checkProjects = useCallback(async () => {
    if (!enabled || urls.length === 0) return;

    setIsLoading(true);
    const cache = loadCache();
    const newStatuses: Record<string, ProjectStatus> = {};
    const urlsToCheck: string[] = [];

    // First, load from cache
    urls.forEach((url) => {
      const cached = cache[url];
      if (cached && isCacheValid(cached.timestamp)) {
        newStatuses[url] = cached.status;
      } else {
        newStatuses[url] = 'checking';
        urlsToCheck.push(url);
      }
    });

    // Update state with cached results immediately
    setStatuses(newStatuses);

    // If no URLs need checking, we're done
    if (urlsToCheck.length === 0) {
      setIsLoading(false);
      return;
    }

    // Check uncached URLs (batch to avoid overwhelming the browser)
    const batchSize = 5;
    for (let i = 0; i < urlsToCheck.length; i += batchSize) {
      const batch = urlsToCheck.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (url) => {
          const status = await checkUrlStatus(url);
          return { url, status };
        })
      );

      // Update cache and state
      results.forEach(({ url, status }) => {
        cache[url] = {
          status,
          timestamp: Date.now(),
        };
        newStatuses[url] = status;
      });

      setStatuses({ ...newStatuses });
    }

    // Save updated cache
    saveCache(cache);
    setIsLoading(false);
  }, [urls, enabled]);

  useEffect(() => {
    checkProjects();
  }, [checkProjects]);

  const refreshStatus = useCallback((url: string) => {
    setStatuses((prev) => ({ ...prev, [url]: 'checking' }));
    
    checkUrlStatus(url).then((status) => {
      const cache = loadCache();
      cache[url] = {
        status,
        timestamp: Date.now(),
      };
      saveCache(cache);
      
      setStatuses((prev) => ({ ...prev, [url]: status }));
    });
  }, []);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      setStatuses({});
      checkProjects();
    } catch (error) {
      console.warn('Failed to clear project status cache:', error);
    }
  }, [checkProjects]);

  return {
    statuses,
    isLoading,
    refreshStatus,
    clearCache,
    checkProjects,
  };
};
