import { useEffect } from "react"

// The custom service worker has been retired (see public/sw.js). This hook now
// only cleans up previously-installed service workers: in production it loads
// the self-removing tombstone when an old registration exists, and in dev it
// unregisters any registration. New visitors never get a persistent SW.
const useServiceWorker = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    const cleanup = () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length === 0) return

        if (import.meta.env.MODE === "production") {
          // Upgrade the stale SW to the tombstone, which clears caches and
          // unregisters itself. Fall back to a direct unregister on failure.
          navigator.serviceWorker.register("/sw.js").catch(() => {
            registrations.forEach((registration) => registration.unregister())
          })
        } else {
          registrations.forEach((registration) => registration.unregister())
        }
      })
    }

    if (document.readyState === "complete") {
      cleanup()
    } else {
      window.addEventListener("load", cleanup, { once: true })
      return () => window.removeEventListener("load", cleanup)
    }
  }, [])
}

export default useServiceWorker
