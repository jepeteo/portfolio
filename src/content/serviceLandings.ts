import type { RequestType } from "./services"
import { getServiceById } from "./services"

export type ServiceLanding = {
  slug: string
  serviceId: string
  eyebrow: string
  heroTitle: string
  heroSubtitle: string
  symptoms: string[]
  processSteps: string[]
  whatINeed: string[]
  relatedServiceIds: string[]
  requestType: RequestType
}

export const serviceLandings: ServiceLanding[] = [
  {
    slug: "technical-seo-audit",
    serviceId: "technical-seo-audit",
    eyebrow: "Technical SEO",
    heroTitle: "Technical SEO audit for sites that need to rank and stay indexed.",
    heroSubtitle:
      "A practical review of metadata, redirects, indexation, sitemaps, schema, and migration risks, with clear next steps, not a generic checklist PDF.",
    symptoms: [
      "Rankings dropped after a redesign or migration",
      "Broken or missing redirects",
      "Pages not indexed in Search Console",
      "Missing or duplicate metadata",
      "Sitemap or robots.txt issues",
      "Structured data errors",
    ],
    processSteps: [
      "You share the site URL and recent changes",
      "I audit crawl, redirects, metadata, and indexation",
      "You get a prioritized fix list with scope options",
      "Optional: I implement agreed fixes with a fixed quote",
    ],
    whatINeed: [
      "Website URL",
      "Timeline of recent changes or migration",
      "Search Console access if available",
      "Main business goals for organic search",
    ],
    relatedServiceIds: [
      "seo-migration-checklist",
      "301-redirect-map",
      "search-console-setup",
    ],
    requestType: "technical-seo",
  },
  {
    slug: "woocommerce-checkout-fix",
    serviceId: "woocommerce-checkout-fix",
    eyebrow: "WooCommerce",
    heroTitle: "WooCommerce checkout broken? Let's get orders flowing again.",
    heroSubtitle:
      "Focused help for checkout errors, payment display issues, validation bugs, and order flow problems, scoped clearly before work starts.",
    symptoms: [
      "Checkout page errors or white screen",
      "Payment methods not showing",
      "Orders not completing",
      "Shipping or tax calculation bugs",
      "Plugin conflict after update",
      "Mobile checkout layout broken",
    ],
    processSteps: [
      "You send the store URL and describe the checkout issue",
      "I reproduce and trace the cause safely",
      "I confirm scope and provide a fixed quote",
      "I fix, test checkout, and summarize what changed",
    ],
    whatINeed: [
      "Store URL",
      "Steps to reproduce the checkout issue",
      "When it started or what changed recently",
      "Staging or admin access if needed",
    ],
    relatedServiceIds: [
      "woocommerce-payment-method-setup",
      "woocommerce-shipping-rules-setup",
      "wordpress-emergency-fix",
    ],
    requestType: "woocommerce-issue",
  },
  {
    slug: "email-dns-outlook-fix",
    serviceId: "email-dns-outlook-fix",
    eyebrow: "Email & DNS",
    heroTitle: "Business email, DNS, and Outlook not working reliably?",
    heroSubtitle:
      "Fix deliverability, SPF/DKIM/DMARC, DNS records, SSL, and Outlook connection issues that stop enquiries from reaching you.",
    symptoms: [
      "Emails going to spam or not sending",
      "Outlook not connecting to mailbox",
      "DNS records missing or wrong",
      "Domain email routing broken after migration",
      "SSL or HTTPS certificate issues",
      "Forms send but mail never arrives",
    ],
    processSteps: [
      "You describe the email or DNS symptom",
      "I review DNS, mail records, and hosting setup",
      "I propose fixes with a fixed quote before changes",
      "I apply agreed changes and verify delivery",
    ],
    whatINeed: [
      "Domain name and hosting provider",
      "Email provider (e.g. Microsoft 365, Google)",
      "Description of the problem",
      "DNS or admin access if required",
    ],
    relatedServiceIds: [
      "cloudflare-setup",
      "broken-contact-form-fix",
      "website-launch-support",
    ],
    requestType: "email-dns-problem",
  },
]

const landingBySlug = new Map(serviceLandings.map((l) => [l.slug, l]))

export function getServiceLanding(slug: string): ServiceLanding | undefined {
  return landingBySlug.get(slug)
}

export function serviceLandingPath(serviceId: string): string | undefined {
  const landing = serviceLandings.find((l) => l.serviceId === serviceId)
  return landing ? `/services/${landing.slug}` : undefined
}

export function getLandingService(slug: string) {
  const landing = getServiceLanding(slug)
  if (!landing) return undefined
  return getServiceById(landing.serviceId)
}
