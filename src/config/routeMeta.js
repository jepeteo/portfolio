// Single source of truth for route-level SEO metadata.
//
// Plain ESM — imported by React (typed via routeMeta.d.ts) and prerender.mjs.

import { faqPageSchema } from "../content/homeFaq.js"
import { siteGraph } from "../content/schemas/siteGraph.js"

export const SITE_URL = "https://www.theodorosmentis.com"
export const SITE_EMAIL = "contact@theodorosmentis.com"
export const OG_IMAGE = `${SITE_URL}/social-card.webp`
export const SITE_NAME = "Theodoros Mentis"
export const TWITTER_CREATOR = "@jepeteo"
export const TWITTER_SITE = "@jepeteo"

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

function serviceJsonLd({ path, name, description, serviceType }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${path}#service`,
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@type": "Person", ...personRef, name: SITE_NAME },
    areaServed: { "@type": "Place", name: "Worldwide (remote)" },
    serviceType,
  }
}

const homeCrawlableHtml = `<article id="static-crawl-fallback" aria-label="Page summary">
  <h1>Practical web systems for businesses that can't afford broken websites.</h1>
  <p>I help small businesses and agencies fix, improve and ship websites with clear scope, clean implementation and no technical theatre.</p>
  <nav aria-label="Primary links">
    <a href="/services">Services</a>
    <a href="/services/emergency-website-help">Emergency help</a>
    <a href="#contact">Contact</a>
  </nav>
</article>`

const servicesCrawlableHtml = `<article id="static-crawl-fallback" aria-label="Page summary">
  <h1>Practical web development, WordPress, SEO and technical support.</h1>
  <p>WordPress, WooCommerce, technical SEO, email/DNS, landing pages, audits and ongoing website support for small businesses and agencies.</p>
  <nav aria-label="Primary links"><a href="/">Home</a><a href="#contact">Contact</a></nav>
</article>`

const emergencyCrawlableHtml = `<article id="static-crawl-fallback" aria-label="Page summary">
  <h1>Website broken or losing enquiries?</h1>
  <p>Fast help for WordPress errors, broken forms, WooCommerce checkout issues, DNS problems, email setup, SSL errors and urgent website problems.</p>
  <nav aria-label="Primary links"><a href="/services">All services</a><a href="/">Home</a></nav>
</article>`

/**
 * Route metadata keyed by pathname.
 */
