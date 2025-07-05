// Modern Navigation Component (2025 Version)
import React, { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { Icon, icons } from "../icons/ModernIcons"
import { Button } from "../ui/Button"
import { cn, typography } from "../../utils/styles"
import { useViewTransition } from "../../hooks/useViewTransition"
import { NavigationLink } from "../../types"

interface ModernNavProps {
  className?: string
}

const ModernNav: React.FC<ModernNavProps> = ({ className }) => {
  const { toggleTheme, isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { startTransition } = useViewTransition()

  const links: NavigationLink[] = [
    { href: "#top", text: "Home", ariaLabel: "Navigate to home section" },
    {
      href: "#skills",
      text: "Skills",
      ariaLabel: "Navigate to skills section",
    },
    {
      href: "#experience",
      text: "Experience",
      ariaLabel: "Navigate to experience section",
    },
    {
      href: "#certificates",
      text: "Certificates",
      ariaLabel: "Navigate to certificates section",
    },
    {
      href: "#projects",
      text: "Projects",
      ariaLabel: "Navigate to projects section",
    },
    {
      href: "#contact",
      text: "Contact",
      ariaLabel: "Navigate to contact section",
    },
  ]

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Handle navigation with view transitions
  const handleNavigation = useCallback(
    (href: string) => {
      if (startTransition) {
        startTransition(() => {
          window.location.hash = href
          closeMenu()
        })
      } else {
        window.location.hash = href
        closeMenu()
      }
    },
    [startTransition, closeMenu]
  )

  // Scroll to section smoothly
  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault()

      // Close mobile menu first
      closeMenu()

      // Get the element
      const targetId = sectionId === "top" ? "" : sectionId
      const element = targetId
        ? document.getElementById(targetId)
        : document.body

      if (element) {
        // Calculate offset for fixed header (adjust this value based on your header height)
        const headerOffset = 80
        const elementPosition = element.offsetTop
        const offsetPosition = elementPosition - headerOffset

        // Smooth scroll with offset
        window.scrollTo({
          top: targetId ? offsetPosition : 0,
          behavior: "smooth",
        })

        // Update URL hash without jumping
        if (targetId) {
          history.pushState(null, "", `#${targetId}`)
        } else {
          history.pushState(null, "", window.location.pathname)
        }
      }
    },
    [closeMenu]
  )

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map((link) => link.href.slice(1))
      const scrollPosition = window.scrollY + 100

      for (const sectionId of sections) {
        const element = document.getElementById(
          sectionId === "top" ? "" : sectionId
        )
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(`#${sectionId}`)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener("scroll", handleScroll)
  }, [links])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden" // Prevent scroll when menu is open
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, closeMenu])

  // Navigation link component
  const NavLink: React.FC<{
    link: NavigationLink
    isMobile?: boolean
    isActive?: boolean
  }> = ({ link, isMobile = false, isActive = false }) => (
    <motion.button
      className={cn(
        "relative px-4 py-2 rounded-lg transition-all duration-200",
        "hover:bg-surface-elevated active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isDark ? "focus:ring-offset-gray-900" : "focus:ring-offset-white",
        isMobile ? "w-full text-left justify-start" : "",
        isActive && "text-primary font-medium"
      )}
      onClick={(e) => handleNavClick(e, link.href.slice(1))} // Only use handleNavClick
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={link.ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Active indicator */}
      {isActive && !isMobile && (
        <motion.div
          className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
          initial={{ width: 0, x: "-50%" }}
          animate={{ width: "80%", x: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}

      {/* Mobile active indicator */}
      {isActive && isMobile && (
        <motion.div
          className="absolute left-0 top-1/2 w-1 bg-primary rounded-r-full"
          initial={{ height: 0, y: "-50%" }}
          animate={{ height: "60%", y: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}

      <span
        className={cn(
          typography.body.base,
          "relative z-10",
          isActive && "font-medium"
        )}
      >
        {link.text}
      </span>
    </motion.button>
  )

  return (
    <nav
      className={cn("relative", className)}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-4">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2" role="menubar">
          {links.map((link) => (
            <li key={link.href} role="none">
              <NavLink link={link} isActive={activeSection === link.href} />
            </li>
          ))}
        </ul>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            "relative p-2 rounded-lg transition-all duration-300",
            "hover:bg-surface-elevated hover:rotate-12"
          )}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          <motion.div
            key={isDark ? "dark" : "light"}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Icon
              icon={isDark ? icons.theme.sun : icons.theme.moon}
              size="md"
              className="text-current"
            />
          </motion.div>
        </Button>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              icon={isOpen ? icons.navigation.close : icons.navigation.menu}
              size="md"
            />
          </motion.div>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              className={cn(
                "fixed top-20 right-4 left-4 z-50 md:hidden",
                "border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl",
                "backdrop-blur-xl p-6 space-y-2",
                // Enhanced background for better visibility
                isDark
                  ? "bg-slate-900/95 dark:bg-slate-900/95"
                  : "bg-white/95 dark:bg-slate-900/95"
              )}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="menu"
            >
              <div className="space-y-1">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    role="none"
                  >
                    <NavLink
                      link={link}
                      isMobile
                      isActive={activeSection === link.href}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <motion.div
                className="pt-4 mt-4 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(typography.body.small, "text-text-muted")}
                  >
                    {isDark ? "Dark" : "Light"} Mode
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="p-2 rounded-lg"
                  >
                    <Icon
                      icon={isDark ? icons.theme.sun : icons.theme.moon}
                      size="sm"
                    />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default ModernNav
