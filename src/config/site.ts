import { SITE_URL, SITE_EMAIL } from "./routeMeta.js"

/**
 * Canonical public identity. UI, schema, footer, and docs should import this
 * instead of hardcoding name, counts, email, or profile URLs.
 *
 * Count map (do not mix these in copy):
 * - Career claims below (18 / 390 / 172) match Bio + useExperienceData.
 * - Listed WordPress archive: 122 records in src/assets/myProjects.json
 * - Schema portfolioStats: 128 (WordPress + React showcase only)
 * - Unused BuyerIntent copy: 120+ live client sites
 * - About FAQ uses the career stats below (18+ / 390+ / 172+)
 * - Jepeteo project blurb claims 20+ years / 1000+ clients — keep in JSON,
 *   do not feature that sentence
 */
export const site = {
  name: "Theodoros Mentis",
  alternateName: "Theodore Mentis",
  title: "Senior Full-Stack Engineer",
  email: SITE_EMAIL,
  url: SITE_URL,
  locale: "en-US",
  location: {
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    label: "Berlin, Germany",
  },
  originCountry: "GR",
  social: {
    github: "https://github.com/jepeteo",
    linkedin: "https://www.linkedin.com/in/theodorosmentis/",
  },
  ogImageSocial: "/social-card.webp",
  personImage: "/images/teo-square.webp",
  twitterCreator: "@jepeteo",
  availability: "Available for selected work",
  workMode: "Remote Europe",
  cvPath: "/cv/Theodoros-Mentis-CV.pdf",
  cvDownloadName: "Theodoros_Mentis_CV.pdf",
  stats: {
    yearsExperience: 18,
    yearsExperienceLabel: "18+",
    projectCount: 390,
    projectCountLabel: "390+",
    clientCount: 172,
    clientCountLabel: "172+",
  },
  description:
    "Senior full-stack engineer who builds and rescues reliable digital systems. WordPress, WooCommerce, React, infrastructure and automation — Berlin-based, expanding into fintech.",
  shortDescription:
    "I build and rescue reliable digital systems — WordPress, WooCommerce, React, infrastructure, and automation.",
  keywords: [
    "web developer",
    "wordpress developer",
    "woocommerce support",
    "technical seo",
    "website speed",
    "react developer",
    "dns email support",
    "emergency website help",
    "theodoros mentis",
    "berlin developer",
  ],
  knowsAbout: [
    "WordPress Development",
    "WooCommerce",
    "React Development",
    "JavaScript",
    "TypeScript",
    "Technical SEO",
    "DNS and Email",
    "Website Performance",
    "Web Development",
    "E-commerce Development",
  ],
} as const

export const sitePersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  alternateName: site.alternateName,
  jobTitle: site.title,
  email: site.email,
  url: site.url,
  image: `${site.url}${site.personImage}`,
  sameAs: [site.social.github, site.social.linkedin],
  knowsAbout: [...site.knowsAbout],
  description: site.description,
  worksFor: {
    "@type": "Organization",
    name: "Freelance Web Development Services",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: site.location.country,
  },
} as const
