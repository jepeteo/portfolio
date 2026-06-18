import React, { memo, useCallback } from "react"
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react"
import { footerLinks } from "../../config/navigation"
import { useAppNavigation } from "../../hooks/useAppNavigation"

const Footer: React.FC = memo(() => {
  const { handleNavigation } = useAppNavigation()

  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/jepeteo",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/thmentis/",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:contact@theodorosmentis.com",
    },
  ]

  const handleFooterNav = useCallback(
    (e: React.MouseEvent, link: (typeof footerLinks)[number]) => {
      e.preventDefault()
      handleNavigation(link)
    },
    [handleNavigation]
  )

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="v2-grid-bg relative overflow-hidden border-t border-[var(--v2-line)] bg-[var(--v2-panel)]">
      <div className="container relative z-10 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="mb-2 font-display text-2xl font-bold tracking-tight text-[var(--v2-text)]">
              Theodoros Mentis
            </h3>
            <p className="text-sm text-[var(--v2-muted)]">
              Senior Full Stack Developer
            </p>
            <p className="mt-1 text-xs text-[var(--v2-soft)]">
              Fixing, improving and building business websites
            </p>
          </div>

          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {footerLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={(e) => handleFooterNav(e, link)}
                  className="cursor-pointer text-sm font-medium text-[var(--v2-muted)] transition-colors hover:text-[var(--v2-acid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
                >
                  {link.text}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="mb-4 flex justify-center gap-4 md:justify-end">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--v2-line)] bg-[var(--v2-panel-2)] text-[var(--v2-muted)] transition-all hover:bg-[var(--v2-acid)] hover:text-[var(--v2-acid-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--v2-line)] bg-[var(--v2-panel-2)] px-4 py-2 text-sm font-medium text-[var(--v2-muted)] transition-colors hover:border-[var(--v2-acid)]/40 hover:text-[var(--v2-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-brand)]"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              Back to top
            </button>
          </div>
        </div>

        <div className="my-4 h-px bg-[var(--v2-line)]" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[var(--v2-soft)]">
            © {currentYear} Theodoros Mentis. All rights reserved.
          </div>

          <div className="flex items-center gap-1 text-sm text-[var(--v2-soft)]">
            Made with
            <Heart className="mx-1 h-4 w-4 text-red-500" />
            using React &amp; TypeScript
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = "Footer"
export default Footer
