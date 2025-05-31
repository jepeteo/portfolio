import React, { memo, useCallback } from "react"
import { useTheme } from "../context/ThemeContext"
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react"

const Footer: React.FC = memo(() => {
  const { isDark } = useTheme()

  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/jepeteo",
      hoverColor: "hover:text-purple-400",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/thmentis/",
      hoverColor: "hover:text-blue-400",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:th.mentis@gmail.com",
      hoverColor: "hover:text-green-400",
    },
  ]

  // Smooth scroll navigation function
  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault()

      // Handle "top" or "home" section
      if (sectionId === "top" || sectionId === "home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        return
      }

      // Handle other sections
      const targetElement = document.getElementById(sectionId)
      if (targetElement) {
        const headerOffset = 80 // Adjust based on your header height
        const elementPosition = targetElement.offsetTop
        const offsetPosition = elementPosition - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    },
    []
  )

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Navigation items with proper section IDs
  const navigationItems = [
    { sectionId: "top", label: "Home" },
    { sectionId: "about", label: "About" },
    { sectionId: "skills", label: "Skills" },
    { sectionId: "experience", label: "Experience" },
    { sectionId: "projects", label: "Projects" },
    { sectionId: "contact", label: "Contact" },
  ]

  return (
    <footer
      className={`relative overflow-hidden ${
        isDark
          ? "bg-slate-900/50 backdrop-blur-sm border-t border-slate-800"
          : "bg-white/50 backdrop-blur-sm border-t border-slate-200"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)]"
              : "bg-[linear-gradient(to_right,rgba(71,85,105,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.03)_1px,transparent_1px)]"
          } bg-[size:30px_30px]`}
        />
      </div>

      <div className="container relative py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                Theodoros Mentis
              </span>
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Senior Full Stack Developer
            </p>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Crafting digital experiences with passion
            </p>
          </div>

          {/* Quick Links - Updated with proper navigation */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-8">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className={`text-sm font-medium transition-all hover:scale-105 cursor-pointer ${
                    isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end gap-4 mb-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
                    isDark
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  } ${social.hoverColor}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                isDark
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              Back to Top
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`my-4 h-px ${isDark ? "bg-slate-800" : "bg-slate-200"}`}
        />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className={`text-sm ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            © {currentYear} Theodoros Mentis. All rights reserved.
          </div>

          <div
            className={`flex items-center gap-1 text-sm ${
              isDark ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Made with
            <Heart
              className={`w-4 h-4 mx-1 ${
                isDark ? "text-red-400" : "text-red-500"
              }`}
            />
            using React & TypeScript
          </div>
        </div>

        {/* Performance Badge */}
        <div className="mt-6 text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              isDark
                ? "bg-green-500/20 text-green-300"
                : "bg-green-100 text-green-700"
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Optimized for Performance & Accessibility
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = "Footer"
export default Footer
