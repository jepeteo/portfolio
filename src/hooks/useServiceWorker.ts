import { useEffect } from "react"

const useServiceWorker = () => {
  useEffect(() => {
    // Temporarily disable service worker to avoid MIME type issues
    // Re-enable after fixing deployment configuration
    console.log("Service Worker temporarily disabled")

    // Unregister any existing service workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
          console.log("Unregistered service worker:", registration)
        })
      })
    }
  }, [])
}

export default useServiceWorker
