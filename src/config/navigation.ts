import { NavigationLink } from "../types"

export const navLinks: NavigationLink[] = [
  { href: "#top", text: "Home", ariaLabel: "Navigate to home section" },
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

export const sectionOrder = [
  "top",
  "buyer-intent",
  "proof",
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
