// Global JSON-LD entity graph. Plain ESM for prerender + React imports.
// Keep name, email, LinkedIn, and jobTitle in sync with src/config/site.ts.

const SITE_URL = "https://www.theodorosmentis.com"
const SITE_EMAIL = "contact@theodorosmentis.com"
const OG_IMAGE = `${SITE_URL}/social-card.webp`
const SITE_NAME = "Theodoros Mentis"

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`
const SERVICE_ID = `${SITE_URL}/#service`

const PERSON_IMAGE = `${SITE_URL}/images/teo-square.webp`

const KNOWS_ABOUT = [
  "WordPress Development",
  "WooCommerce",
  "React",
  "TypeScript",
  "Technical SEO",
  "DNS and Email",
  "Website Performance",
  "Web Development",
]

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  alternateName: "Theodore Mentis",
  url: SITE_URL,
  image: {
    "@type": "ImageObject",
    url: PERSON_IMAGE,
    width: 800,
    height: 800,
  },
  sameAs: [
    "https://github.com/jepeteo",
    "https://www.linkedin.com/in/theodorosmentis/",
  ],
  jobTitle: "Senior Full-Stack Engineer",
  description:
    "Senior full-stack engineer who builds and rescues reliable digital systems. WordPress, WooCommerce, React, infrastructure and automation. Berlin-based, expanding into fintech.",
  email: SITE_EMAIL,
  nationality: "Greek",
  address: {
    "@type": "PostalAddress",
    addressCountry: "DE",
    addressLocality: "Berlin",
  },
  knowsAbout: KNOWS_ABOUT,
}

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: `${SITE_NAME}: Senior Full-Stack Engineer`,
  description:
    "I build and rescue reliable digital systems. WordPress, WooCommerce, React, infrastructure and automation. Berlin-based, expanding into fintech.",
  inLanguage: "en-US",
  publisher: { "@id": PERSON_ID },
}

const professionalService = {
  "@type": "ProfessionalService",
  "@id": SERVICE_ID,
  name: `${SITE_NAME}: Web Development & Technical Support`,
  url: `${SITE_URL}/services`,
  image: OG_IMAGE,
  email: SITE_EMAIL,
  priceRange: "€€",
  provider: { "@id": PERSON_ID },
  areaServed: { "@type": "Place", name: "Worldwide (remote)" },
  address: {
    "@type": "PostalAddress",
    addressCountry: "DE",
    addressLocality: "Berlin",
  },
  serviceType: [
    "WordPress development",
    "WooCommerce support",
    "Website speed optimization",
    "Technical SEO",
    "Email, DNS and domain support",
    "Website maintenance",
  ],
}

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [website, person, professionalService],
}

export const siteGraphEntities = { person, website, professionalService, PERSON_ID }
