import React, { useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
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
  const { navLinks: links, isLinkActive } = useAppNavigation()
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

  const handleNavClick = useCallback(() => {
    triggerHaptic()
    closeMenu()
  }, [closeMenu, triggerHaptic])

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
        <Link
          to={link.href}
          className={cn(
            ctaBase,
            ctaVariant,
            isMobile ? "min-h-[44px] w-full px-5 py-3 text-base" : "px-4 py-2 text-sm",
            isActive && "ring-2 ring-[var(--v2-acid)] ring-offset-2 ring-offset-[var(--v2-surface)]"
          )}
          onClick={handleNavClick}
          aria-label={link.ariaLabel}
          aria-current={isActive ? "page" : undefined}
        >
          {link.text}
        </Link>
      )
    }

    return (
      <Link
        to={link.href}
        className={cn(
          "relative rounded-xl transition-all duration-200",
          "hover:bg-[var(--v2-panel-2)]/60 active:scale-[0.98]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-surface)]",
          isMobile
            ? "block w-full text-left justify-start px-5 py-4 min-h-[44px]"
            : "inline-block px-3 py-2",
          isActive
            ? "text-[var(--v2-acid)] font-semibold"
            : "text-[var(--v2-muted)] hover:text-[var(--v2-text)]",
          isMobile && isActive && "bg-[var(--v2-acid)]/10"
        )}
        onClick={handleNavClick}
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
      </Link>
    )
  }

  return (
    <nav
      className={cn("relative", className)}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-4">
        <ul className="hidden xl:flex items-center gap-1">
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
            "xl:hidden p-3 rounded-xl transition-all duration-200",
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

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-[10040] bg-[#02040a] xl:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeMenu}
                  aria-hidden="true"
                />

                <motion.div
                  id="mobile-menu"
                  className="fixed inset-0 z-[10050] flex flex-col bg-[var(--v2-surface)] text-[var(--v2-text)] xl:hidden"
                  style={{ backgroundColor: "var(--v2-surface)" }}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile navigation"
                >
                  <div className="flex items-center justify-between border-b border-[var(--v2-line-strong)] px-5 py-4">
                    <p className="m-0 font-display text-lg font-bold tracking-tight">
                      Menu
                    </p>
                    <button
                      type="button"
                      onClick={closeMenu}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--v2-line-strong)] text-[var(--v2-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
                      aria-label="Close navigation menu"
                    >
                      <Icon icon={icons.navigation.close} size="md" className="text-current" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-6">
                    {links
                      .filter((link) => link.href !== "/contact")
                      .map((link, index) => (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04, duration: 0.2 }}
                        >
                          <NavLink
                            link={link}
                            isMobile
                            isActive={isLinkActive(link)}
                          />
                        </motion.div>
                      ))}
                  </div>

                  <div className="border-t border-[var(--v2-line-strong)] bg-[var(--v2-surface)] p-5">
                    {links
                      .filter((link) => link.href === "/contact")
                      .map((link) => (
                        <NavLink
                          key={link.href}
                          link={link}
                          isMobile
                          isActive={isLinkActive(link)}
                        />
                      ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  )
}

export default Nav