export const routeMeta = {
  "/": {
    title:
      "Theodoros Mentis - Web Developer Who Fixes, Improves & Builds Business Websites",
    description:
      "I fix and build business websites that work. WordPress, WooCommerce, React, technical SEO, DNS and email support for small businesses and agencies.",
    canonicalPath: "/",
    ogType: "website",
    crawlableHtml: homeCrawlableHtml,
    jsonLd: [faqPageSchema()],
  },
  "/services": {
    title:
      "Web Development, WordPress, SEO & Technical Support Services | Theodoros Mentis",
    description:
      "WordPress, WooCommerce, technical SEO, email/DNS, landing pages, audits and ongoing website support for small businesses and agencies.",
    canonicalPath: "/services",
    ogType: "website",
    crawlableHtml: servicesCrawlableHtml,
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
    title:
      "Emergency Website Help - Urgent WordPress & Web Fixes | Theodoros Mentis",
    description:
      "Urgent WordPress, WooCommerce, DNS, email and SSL fixes. Broken forms, checkout errors and critical site issues — fixed quote before work starts.",
    canonicalPath: "/services/emergency-website-help",
    ogType: "website",
    crawlableHtml: emergencyCrawlableHtml,
    jsonLd: [
      serviceJsonLd({
        path: "/services/emergency-website-help",
        name: "Emergency Website Help",
        description:
          "Fast help for WordPress errors, broken forms, WooCommerce checkout issues, DNS problems, email setup, SSL errors and urgent website problems.",
        serviceType: "Emergency website support",
      }),
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
  "/services/technical-seo-audit": {
    title: "Technical SEO Audit | Theodoros Mentis",
    description:
      "Technical SEO audit: metadata, redirects, indexation, sitemaps, schema and migration risks. Clear priorities and fixed quote before implementation.",
    canonicalPath: "/services/technical-seo-audit",
    ogType: "website",
    crawlableHtml: `<article id="static-crawl-fallback" aria-label="Page summary">
  <h1>Technical SEO audit for sites that need to rank and stay indexed.</h1>
  <p>Review of metadata, redirects, indexation, sitemaps, schema, and migration risks with clear next steps.</p>
</article>`,
    jsonLd: [
      serviceJsonLd({
        path: "/services/technical-seo-audit",
        name: "Technical SEO Audit",
        description:
          "Review metadata, headings, canonical tags, indexation, sitemap, robots.txt, structured data, and technical risks.",
        serviceType: "Technical SEO audit",
      }),
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Technical SEO Audit", path: "/services/technical-seo-audit" },
      ]),
    ],
  },
  "/services/woocommerce-checkout-fix": {
    title: "WooCommerce Checkout Fix | Theodoros Mentis",
    description:
      "WooCommerce checkout repair: payment errors, broken order flow, shipping bugs and plugin conflicts. Fixed quote before work starts.",
    canonicalPath: "/services/woocommerce-checkout-fix",
    ogType: "website",
    crawlableHtml: `<article id="static-crawl-fallback" aria-label="Page summary">
  <h1>WooCommerce checkout broken? Let's get orders flowing again.</h1>
  <p>Focused help for checkout errors, payment display issues, validation bugs, and order flow problems.</p>
</article>`,
    jsonLd: [
      serviceJsonLd({
        path: "/services/woocommerce-checkout-fix",
        name: "WooCommerce Checkout Fix",
        description:
          "Repair checkout errors, payment display issues, broken flows, validation problems, and order-related bugs.",
        serviceType: "WooCommerce checkout repair",
      }),
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        {
          name: "WooCommerce Checkout Fix",
          path: "/services/woocommerce-checkout-fix",
        },
      ]),
    ],
  },
  "/services/email-dns-outlook-fix": {
    title: "Email, DNS & Outlook Fix | Theodoros Mentis",
    description:
      "Fix business email delivery, SPF/DKIM/DMARC, DNS records, SSL and Outlook connection issues. Remote support with a fixed quote.",
    canonicalPath: "/services/email-dns-outlook-fix",
    ogType: "website",
    crawlableHtml: `<article id="static-crawl-fallback" aria-label="Page summary">
  <h1>Business email, DNS, and Outlook not working reliably?</h1>
  <p>Fix deliverability, DNS records, SSL, and Outlook connection issues that stop enquiries from reaching you.</p>
</article>`,
    jsonLd: [
      serviceJsonLd({
        path: "/services/email-dns-outlook-fix",
        name: "Email, DNS and Outlook Fix",
        description:
          "Fix business email setup issues, Outlook connection problems, DNS records, SSL, domain routing, and email delivery.",
        serviceType: "Email and DNS support",
      }),
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        {
          name: "Email, DNS and Outlook Fix",
          path: "/services/email-dns-outlook-fix",
        },
      ]),
    ],
  },
}

export const prerenderRoutes = Object.keys(routeMeta)

export function absoluteUrl(canonicalPath) {
  if (canonicalPath === "/") return `${SITE_URL}/`
  return `${SITE_URL}${canonicalPath}`
}

/** Merged site graph + route-specific JSON-LD for prerender injection. */
export function buildRouteJsonLd(route) {
  const meta = routeMeta[route]
  if (!meta) return siteGraph

  const stripContext = (node) => {
    if (!node || typeof node !== "object") return node
    const { "@context": _ctx, ...rest } = node
    return rest
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...siteGraph["@graph"],
      ...meta.jsonLd.map(stripContext),
    ],
  }
}
