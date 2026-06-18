// Single source of truth for route-level SEO metadata.
//
// This file is plain ESM (no TypeScript syntax) on purpose: it is imported both
// by the React app (typed via routeMeta.d.ts) AND by the Node prerender script
// (scripts/prerender.mjs) at build time. Keep it framework-free and serializable.

export const SITE_URL = "https://www.theodorosmentis.com"
export const SITE_EMAIL = "contact@theodorosmentis.com"
export const OG_IMAGE = `${SITE_URL}/social-card.webp`
export const SITE_NAME = "Theodoros Mentis"
export const TWITTER_CREATOR = "@jepeteo"

const personRef = { "@id": `${SITE_URL}/#person` }

function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/**
 * Route metadata keyed by pathname. `canonicalPath` is appended to SITE_URL to
 * build the absolute canonical/OG URL. `jsonLd` holds route-specific structured
 * data (the global Person/WebSite/ProfessionalService graph lives in index.html).
 */
export const routeMeta = {
  "/": {
    title:
      "Theodoros Mentis - Web Developer Who Fixes, Improves & Builds Business Websites",
    description:
      "I fix, improve and build business websites that need to work. WordPress, WooCommerce, React, technical SEO, performance, DNS and email support for small businesses and agencies.",
    canonicalPath: "/",
    ogType: "profile",
    jsonLd: [],
  },
  "/services": {
    title:
      "Web Development, WordPress, SEO & Technical Support Services | Theodoros Mentis",
    description:
      "Practical web development, WordPress, WooCommerce, technical SEO, email/DNS, landing pages, audits and ongoing website support for small businesses and agencies.",
    canonicalPath: "/services",
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        "@id": `${SITE_URL}/services#catalog`,
        name: "Web Development and Technical Support Services",
        url: `${SITE_URL}/services`,
        provider: { "@type": "Person", ...personRef, name: SITE_NAME },
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  },
  "/services/emergency-website-help": {
    title: "Emergency Website Help - Urgent WordPress & Web Fixes | Theodoros Mentis",
    description:
      "Fast help for WordPress errors, broken forms, WooCommerce checkout issues, DNS problems, email setup, SSL errors and other urgent website problems. Fixed quote before work starts.",
    canonicalPath: "/services/emergency-website-help",
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/services/emergency-website-help#service`,
        name: "Emergency Website Help",
        description:
          "Fast help for WordPress errors, broken forms, WooCommerce checkout issues, DNS problems, email setup, SSL errors and urgent website problems.",
        url: `${SITE_URL}/services/emergency-website-help`,
        provider: { "@type": "Person", ...personRef, name: SITE_NAME },
        areaServed: { "@type": "Place", name: "Worldwide (remote)" },
        serviceType: "Emergency website support",
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        {
          name: "Emergency Website Help",
          path: "/services/emergency-website-help",
        },
      ]),
    ],
  },
}

// Routes that should be statically prerendered into per-path index.html files.
// "/" is served by the root index.html and is intentionally excluded.
export const prerenderRoutes = ["/services", "/services/emergency-website-help"]

export function absoluteUrl(canonicalPath) {
  if (canonicalPath === "/") return `${SITE_URL}/`
  return `${SITE_URL}${canonicalPath}`
}
