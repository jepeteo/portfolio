import React, { useState, memo, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import { NavigationLink } from "../types"
import { validateImageSrc } from "../utils/validation"
import sun from "../assets/images/sun.svg"
import moon from "../assets/images/moon.svg"

const Nav: React.FC = memo(() => {
  const { toggleTheme, isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu()
      }
    },
    [closeMenu]
  )

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

  const sunIcon = validateImageSrc(sun, "Light mode")
  const moonIcon = validateImageSrc(moon, "Dark mode")

  return (
    <nav role="navigation" aria-label="Main navigation">
      <div className="flex justify-between items-center p-4">
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-3 group"
          aria-label="Theodore Mentis - Home"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500 transition-all duration-300">
            <img
              src="/images/opti/teo-portrait.jpg"
              alt="Theodore Mentis"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`font-semibold text-lg hidden sm:block ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Theodore Mentis
          </span>
        </a>

        {isOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={closeMenu}
            onKeyDown={handleKeyDown}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <ul
              className={`absolute top-24 left-0 right-0 mx-4 rounded-lg shadow-lg p-4 transition-colors ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
              role="menu"
            >
              {links.map((link) => (
                <li key={link.href} role="none">
                  <a
                    href={link.href}
                    className={`block py-3 px-4 rounded-md transition-colors ${
                      isDark
                        ? "hover:bg-slate-700 text-white"
                        : "hover:bg-slate-100 text-slate-900"
                    }`}
                    onClick={closeMenu}
                    role="menuitem"
                    aria-label={link.ariaLabel}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul
          className="hidden md:flex md:static gap-2 mr-4 xl:gap-4"
          role="menubar"
        >
          {links.map((link) => (
            <li key={link.href} role="none">
              <a
                className={`menu-item px-3 py-2 rounded-md transition-colors ${
                  isDark
                    ? "hover:bg-slate-700 text-white"
                    : "hover:bg-slate-100 text-slate-900"
                }`}
                href={link.href}
                role="menuitem"
                aria-label={link.ariaLabel}
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={toggleMenu}
          className={`menu-ham block md:hidden order-2 p-2 rounded-full transition-colors ${
            isDark
              ? "text-white hover:bg-slate-700"
              : "text-slate-900 hover:bg-slate-100"
          }`}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
          }`}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? (
            <img src={sunIcon} className="h-6 w-6" alt="" aria-hidden="true" />
          ) : (
            <img src={moonIcon} className="h-6 w-6" alt="" aria-hidden="true" />
          )}
        </button>
      </div>
    </nav>
  )
})

Nav.displayName = "Nav"

export default Nav
