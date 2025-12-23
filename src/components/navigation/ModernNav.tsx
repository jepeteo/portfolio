import React, { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { Icon, icons } from "../icons/ModernIcons"
import { Button } from "../ui/Button"
import { cn, typography } from "../../utils/styles"
import { NavigationLink } from "../../types"

interface ModernNavProps {
  className?: string
}

const ModernNav: React.FC<ModernNavProps> = ({ className }) => {
  const { toggleTheme, isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  // View transitions are handled automatically by the browser for anchor links

  const links: NavigationLink[] = [
    { href: "#top", text: "Home", ariaLabel: "Navigate to home section" },
    {
      href: "#experience",
      text: "Experience",
      ariaLabel: "Navigate to experience section",
    },
    {
      href: "#skills",
      text: "Skills",
      ariaLabel: "Navigate to skills section",
    },
    {
      href: "#projects",
      text: "Projects",
      ariaLabel: "Navigate to projects section",
    },
    {
      href: "#web-projects",
      text: "Web Projects",
      ariaLabel: "Navigate to web projects section",
    },
    {
      href: "#certificates",
      text: "Certificates",
      ariaLabel: "Navigate to certificates section",
    },
    {
      href: "#about",
      text: "About",
      ariaLabel: "Navigate to about section",
    },
    {
      href: "#contact",
      text: "Contact",
      ariaLabel: "Navigate to contact section",
    },
  ]

  // Haptic feedback for mobile devices
  const triggerHaptic = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10) // Subtle 10ms vibration
    }
  }, [])

  const toggleMenu = useCallback(() => {
    triggerHaptic()
    setIsOpen((prev) => !prev)
  }, [triggerHaptic])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Handle swipe to close on mobile
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Close if swiped up significantly (more than 100px)
      if (info.offset.y < -100 || info.velocity.y < -500) {
        triggerHaptic()
        closeMenu()
      }
    },
    [closeMenu, triggerHaptic]
  )

  // Navigation is handled by anchor tags, no need for handleNavigation function
  // Keeping closeMenu for click handlers

  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault()

      triggerHaptic()
      closeMenu()

      const targetId = sectionId === "top" ? "" : sectionId
      const element = targetId
        ? document.getElementById(targetId)
        : document.body

      if (element) {
        const headerOffset = 80
        const elementPosition = element.offsetTop
        const offsetPosition = elementPosition - headerOffset

        window.scrollTo({
          top: targetId ? offsetPosition : 0,
          behavior: "smooth",
        })

        if (targetId) {
          history.pushState(null, "", `#${targetId}`)
        } else {
          history.pushState(null, "", window.location.pathname)
        }
      }
    },
    [closeMenu]
  )

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset for header height

      // Check if at the top of the page
      if (scrollPosition < 300) {
        setActiveSection("#top")
        return
      }

      // Get all section elements and find which one is currently in view
      const sections = links
        .map((link) => {
          const id = link.href.slice(1)
          const element = document.getElementById(id)
          return element ? { id, element } : null
        })
        .filter((section): section is { id: string; element: HTMLElement } => section !== null)

      // Find the section that's currently in view (from bottom to top for accuracy)
      for (let i = sections.length - 1; i >= 0; i--) {
        const { id, element } = sections[i]
        const { offsetTop } = element
        
        if (scrollPosition >= offsetTop) {
          setActiveSection(`#${id}`)
          return
        }
      }

      // Default to first section if nothing matches
      setActiveSection("#top")
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Set initial active section

    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Remove links dependency to prevent re-creating listener

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

  const NavLink: React.FC<{
    link: NavigationLink
    isMobile?: boolean
    isActive?: boolean
  }> = ({ link, isMobile = false, isActive = false }) => (
    <motion.button
      className={cn(
        "relative rounded-xl transition-all duration-200",
        "hover:bg-surface-elevated active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isDark ? "focus:ring-offset-gray-900" : "focus:ring-offset-white",
        // Enhanced mobile touch targets (min 44px height for accessibility)
        isMobile
          ? "w-full text-left justify-start px-5 py-4 min-h-[44px]"
          : "px-4 py-2",
        // Enhanced active state styling
        isActive && "text-primary font-semibold",
        !isActive && (isDark ? "text-slate-300" : "text-slate-600"),
        // Add subtle background for active items
        isActive && (isDark ? "bg-blue-500/15" : "bg-blue-500/10"),
        isMobile && isActive && (isDark ? "bg-blue-500/20" : "bg-blue-500/10")
      )}
      onClick={(e) => handleNavClick(e, link.href.slice(1))}
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={link.ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Desktop underline indicator */}
      {isActive && !isMobile && (
        <motion.div
          className="absolute bottom-0 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-center"
          initial={{ opacity: 0, scaleX: 0.3 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0.3 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}

      {/* Mobile left border indicator */}
      {isActive && isMobile && (
        <motion.div
          className="absolute left-0 top-1/2 w-1 bg-primary rounded-r-full"
          initial={{ height: 0, y: "-50%" }}
          animate={{ height: "70%", y: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}

      {/* Link text with improved sizing for mobile */}
      <span
        className={cn(
          isMobile ? typography.body.large : typography.body.base,
          "relative z-10",
          isActive && "font-semibold"
        )}
      >
        {link.text}
      </span>

      {/* Mobile active indicator dot */}
      {isActive && isMobile && (
        <motion.div
          className="absolute right-5 top-1/2 w-2 h-2 rounded-full bg-primary"
          initial={{ scale: 0, y: "-50%" }}
          animate={{ scale: 1, y: "-50%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
    </motion.button>
  )

  return (
    <nav
      className={cn("relative", className)}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-4">
        <ul className="hidden lg:flex items-center gap-2" role="menubar">
          {links.map((link) => (
            <li key={link.href} role="none">
              <NavLink link={link} isActive={activeSection === link.href} />
            </li>
          ))}
        </ul>

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

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className={cn(
            "lg:hidden p-3 rounded-xl transition-all duration-200",
            "hover:bg-surface-elevated active:scale-95",
            // Larger touch target for mobile (min 44px)
            "min-w-[44px] min-h-[44px]",
            "relative overflow-hidden"
          )}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {/* Animated hamburger to X */}
          <div className="relative w-5 h-5 flex flex-col justify-center items-center">
            <motion.span
              className={cn(
                "absolute w-5 h-0.5 rounded-full transition-colors",
                isDark ? "bg-white" : "bg-slate-900"
              )}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : -6,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className={cn(
                "absolute w-5 h-0.5 rounded-full transition-colors",
                isDark ? "bg-white" : "bg-slate-900"
              )}
              animate={{
                opacity: isOpen ? 0 : 1,
                scaleX: isOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.span
              className={cn(
                "absolute w-5 h-0.5 rounded-full transition-colors",
                isDark ? "bg-white" : "bg-slate-900"
              )}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : 6,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with tap to close */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Mobile menu with swipe gesture */}
            <motion.div
              id="mobile-menu"
              className={cn(
                "fixed top-20 right-4 left-4 z-50 lg:hidden",
                "border rounded-2xl shadow-2xl overflow-hidden",
                isDark
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200"
              )}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              role="menu"
            >
              {/* Swipe indicator */}
              <div className="flex justify-center pt-3 pb-2">
                <div
                  className={cn(
                    "w-12 h-1 rounded-full transition-colors",
                    isDark ? "bg-slate-700" : "bg-slate-300"
                  )}
                />
              </div>

              {/* Menu items with larger touch targets */}
              <div className="px-4 pb-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
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

              {/* Bottom gradient fade for long lists */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-8 pointer-events-none",
                  "bg-gradient-to-t",
                  isDark
                    ? "from-slate-900/98 to-transparent"
                    : "from-white/98 to-transparent"
                )}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default ModernNav
