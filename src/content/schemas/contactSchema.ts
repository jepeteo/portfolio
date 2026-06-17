import { site } from "../../config/site"

export const generateContactSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  email: site.email,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: site.location.country,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "professional",
      email: site.email,
      availableLanguage: ["English", "Greek"],
    },
  ],
  sameAs: [site.social.github, site.social.linkedin],
  worksFor: {
    "@type": "Organization",
    name: "Freelance Web Development",
  },
})

export const generateContactPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${site.url}/#contact`,
  name: `Contact ${site.name}`,
  description: `Get in touch with ${site.name} for web development projects and consultations.`,
  url: `${site.url}/#contact`,
  mainEntity: {
    "@type": "Person",
    name: site.name,
    email: site.email,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
  },
})
