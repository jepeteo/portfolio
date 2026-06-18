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
  }> = ({ link, isMobile = false, isActive = false }) => {
    // Services / Contact render as stand-out CTAs rather than plain nav items.
    if (link.cta) {
      const ctaBase =
        "relative inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      const ctaVariant =
        link.cta === "primary"
          ? "bg-[var(--v2-acid)] text-[var(--v2-acid-ink)] focus-visible:ring-[var(--v2-acid)]"
          : "border border-[var(--v2-line-strong)] bg-[var(--v2-panel)] text-[var(--v2-text)] hover:border-[var(--v2-acid)]/50 focus-visible:ring-[var(--v2-brand)]"
      return (
        <motion.button
          className={cn(
            ctaBase,
            ctaVariant,
            isMobile ? "min-h-[44px] w-full px-5 py-3 text-base" : "px-4 py-2 text-sm",
            isActive && "ring-2 ring-[var(--v2-acid)] ring-offset-2 ring-offset-[var(--v2-surface)]"
          )}
          onClick={(e) => handleNavClick(e, link)}
          whileTap={{ scale: 0.98 }}
          aria-label={link.ariaLabel}
          aria-current={isActive ? "page" : undefined}
        >
          {link.text}
        </motion.button>
      )
    }

    return (
      <motion.button
        className={cn(
          "relative rounded-xl transition-all duration-200",
          "hover:bg-[var(--v2-panel-2)]/60 active:scale-[0.98]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)]",
          isMobile
            ? "w-full text-left justify-start px-5 py-4 min-h-[44px]"
            : "px-4 py-2",
          isActive
            ? "text-[var(--v2-acid)] font-semibold"
            : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]",
          isMobile && isActive && "bg-[var(--v2-acid)]/10"
        )}
        onClick={(e) => handleNavClick(e, link)}
        whileHover={{ scale: isMobile ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={link.ariaLabel}
        aria-current={isActive ? "page" : undefined}
      >
        {isActive && !isMobile && (
          <motion.div
            className="absolute bottom-0 left-[10%] right-[10%] h-0.5 origin-center rounded-full bg-[var(--v2-acid)]"
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.3 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}

        {isActive && isMobile && (
          <motion.div
            className="absolute left-0 top-1/2 w-1 rounded-r-full bg-[var(--v2-acid)]"
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
      </motion.button>
    )
  }

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

        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300",
            "border border-[var(--v2-line-strong)] bg-[var(--v2-panel-2)] text-[var(--v2-acid)]",
            "hover:border-[var(--v2-acid)]/60 hover:bg-[var(--v2-panel)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)]"
          )}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
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
        </button>

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
              className="absolute h-0.5 w-5 rounded-full bg-[var(--v2-text)] transition-colors"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-[var(--v2-text)] transition-colors"
              animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-[var(--v2-text)] transition-colors"
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
                "overflow-hidden rounded-2xl border border-[var(--v2-line)] bg-[var(--v2-panel)] shadow-2xl"
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
                <div className="h-1 w-12 rounded-full bg-[var(--v2-line-strong)]" />
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

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--v2-panel)] to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Nav
