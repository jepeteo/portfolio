import { SITE_URL, SITE_EMAIL } from "./routeMeta.js"

export const site = {
  name: "Theodoros Mentis",
  alternateName: "Theodore Mentis",
  title: "Senior Full Stack Developer",
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
    linkedin: "https://linkedin.com/in/theodorosmentis",
  },
  ogImage: "/images/teo-square.webp",
  twitterCreator: "@jepeteo",
  description:
    "Senior Full-Stack Developer with 18+ years of experience in WordPress, React, and modern web technologies. Based in Berlin, Germany. Specializing in scalable web solutions and server administration.",
  shortDescription:
    "Experienced developer creating seamless web experiences with WordPress, React, and modern web technologies. Based in Berlin, Germany.",
  keywords: [
    "full stack developer",
    "wordpress expert",
    "react developer",
    "web development",
    "javascript",
    "typescript",
    "php",
    "mysql",
    "theodoros mentis",
    "portfolio",
    "berlin developer",
  ],
  knowsAbout: [
    "WordPress Development",
    "React Development",
    "JavaScript",
    "TypeScript",
    "PHP",
    "MySQL",
    "Server Administration",
    "Web Development",
    "Full Stack Development",
    "E-commerce Development",
    "Custom Web Applications",
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
  image: `${site.url}${site.ogImage}`,
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
