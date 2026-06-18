import React, { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { useTheme } from "../../context/ThemeContext"
import { Icon, icons } from "../ui/icons/Icons"
import { Button } from "../ui/Button"
import { cn, typography } from "../../utils/styles"
import type { AppNavigationLink } from "../../config/navigation"
import { useAppNavigation } from "../../hooks/useAppNavigation"

interface NavProps {
  className?: string
}

const Nav: React.FC<NavProps> = ({ className }) => {
  const { toggleTheme, isDark } = useTheme()
  const { navLinks: links, handleNavigation, isLinkActive } = useAppNavigation()
  const [isOpen, setIsOpen] = useState(false)

  const triggerHaptic = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }, [])

  const toggleMenu = useCallback(() => {
    triggerHaptic()
    setIsOpen((prev) => !prev)
  }, [triggerHaptic])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y < -100 || info.velocity.y < -500) {
        triggerHaptic()
        closeMenu()
      }
    },
    [closeMenu, triggerHaptic]
  )

  const handleNavClick = useCallback(
    (e: React.MouseEvent, link: AppNavigationLink) => {
      e.preventDefault()
      triggerHaptic()
      closeMenu()
      handleNavigation(link)
    },
    [closeMenu, handleNavigation, triggerHaptic]
  )

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, closeMenu])

  const NavLink: React.FC<{
    link: AppNavigationLink
    isMobile?: boolean
    isActive?: boolean
  }> = ({ link, isMobile = false, isActive = false }) => (
    <motion.button
      className={cn(
        "relative rounded-xl transition-all duration-200",
        "hover:bg-surface-elevated active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isDark ? "focus:ring-offset-gray-900" : "focus:ring-offset-white",
        isMobile
          ? "w-full text-left justify-start px-5 py-4 min-h-[44px]"
          : cn("px-4 py-2", isActive && "rounded-full"),
        isActive && "text-primary font-semibold",
        !isActive && (isDark ? "text-slate-300" : "text-slate-600"),
        isActive && (isDark ? "bg-blue-500/15" : "bg-blue-500/10"),
        isMobile && isActive && (isDark ? "bg-blue-500/20" : "bg-blue-500/10")
      )}
      onClick={(e) => handleNavClick(e, link)}
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={link.ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && !isMobile && (
        <motion.div
          className="absolute bottom-0 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-center"
          initial={{ opacity: 0, scaleX: 0.3 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0.3 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}

      {isActive && isMobile && (
        <motion.div
          className="absolute left-0 top-1/2 w-1 bg-primary rounded-r-full"
          initial={{ height: 0, y: "-50%" }}
          animate={{ height: "70%", y: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}

      <span
        className={cn(
          isMobile ? typography.body.large : typography.body.base,
          "relative z-10",
          isActive && "font-semibold"
        )}
      >
        {link.text}
      </span>

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
        <ul className="hidden lg:flex items-center gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink link={link} isActive={isLinkActive(link)} />
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
            "min-w-[44px] min-h-[44px]",
            "relative overflow-hidden"
          )}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <div className="relative w-5 h-5 flex flex-col justify-center items-center">
            <motion.span
              className={cn(
                "absolute w-5 h-0.5 rounded-full transition-colors",
                isDark ? "bg-white" : "bg-slate-900"
              )}
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className={cn(
                "absolute w-5 h-0.5 rounded-full transition-colors",
                isDark ? "bg-white" : "bg-slate-900"
              )}
              animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.span
              className={cn(
                "absolute w-5 h-0.5 rounded-full transition-colors",
                isDark ? "bg-white" : "bg-slate-900"
              )}
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              aria-hidden="true"
            />

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
              <div className="flex justify-center pt-3 pb-2">
                <div
                  className={cn(
                    "w-12 h-1 rounded-full transition-colors",
                    isDark ? "bg-slate-700" : "bg-slate-300"
                  )}
                />
              </div>

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
                      isActive={isLinkActive(link)}
                    />
                  </motion.div>
                ))}
              </div>

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

export default Nav
