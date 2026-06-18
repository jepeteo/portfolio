import myProjects from "../assets/myProjects.json"
import clientProjects from "../assets/clientProjects.json"
import personalProjects from "../assets/personalProjects.json"
import myReactProjects from "../assets/myReactProjects.json"
import { Project } from "../types"
import { isValidProject } from "../utils/validation"
import type { ProjectTab } from "../config/navigation"
import { site } from "../config/site"

export type WebProject = {
  id: string
  title: string
  url: string
  githubUrl?: string
  description: string
  tech: string[]
  category: string
  type: "client" | "personal"
  featured: boolean
  status: "Live" | "In Development"
  year: string
  servicesDemonstrated?: string[]
  imageUrl?: string
}

export type ReactShowcaseProject = {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  date?: string
  status?: string
  featured?: boolean
  performance?: string
  image?: string
}

export type SchemaProject = {
  name: string
  description: string
  url?: string
  technologies: string[]
  dateCreated?: string
  type?: string
  featured?: boolean
  imageUrl?: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export const wordpressProjects: Project[] = (myProjects as unknown[])
  .filter(isValidProject)
  .map((project, index) => ({
    ...project,
    id: `project-${index}-${slugify(project.prName)}`,
    prTags: Array.isArray(project.prTags)
      ? project.prTags
      : typeof project.prTags === "string"
        ? [project.prTags]
        : [],
  }))

export const webProjects: WebProject[] = [
  ...(clientProjects as WebProject[]),
  ...(personalProjects as WebProject[]),
]

export const reactShowcaseProjects: ReactShowcaseProject[] = (
  myReactProjects as ReactShowcaseProject[]
).filter((project) => project.title && project.description)

function extractTechnologiesFromWordPressProject(
  project: Project
): string[] {
  const technologies: string[] = []

  if (project.tech?.length) {
    technologies.push(...project.tech)
  }

  if (project.prType) {
    if (
      project.prType.includes("WordPress") ||
      project.prType.includes("Dynamic")
    ) {
      technologies.push("WordPress", "PHP", "MySQL")
    }
    if (
      project.prType.includes("E-Shop") ||
      project.prType.includes("E-commerce")
    ) {
      technologies.push("WooCommerce")
    }
  }

  if (project.prTags) {
    const tags = Array.isArray(project.prTags)
      ? project.prTags
      : [project.prTags]
    tags.forEach((tag) => {
      if (tag.includes("scratch")) technologies.push("Custom Development")
      if (tag.includes("React")) technologies.push("React")
    })
  }

  return [...new Set(technologies)]
}

function estimateWordPressProjectDate(project: Project): string {
  const currentYear = new Date().getFullYear()
  if (project.prFeatured) return String(currentYear - 1)
  if (
    project.prType?.includes("E-Shop") ||
    project.prType?.includes("E-commerce")
  ) {
    return String(currentYear - 2)
  }
  return String(currentYear - 3)
}

export const schemaWordPressProjects: SchemaProject[] = wordpressProjects.map(
  (project) => ({
    name: project.prName,
    description: project.prDescription,
    url: project.prUrl,
    technologies: extractTechnologiesFromWordPressProject(project),
    dateCreated: estimateWordPressProjectDate(project),
    type: project.prType,
    featured: project.prFeatured || false,
    imageUrl: project.prImageSlug
      ? `${site.url}/images/projects/${project.prImageSlug}.webp`
      : undefined,
  })
)

export const schemaReactProjects: ReactShowcaseProject[] = reactShowcaseProjects

export const projectTabs = [
  {
    id: "wordpress" as const,
    label: "WordPress",
    description: "Client sites, e-commerce, and dynamic WordPress builds",
  },
  {
    id: "client" as const,
    label: "Client",
    description: "Modern web apps and business sites for clients",
  },
  {
    id: "personal" as const,
    label: "Personal",
    description: "Side projects and open-source experiments",
  },
]

export const projectTabCounts: Record<ProjectTab, number> = {
  wordpress: wordpressProjects.length,
  client: webProjects.filter((project) => project.type === "client").length,
  personal: webProjects.filter((project) => project.type === "personal")
    .length,
}

export const getWebProjectsForTab = (tab: "client" | "personal") =>
  webProjects.filter((project) => project.type === tab)

export const getWebProjectInitials = (title: string) =>
  title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

const categoryGradients: Record<string, string> = {
  Business: "from-blue-600 to-cyan-500",
  Gaming: "from-purple-600 to-pink-500",
  Portfolio: "from-indigo-600 to-blue-500",
  "Web App": "from-cyan-600 to-teal-500",
  Tool: "from-orange-500 to-amber-500",
  Productivity: "from-violet-600 to-purple-500",
}

export const getWebProjectGradient = (category: string) =>
  categoryGradients[category] ?? "from-slate-600 to-slate-800"

export const getAllProjectsForSchema = () => ({
  wordpress: wordpressProjects,
  web: webProjects,
})

export const portfolioStats = {
  totalProjects: wordpressProjects.length + reactShowcaseProjects.length,
  featuredProjects:
    wordpressProjects.filter((project) => project.prFeatured).length +
    reactShowcaseProjects.filter((project) => project.featured).length,
  reactProjectsCount: reactShowcaseProjects.length,
  traditionalProjectsCount: wordpressProjects.length,
  uniqueTechnologies: [
    ...new Set([
      ...schemaWordPressProjects.flatMap((project) => project.technologies),
      ...reactShowcaseProjects.flatMap((project) => project.technologies),
    ]),
  ].filter(Boolean),
  projectTypes: [
    ...new Set(
      wordpressProjects.map((project) => project.prType).filter(Boolean)
    ),
  ],
}
