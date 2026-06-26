import type { RequestType } from "./services"

export type ContactDiagnostic = {
  requestType: RequestType
  title: string
  whatToSend: string[]
  whatYouGet: string[]
}

export const contactDiagnostics: ContactDiagnostic[] = [
  {
    requestType: "wordpress-emergency",
    title: "WordPress emergency",
    whatToSend: [
      "Website URL and what broke",
      "When it started and what changed recently",
      "Admin or hosting access if available",
      "Deadline if the site is blocking business",
    ],
    whatYouGet: [
      "Likely cause and risk assessment",
      "Access needs before any production change",
      "Fixed scope and price before work starts",
    ],
  },
  {
    requestType: "woocommerce-issue",
    title: "WooCommerce issue",
    whatToSend: [
      "Store URL and checkout symptom",
      "Payment or shipping method involved",
      "Screenshots or error messages if possible",
    ],
    whatYouGet: [
      "Checkout flow review and safe fix plan",
      "Quote before changes to live orders",
      "Plain-English summary of what was fixed",
    ],
  },
  {
    requestType: "email-dns-problem",
    title: "Email / DNS problem",
    whatToSend: [
      "Domain and email provider (Outlook, Google, etc.)",
      "What fails — send, receive, or both",
      "Recent DNS or hosting changes",
    ],
    whatYouGet: [
      "SPF/DKIM/DMARC and DNS record review",
      "Clear record changes with rollback notes",
      "Verification steps after the fix",
    ],
  },
  {
    requestType: "website-speed",
    title: "Website speed",
    whatToSend: [
      "URL and slow pages if known",
      "Hosting provider and recent plugin changes",
      "Any PageSpeed or Core Web Vitals reports",
    ],
    whatYouGet: [
      "Performance bottleneck diagnosis",
      "Scoped improvements with realistic impact",
      "Before/after notes on what changed",
    ],
  },
  {
    requestType: "technical-seo",
    title: "Technical SEO",
    whatToSend: [
      "URL and SEO concern (migration, redirects, schema)",
      "Search Console or analytics access if available",
      "Timeline if a launch or migration is pending",
    ],
    whatYouGet: [
      "Technical audit of crawl, redirects, metadata",
      "Risk-ranked fix list with priorities",
      "Implementation quote for agreed scope",
    ],
  },
  {
    requestType: "landing-page",
    title: "Landing page",
    whatToSend: [
      "Goal of the page and target audience",
      "Brand assets, copy, or reference sites",
      "Deadline and hosting setup if known",
    ],
    whatYouGet: [
      "Scope for a focused one-page build",
      "Fixed price for agreed sections",
      "Mobile-first, performance-aware delivery",
    ],
  },
  {
    requestType: "website-redesign",
    title: "Website redesign",
    whatToSend: [
      "Current site URL and what is not working",
      "Must-keep content, features, or integrations",
      "Timeline and budget range if you have one",
    ],
    whatYouGet: [
      "Honest assessment of rebuild vs improve",
      "Phased scope options where useful",
      "Clear quote before design or dev starts",
    ],
  },
  {
    requestType: "maintenance-plan",
    title: "Maintenance plan",
    whatToSend: [
      "Site stack (WordPress, React, etc.)",
      "Update frequency and pain points today",
      "How you prefer to communicate",
    ],
    whatYouGet: [
      "Maintenance scope matched to your stack",
      "Monthly expectations and response approach",
      "Quote for ongoing support",
    ],
  },
  {
    requestType: "internal-tool-dashboard",
    title: "Internal tool / dashboard",
    whatToSend: [
      "Workflow you want to improve",
      "Existing tools or data sources",
      "Who will use it day to day",
    ],
    whatYouGet: [
      "Feasibility and architecture options",
      "Scoped build plan with milestones",
      "Fixed quote for agreed MVP",
    ],
  },
  {
    requestType: "not-sure",
    title: "Not sure yet",
    whatToSend: [
      "Website URL",
      "Describe symptoms in plain language",
      "Mention deadline if something is urgent",
    ],
    whatYouGet: [
      "Help matching the problem to the right service",
      "Questions to narrow scope quickly",
      "Quote path once the issue is clear",
    ],
  },
]

export const getContactDiagnostic = (
  requestType: RequestType
): ContactDiagnostic | undefined =>
  contactDiagnostics.find((item) => item.requestType === requestType)
