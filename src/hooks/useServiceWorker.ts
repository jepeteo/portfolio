import { useEffect } from "react"

const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Only register service worker in production mode
      if (import.meta.env.MODE === "production") {
        window.addEventListener("load", () => {
          // Use correct path for Vercel deployment
          const swPath = "/sw.js"

          navigator.serviceWorker
            .register(swPath)
            .then((registration) => {
              console.log("SW registered successfully: ", registration)
            })
            .catch((registrationError) => {
              console.log("SW registration failed: ", registrationError)
              // If registration fails, unregister any existing ones
              navigator.serviceWorker
                .getRegistrations()
                .then((registrations) => {
                  registrations.forEach((reg) => reg.unregister())
                })
            })
        })
      } else {
        // In development, unregister any existing service workers to avoid conflicts
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister()
          })
        })
      }
    }
  }, [])
}

export default useServiceWorker
