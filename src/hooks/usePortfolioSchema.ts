import { useMemo } from "react"
import myProjects from "../assets/myProjects.json"
import myReactProjects from "../assets/myReactProjects.json"

interface PortfolioSchemaProject {
  name: string
  description: string
  url?: string
  technologies: string[]
  dateCreated?: string
  type?: string
  featured?: boolean
  imageUrl?: string
}

interface ReactSchemaProject {
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

export const usePortfolioSchema = () => {
  const portfolioProjects = useMemo((): PortfolioSchemaProject[] => {
    return myProjects
      .filter((project: any) => project.prName && project.prDescription)
      .map((project: any) => ({
        name: project.prName,
        description: project.prDescription,
        url: project.prUrl,
        technologies: extractTechnologiesFromProject(project),
        dateCreated: estimateProjectDate(project),
        type: project.prType,
        featured: project.prFeatured || false,
        imageUrl: generateImageUrl(project.prImageSlug),
      }))
  }, [])
  const reactProjects = useMemo((): ReactSchemaProject[] => {
    return myReactProjects
      .filter((project: any) => project.title && project.description)
      .map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        technologies: project.technologies || [],
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        date: project.date,
        status: project.status,
        featured: project.featured || false,
        performance: project.performance,
        image: project.image,
      }))
  }, [])
  const portfolioStats = useMemo(() => {
    const totalProjects = portfolioProjects.length + reactProjects.length
    const featuredProjects =
      portfolioProjects.filter((p) => p.featured).length +
      reactProjects.filter((p) => p.featured).length

    const allTechnologies = [
      ...portfolioProjects.flatMap((p) => p.technologies),
      ...reactProjects.flatMap((p) => p.technologies),
    ]

    const uniqueTechnologies = [...new Set(allTechnologies)].filter(Boolean)

    const projectTypes = [
      ...new Set(portfolioProjects.map((p) => p.type).filter(Boolean)),
    ]

    return {
      totalProjects,
      featuredProjects,
      uniqueTechnologies,
      projectTypes,
      reactProjectsCount: reactProjects.length,
      traditionalProjectsCount: portfolioProjects.length,
    }
  }, [portfolioProjects, reactProjects])

  return {
    portfolioProjects,
    reactProjects,
    portfolioStats,
  }
}
function extractTechnologiesFromProject(project: any): string[] {
  const technologies: string[] = []
  if (project.prType) {
    if (
      project.prType.includes("WordPress") ||
      project.prType.includes("Dynamic")
    ) {
      technologies.push(
        "WordPress",
        "PHP",
        "MySQL",
        "JavaScript",
        "CSS3",
        "HTML5"
      )
    }
    if (
      project.prType.includes("E-Shop") ||
      project.prType.includes("E-commerce")
    ) {
      technologies.push(
        "WooCommerce",
        "PHP",
        "MySQL",
        "JavaScript",
        "CSS3",
        "HTML5"
      )
    }
  }
  if (project.prTags) {
    const tags = Array.isArray(project.prTags)
      ? project.prTags
      : [project.prTags]
    tags.forEach((tag: string) => {
      if (tag.includes("scratch")) {
        technologies.push("Custom Development")
      }
      if (tag.includes("React")) {
        technologies.push("React", "JavaScript", "CSS3", "HTML5")
      }
    })
  }
  if (project.prEmployer) {
    technologies.push("Professional Development")
  }

  return [...new Set(technologies)]
}

function estimateProjectDate(project: any): string {
  if (project.dateCreated) return project.dateCreated
  const currentYear = new Date().getFullYear()
  if (project.prFeatured) {
    return (currentYear - 1).toString()
  }
  if (
    project.prType?.includes("E-Shop") ||
    project.prType?.includes("E-commerce")
  ) {
    return (currentYear - 2).toString()
  }
  return (currentYear - 3).toString()
}

function generateImageUrl(imageSlug?: string): string | undefined {
  if (!imageSlug) return undefined
  return `/src/assets/images/projects/${imageSlug}.jpg`
}
