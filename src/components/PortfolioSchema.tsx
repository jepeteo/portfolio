import React from "react"
import { usePortfolioSchema } from "../hooks/usePortfolioSchema"
import { seoManager } from "../utils/enhancedSEO"
import { SchemaValidator } from "../utils/schemaValidator"

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
    "@id": "https://theodorosmentis.com/#website",
    name: "Theodoros Mentis - Senior Full Stack Developer Portfolio",
    alternateName: "Theodore Mentis Portfolio",
    url: "https://theodorosmentis.com",
    description: `Professional portfolio showcasing ${portfolioStats.totalProjects} web development projects with expertise in WordPress, React, and modern web technologies`,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://theodorosmentis.com/#website",
    },
    author: {
      "@type": "Person",
      "@id": "https://theodorosmentis.com/#person",
      name: "Theodoros Mentis",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://theodorosmentis.com/?s={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "Person",
      "@id": "https://theodorosmentis.com/#person",
    },
  }

  const personSchema = includePersonSchema
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://theodorosmentis.com/#person",
        name: "Theodoros Mentis",
        alternateName: "Theodore Mentis",
        jobTitle: "Senior Full Stack Developer",
        description: `Experienced developer with ${portfolioStats.totalProjects} completed projects specializing in WordPress, React, and modern web development`,
        url: "https://theodorosmentis.com",
        email: "th.mentis@gmail.com",
        image: [
          "https://theodorosmentis.com/images/opti/teo-portrait.jpg",
          "https://theodorosmentis.com/images/opti/teo-hero.jpg",
        ],
        sameAs: [
          "https://github.com/jepeteo",
          "https://linkedin.com/in/theodorosmentis",
        ],
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
          "@id": "https://theodorosmentis.com/#portfolio",
        },
        address: {
          "@type": "Place",
          addressCountry: "DE",
          addressLocality: "Berlin, Germany",
        },
      }
    : null

  const organizationSchema = includeOrganizationSchema
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://theodorosmentis.com/#organization",
        name: "Theodoros Mentis Web Development Services",
        alternateName: "Theodore Mentis Development",
        url: "https://theodorosmentis.com",
        logo: "https://theodorosmentis.com/images/opti/teo-portrait.jpg",
        email: "th.mentis@gmail.com",
        foundingDate: "2010",
        founder: {
          "@type": "Person",
          "@id": "https://theodorosmentis.com/#person",
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
        item: "https://theodorosmentis.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: "https://theodorosmentis.com/#projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "React Projects",
        item: "https://theodorosmentis.com/#react-projects",
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What technologies does Theodoros Mentis specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Theodoros specializes in ${portfolioStats.uniqueTechnologies
            .slice(0, 8)
            .join(", ")} and has experience with ${
            portfolioStats.totalProjects
          } completed projects.`,
        },
      },
      {
        "@type": "Question",
        name: "How many projects has Theodoros Mentis completed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Theodoros has completed ${portfolioStats.totalProjects} projects, including ${portfolioStats.featuredProjects} featured projects across various technologies.`,
        },
      },
      {
        "@type": "Question",
        name: "What types of projects does Theodoros Mentis work on?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Theodoros works on ${portfolioStats.projectTypes.join(
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
