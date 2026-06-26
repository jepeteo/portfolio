import { SITE_URL, SITE_EMAIL } from "./routeMeta.js"

export const site = {
  name: "Theodoros Mentis",
  alternateName: "Theodore Mentis",
  title: "Web Developer",
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
  description:
    "Freelance web developer helping businesses fix, improve and build WordPress, WooCommerce and React sites. Based in Berlin, remote across Europe.",
  shortDescription:
    "I fix, improve and build business websites — WordPress, WooCommerce, React, technical SEO, DNS and email support.",
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
