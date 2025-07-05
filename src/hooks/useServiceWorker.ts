import { useEffect } from "react"

const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.MODE === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/portfolio/sw.js")
          .then((registration) => {
          })
          .catch((registrationError) => {
          })
      })
    }
  }, [])
}

export default useServiceWorker
