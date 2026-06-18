import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  navLinks,
  scrollToSection,
  type AppNavigationLink,
} from "../config/navigation"

export const useAppNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState("")

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

  useEffect(() => {
    if (!isHome) {
      setActiveSection(location.pathname)
      return
    }

    let rafId: number | null = null

    const computeActiveSection = () => {
      rafId = null
      const scrollY = window.scrollY

      if (scrollY < 200) {
        setActiveSection("#top")
        return
      }

      const probeY = scrollY + window.innerHeight / 3
      const sectionIds = navLinks
        .filter((link) => link.kind === "hash")
        .map((link) => link.href.replace("#", ""))
        .filter((id) => id !== "top")

      const sections = sectionIds
        .flatMap((id) => {
          const element = document.getElementById(id)
          if (!element) return []
          const absoluteTop = element.getBoundingClientRect().top + scrollY
          return [{ id, top: absoluteTop }]
        })
        .sort((a, b) => a.top - b.top)

      let activeId: string | null = null
      for (const { id, top } of sections) {
        if (top <= probeY) activeId = id
        else break
      }

      setActiveSection(activeId ? `#${activeId}` : "#top")
    }

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(computeActiveSection)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (rafId !== null) window.cancelAnimationFrame(rafId)
    }
  }, [isHome, location.pathname])

  const isLinkActive = useCallback(
    (link: AppNavigationLink) => {
      if (link.kind === "route") {
        return location.pathname === link.href
      }
      return isHome && activeSection === link.href
    },
    [activeSection, isHome, location.pathname]
  )

  return {
    navLinks,
    handleNavigation,
    isLinkActive,
    isHome,
  }
}
