import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  navLinks,
  scrollToSection,
  type AppNavigationLink,
} from "../config/navigation"

export const useAppNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === "/"

  const handleNavigation = useCallback(
    (link: AppNavigationLink) => {
      if (link.kind === "route") {
        navigate(link.href)
        return
      }

      const sectionId = link.href.replace("#", "")

      if (!isHome) {
        const hash = link.href.startsWith("#") ? link.href : `#${link.href}`
        navigate(`/${hash}`)
        return
      }

      scrollToSection(sectionId)
      history.pushState(null, "", link.href === "#top" ? "/" : link.href)
    },
    [isHome, navigate]
  )

  const isLinkActive = useCallback(
    (link: AppNavigationLink) => {
      if (link.href === "/") {
        return location.pathname === "/"
      }
      return (
        location.pathname === link.href ||
        location.pathname.startsWith(`${link.href}/`)
      )
    },
    [location.pathname]
  )

  return {
    navLinks,
    handleNavigation,
    isLinkActive,
    isHome,
  }
}
