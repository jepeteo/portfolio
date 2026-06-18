import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "")
      const timer = window.setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          const headerOffset = 80
          const offsetPosition = element.offsetTop - headerOffset
          window.scrollTo({ top: offsetPosition, behavior: "smooth" })
        }
      }, 100)
      return () => window.clearTimeout(timer)
    }

    window.scrollTo({ top: 0, behavior: "auto" })
  }, [pathname, hash])

  return null
}

export default ScrollToTop
