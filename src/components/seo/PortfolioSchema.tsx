import React from "react"
import { usePortfolioSchema } from "../../hooks/usePortfolioSchema"
import { seoManager } from "../../utils/enhancedSEO"
import { SchemaValidator } from "../../utils/schemaValidator"
import { site } from "../../config/site"

interface PortfolioSchemaProps {
  includePersonSchema?: boolean
  includeOrganizationSchema?: boolean
}

export const PortfolioSchema: React.FC<PortfolioSchemaProps> = ({
  includePersonSchema = false,
  includeOrganizationSchema = false,
}) => {
  const { portfolioProjects, reactProjects, portfolioStats } =
    usePortfolioSchema()

  const portfolioSchema = seoManager.generatePortfolioSchema(portfolioProjects)

  const reactProjectsSchema =
    seoManager.generateReactProjectSchema(reactProjects)

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: `${site.name} - ${site.title} Portfolio`,
    alternateName: `${site.alternateName} Portfolio`,
    url: site.url,
    description: `Professional portfolio showcasing ${portfolioStats.totalProjects} web development projects with expertise in WordPress, React, and modern web technologies`,
    inLanguage: site.locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
    },
    author: {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "Person",
      "@id": `${site.url}/#person`,
    },
  }

  const personSchema = includePersonSchema
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        alternateName: site.alternateName,
        jobTitle: site.title,
        description: `Experienced developer with ${portfolioStats.totalProjects} completed projects specializing in WordPress, React, and modern web development`,
        url: site.url,
        email: site.email,
        image: [`${site.url}${site.ogImage}`],
        sameAs: [site.social.github, site.social.linkedin],
        knowsAbout: portfolioStats.uniqueTechnologies,
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: "18+ Years Web Development Experience",
        },
        worksFor: {
          "@type": "Organization",
          name: "Freelance / Contract Development",
        },
        owns: {
          "@type": "CreativeWork",
          "@id": `${site.url}/#portfolio`,
        },
        address: {
          "@type": "Place",
          addressCountry: site.location.country,
          addressLocality: site.location.label,
        },
      }
    : null

  const organizationSchema = includeOrganizationSchema
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: `${site.name} Web Development Services`,
        alternateName: `${site.alternateName} Development`,
        url: site.url,
        logo: `${site.url}${site.ogImage}`,
        email: site.email,
        foundingDate: "2010",
        founder: {
          "@type": "Person",
          "@id": `${site.url}/#person`,
        },
        numberOfEmployees: 1,
        slogan: "Creating seamless web experiences with modern technologies",
        description:
          "Professional web development services specializing in WordPress, React, and full-stack development",
        serviceArea: {
          "@type": "Place",
          name: "Worldwide",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web Development Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "WordPress Development",
                description:
                  "Custom WordPress themes, plugins, and full website development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "React Development",
                description:
                  "Modern React applications and component development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Full Stack Development",
                description:
                  "Complete web application development from frontend to backend",
              },
            },
          ],
        },
      }
    : null

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${site.url}/#projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Web Apps",
        item: `${site.url}/#projects?tab=client`,
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What technologies does ${site.name} specialize in?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${site.name} specializes in ${portfolioStats.uniqueTechnologies
            .slice(0, 8)
            .join(", ")} and has experience with ${
            portfolioStats.totalProjects
          } completed projects.`,
        },
      },
      {
        "@type": "Question",
        name: `How many projects has ${site.name} completed?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${site.name} has completed ${portfolioStats.totalProjects} projects, including ${portfolioStats.featuredProjects} featured projects across various technologies.`,
        },
      },
      {
        "@type": "Question",
        name: `What types of projects does ${site.name} work on?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${site.name} works on ${portfolioStats.projectTypes.join(
            ", "
          )} and specializes in both traditional web development and modern React applications.`,
        },
      },
    ],
  }

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema,
      portfolioSchema,
      reactProjectsSchema,
      breadcrumbSchema,
      faqSchema,
      ...(personSchema ? [personSchema] : []),
      ...(organizationSchema ? [organizationSchema] : []),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          SchemaValidator.optimizeSchema(combinedSchema),
          null,
          2
        ),
      }}
    />
  )
}

export default PortfolioSchema
