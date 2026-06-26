export type SkillsLayer = {
  id: string
  title: string
  subtitle: string
  skills: string[]
}

export const skillsLayers: SkillsLayer[] = [
  {
    id: "frontend",
    title: "Frontend",
    subtitle: "Interfaces users actually rely on",
    skills: [
      "React",
      "TypeScript",
      "Tailwind",
      "Responsive UI",
      "Accessibility",
      "Performance-aware interfaces",
    ],
  },
  {
    id: "wordpress",
    title: "WordPress / WooCommerce",
    subtitle: "Business sites that need to stay maintainable",
    skills: [
      "Custom themes",
      "Custom plugins",
      "ACF",
      "WPML",
      "WooCommerce",
      "Migrations",
      "Performance fixes",
    ],
  },
  {
    id: "backend",
    title: "Backend / Infrastructure",
    subtitle: "Where production issues often hide",
    skills: [
      "PHP",
      "MySQL / MariaDB",
      "Apache",
      "Nginx",
      "cPanel / WHM",
      "Plesk",
      "DNS",
      "SSL",
      "Email configuration",
    ],
  },
  {
    id: "growth",
    title: "Growth / Stability",
    subtitle: "Keeping sites findable and safe after changes",
    skills: [
      "Technical SEO",
      "Schema",
      "Redirects",
      "Sitemaps",
      "Analytics",
      "Security hardening",
      "Production-safe debugging",
    ],
  },
]
