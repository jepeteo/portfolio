import { Project } from "../../types"
import { WebProject } from "../projects"
import { site } from "../../config/site"

export const generateWordPressProjectsSchema = (projects: Project[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Professional Projects Portfolio",
  description:
    "A collection of web development projects including dynamic sites, e-commerce platforms, and custom applications",
  numberOfItems: projects.length,
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      "@id": `${site.url}/#${project.id}`,
      name: project.prName,
      description: project.prDescription,
      url: project.prUrl,
      creator: {
        "@type": "Person",
        name: site.name,
        url: site.url,
      },
      about: project.prType,
      ...(project.prFeatured && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          bestRating: "5",
        },
      }),
    },
  })),
})

export const generateWordPressProjectSchema = (project: Project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": `${site.url}/#${project.id}`,
  name: project.prName,
  description: project.prDescription,
  url: project.prUrl,
  creator: {
    "@type": "Person",
    name: site.name,
    url: site.url,
  },
  about: project.prType,
  mainEntityOfPage: {
    "@type": "WebPage",
    name: project.prName,
    url: project.prUrl,
    category: project.prType,
  },
  ...(project.prFeatured && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
    },
  }),
})

export const generateWebProjectsSchema = (projects: WebProject[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${site.url}/#projects`,
  name: "Web Projects & Live Websites",
  description: `Professional client work and personal development projects by ${site.name}`,
  numberOfItems: projects.length,
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      "@id": `${site.url}/#web-project-${project.id}`,
      name: project.title,
      description: project.description,
      url: project.url,
      applicationCategory: project.category,
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      author: {
        "@type": "Person",
        name: site.name,
        url: site.url,
      },
      keywords: project.tech.join(", "),
      ...(project.githubUrl && { codeRepository: project.githubUrl }),
    },
  })),
})

export const generateWebProjectSchema = (project: WebProject) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${site.url}/#web-project-${project.id}`,
  name: project.title,
  description: project.description,
  url: project.url,
  applicationCategory: project.category,
  operatingSystem: "Web Browser",
  author: {
    "@type": "Person",
    name: site.name,
    url: site.url,
  },
  keywords: project.tech.join(", "),
  ...(project.githubUrl && { codeRepository: project.githubUrl }),
})
