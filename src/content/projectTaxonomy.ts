import { wordpressProjects, webProjects, reactShowcaseProjects } from "./projects"
import type { Project } from "../types"
import type { ReactShowcaseProject, WebProject } from "./projects"

export type ProjectOwnership = "client" | "personal" | "employer" | "open-source"

export type ProjectDomain =
  | "e-commerce"
  | "travel"
  | "sports"
  | "business"
  | "fintech"
  | "infrastructure"
  | "gaming"
  | "portfolio"
  | "web-app"
  | "tool"
  | "productivity"
  | "other"

export type ProjectWorkType =
  | "build"
  | "redesign"
  | "rescue"
  | "integration"
  | "migration"
  | "automation"
  | "maintenance"
  | "audit"

const TAXONOMY_LABELS: Record<string, string> = {
  wordpress: "WordPress",
  "e-commerce": "E-commerce",
  "open-source": "Open source",
  "web-app": "Web app",
  "full-stack": "Full-Stack",
}

export const projectTaxonomyLabel = (value: string) =>
  TAXONOMY_LABELS[value] ??
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

export type ProjectSource = "wordpress" | "web" | "react"

export type EngineeringTrack =
  | "applications"
  | "internal-tools"
  | "infrastructure"
  | "automation"
  | "open-source"
  | "experiments"

export const engineeringTrackOrder: EngineeringTrack[] = [
  "applications",
  "internal-tools",
  "infrastructure",
  "automation",
  "open-source",
  "experiments",
]

export const engineeringTrackLabels: Record<EngineeringTrack, string> = {
  applications: "Applications",
  "internal-tools": "Internal tools",
  infrastructure: "Infrastructure",
  automation: "Automation",
  "open-source": "Open source",
  experiments: "Experiments",
}

/**
 * Public engineering tracks for repository records already approved to show.
 * Unpublished C#, trading, and private infrastructure stay out of this map.
 */
export const publicEngineeringTracks: Partial<
  Record<string, EngineeringTrack>
> = {
  "url-shortener": "applications",
  "notes-app": "open-source",
  "color-palette-generator": "experiments",
  "portfolio-website": "open-source",
}

export type NormalizedProject = {
  id: string
  slug: string
  title: string
  description: string
  url?: string
  githubUrl?: string
  imageSlug?: string
  ownership: ProjectOwnership
  domain: ProjectDomain
  technologies: string[]
  workType: ProjectWorkType
  featured: boolean
  confidential: boolean
  source: ProjectSource
  engineering: boolean
  engineeringTrack?: EngineeringTrack
  year?: string
  employerCode?: string
}

const EMPLOYER_CODES = new Set(["gron", "gtouch", "glbt"])

const categoryToDomain: Record<string, ProjectDomain> = {
  Business: "business",
  Gaming: "gaming",
  Portfolio: "portfolio",
  "Web App": "web-app",
  Tool: "tool",
  Productivity: "productivity",
  Fintech: "fintech",
  Infrastructure: "infrastructure",
  Travel: "travel",
  Sports: "sports",
  "E-commerce": "e-commerce",
}

export const ownershipFromEmployer = (
  employer?: string
): ProjectOwnership => {
  if (!employer) return "client"
  if (employer === "fl") return "client"
  if (EMPLOYER_CODES.has(employer)) return "employer"
  return "client"
}

export const domainFromWordPressType = (prType?: string): ProjectDomain => {
  const type = prType?.toLowerCase() ?? ""
  if (type.includes("e-shop") || type.includes("e-commerce")) return "e-commerce"
  return "business"
}

export const workTypeFromTags = (tags?: string | string[]): ProjectWorkType => {
  const list = Array.isArray(tags) ? tags : tags ? [tags] : []
  const joined = list.join(" ").toLowerCase()
  if (joined.includes("redesign")) return "redesign"
  if (joined.includes("rescue") || joined.includes("fix")) return "rescue"
  if (joined.includes("migration")) return "migration"
  if (joined.includes("integration")) return "integration"
  if (joined.includes("automation")) return "automation"
  if (joined.includes("maintenance")) return "maintenance"
  if (joined.includes("audit")) return "audit"
  return "build"
}

export const normalizeWordPressProject = (
  project: Project
): NormalizedProject => ({
  id: project.id,
  slug: project.id,
  title: project.prName,
  description: project.prDescription,
  url: project.prUrl,
  imageSlug: project.prImageSlug,
  ownership: ownershipFromEmployer(project.prEmployer),
  domain: domainFromWordPressType(project.prType),
  technologies: project.tech ?? [],
  workType: workTypeFromTags(project.prTags),
  featured: Boolean(project.prFeatured),
  confidential: false,
  source: "wordpress",
  engineering: false,
  employerCode: project.prEmployer,
})

export const normalizeWebProject = (project: WebProject): NormalizedProject => {
  const ownership: ProjectOwnership =
    project.type === "personal"
      ? project.githubUrl
        ? "open-source"
        : "personal"
      : "client"

  return {
    id: project.id,
    slug: project.id,
    title: project.title,
    description: project.description,
    url: project.url,
    githubUrl: project.githubUrl,
    ownership,
    domain: categoryToDomain[project.category] ?? "other",
    technologies: project.tech,
    workType: "build",
    featured: project.featured,
    confidential: false,
    source: "web",
    engineering: Boolean(publicEngineeringTracks[project.id]),
    engineeringTrack: publicEngineeringTracks[project.id],
    year: project.year,
  }
}

export const publicProjectDescription = (
  project: Pick<NormalizedProject, "id" | "description">
) => {
  if (project.id === "jepeteo") {
    return "Remote IT support, web development, and digital consulting site."
  }
  return project.description
}

export const normalizeReactProject = (
  project: ReactShowcaseProject
): NormalizedProject => ({
  id: project.id,
  slug: project.id,
  title: project.title,
  description: publicProjectDescription({
    id: project.id,
    description: project.description,
  }),
  url: project.liveUrl,
  githubUrl: project.githubUrl,
  ownership: project.githubUrl ? "open-source" : "personal",
  domain: "web-app",
  technologies: project.technologies,
  workType: "build",
  featured: project.id === "jepeteo" ? false : Boolean(project.featured),
  confidential: false,
  source: "react",
  engineering: Boolean(publicEngineeringTracks[project.id]),
  engineeringTrack: publicEngineeringTracks[project.id],
  year: project.date,
})

export const allNormalizedProjects = (): NormalizedProject[] => {
  const wordpress = wordpressProjects.map(normalizeWordPressProject)
  const web = webProjects.map(normalizeWebProject)
  const webIds = new Set(web.map((project) => project.id))
  const react = reactShowcaseProjects
    .filter((project) => !webIds.has(project.id))
    .map(normalizeReactProject)

  return [...wordpress, ...web, ...react]
}

export const engineeringProjects = () =>
  allNormalizedProjects().filter((project) => project.engineering)
