import { NavigationLink } from "../types"

export type NavLinkKind = "hash" | "route"

export type AppNavigationLink = NavigationLink & {
  kind: NavLinkKind
}

export const navLinks: AppNavigationLink[] = [
  { href: "#top", text: "Home", ariaLabel: "Navigate to home section", kind: "hash" },
  {
    href: "/services",
    text: "Services",
    ariaLabel: "Navigate to services page",
    kind: "route",
  },
  {
    href: "#skills",
    text: "Skills",
    ariaLabel: "Navigate to skills section",
    kind: "hash",
  },
  {
    href: "#projects",
    text: "Projects",
    ariaLabel: "Navigate to projects section",
    kind: "hash",
  },
  {
    href: "#experience",
    text: "Experience",
    ariaLabel: "Navigate to experience section",
    kind: "hash",
  },
  {
    href: "#certificates",
    text: "Certificates",
    ariaLabel: "Navigate to certificates section",
    kind: "hash",
  },
  {
    href: "#about",
    text: "About",
    ariaLabel: "Navigate to about section",
    kind: "hash",
  },
  {
    href: "#contact",
    text: "Contact",
    ariaLabel: "Navigate to contact section",
    kind: "hash",
  },
]

export const footerLinks: AppNavigationLink[] = [
  ...navLinks.filter((link) => link.href !== "#top"),
  {
    href: "/services/emergency-website-help",
    text: "Emergency Help",
    ariaLabel: "Navigate to emergency website help page",
    kind: "route",
  },
]

export const sectionOrder = [
  "top",
  "buyer-intent",
  "proof",
  "fast-help",
  "skills",
  "projects",
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
