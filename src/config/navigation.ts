import { NavigationLink } from "../types"

export type NavLinkKind = "hash" | "route"

export type AppNavigationLink = NavigationLink & {
  kind: NavLinkKind
  /** When set, the link is rendered as a stand-out CTA rather than a plain nav item. */
  cta?: "primary" | "secondary"
}

export const navLinks: AppNavigationLink[] = [
  { href: "/", text: "Home", ariaLabel: "Navigate to home", kind: "route" },
  {
    href: "/services",
    text: "Services",
    ariaLabel: "Navigate to services page",
    kind: "route",
    cta: "secondary",
  },
  {
    href: "/projects",
    text: "Projects",
    ariaLabel: "Navigate to projects page",
    kind: "route",
  },
  {
    href: "/engineering",
    text: "Engineering",
    ariaLabel: "Navigate to engineering page",
    kind: "route",
  },
  {
    href: "/experience",
    text: "Experience",
    ariaLabel: "Navigate to experience page",
    kind: "route",
  },
  {
    href: "/certifications",
    text: "Certifications",
    ariaLabel: "Navigate to certifications page",
    kind: "route",
  },
  {
    href: "/contact",
    text: "Contact",
    ariaLabel: "Navigate to contact page",
    kind: "route",
    cta: "primary",
  },
]

export const footerLinks: AppNavigationLink[] = [
  ...navLinks.filter((link) => link.href !== "/"),
  {
    href: "/about",
    text: "About",
    ariaLabel: "Navigate to about page",
    kind: "route",
  },
  {
    href: "/services/emergency-website-help",
    text: "Emergency Help",
    ariaLabel: "Navigate to emergency website help page",
    kind: "route",
  },
]

export const sectionOrder = [
  "top",
  "proof",
  "system-map",
  "fast-help",
  "featured-case-studies",
  "projects",
  "messy-to-stable",
  "process",
  "skills",
  "experience",
  "certificates",
  "about",
  "contact",
] as const

export type ProjectTab = "wordpress" | "client" | "personal"

export const projectTabFromSearch = (search: string): ProjectTab | null => {
  const tab = new URLSearchParams(search).get("tab")
  if (tab === "wordpress" || tab === "client" || tab === "personal") {
    return tab
  }
  return null
}

export const scrollToSection = (sectionId: string, headerOffset = 80) => {
  const targetId = sectionId === "top" ? "" : sectionId
  const element = targetId ? document.getElementById(targetId) : document.body

  if (!element) return

  const offsetPosition = targetId ? element.offsetTop - headerOffset : 0
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  })
}
