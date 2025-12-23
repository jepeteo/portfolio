import { useEffect } from "react"

const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (import.meta.env.MODE === "production") {
        window.addEventListener("load", () => {
          const swPath = "/sw.js"

          navigator.serviceWorker
            .register(swPath)
            .then(() => {
              // Service worker registered successfully
            })
            .catch(() => {
              navigator.serviceWorker
                .getRegistrations()
                .then((registrations) => {
                  registrations.forEach((reg) => reg.unregister())
                })
            })
        })
      } else {
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
