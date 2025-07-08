import React from "react"

interface ProjectSchemaProps {
  project: {
    name: string
    description: string
    url?: string
    type: string
    technologies: string[]
    featured?: boolean
    imageUrl?: string
    dateCreated?: string
  }
  index: number
}

export const ProjectSchema: React.FC<ProjectSchemaProps> = ({
  project,
  index,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type":
      project.type === "E-Shop" || project.type === "E-commerce"
        ? "WebApplication"
        : "SoftwareApplication",
    "@id": `https://theodorosmentis.com/#project-${index}`,
    name: project.name,
    description: project.description,
    ...(project.url && { url: project.url }),
    applicationCategory: mapProjectTypeToCategory(project.type),
    programmingLanguage: project.technologies,
    dateCreated: project.dateCreated || new Date().getFullYear().toString(),
    ...(project.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: project.imageUrl,
        description: `${project.name} project screenshot`,
      },
    }),
    creator: {
      "@type": "Person",
      "@id": "https://theodorosmentis.com/#person",
      name: "Theodoros Mentis",
      jobTitle: "Senior Full Stack Developer",
    },
    isPartOf: {
      "@type": "CreativeWork",
      "@id": "https://theodorosmentis.com/#portfolio",
      name: "Theodoros Mentis Portfolio",
    },
    ...(project.featured && {
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "featured",
          value: "true",
        },
        {
          "@type": "PropertyValue",
          name: "qualityRating",
          value: "high",
        },
      ],
    }),
    ...((project.type === "E-Shop" || project.type === "E-commerce") && {
      applicationSubCategory: "E-commerce Platform",
      featureList: [
        "Online Shopping",
        "Payment Processing",
        "Product Catalog",
        "Order Management",
      ],
    }),
    ...(project.type === "Dynamic Site" && {
      applicationSubCategory: "Dynamic Web Application",
      featureList: [
        "Content Management",
        "User Interaction",
        "Database Integration",
        "Responsive Design",
      ],
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  )
}

function mapProjectTypeToCategory(type: string): string {
  const categoryMap: Record<string, string> = {
    "E-Shop": "E-commerce Application",
    "E-commerce": "E-commerce Application",
    "Dynamic Site": "Web Application",
    Portfolio: "Portfolio Website",
    Business: "Business Application",
    Blog: "Content Management System",
  }
  return categoryMap[type] || "Web Application"
}

export default ProjectSchema
