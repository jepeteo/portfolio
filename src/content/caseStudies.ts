export type CaseStudyLabel =
  | "Client"
  | "Personal"
  | "WordPress"
  | "Web App"
  | "Technical Fix"

export type CaseStudy = {
  id: string
  title: string
  label: CaseStudyLabel
  problem: string
  approach: string
  outcome: string
  stack: string[]
  url?: string
  githubUrl?: string
  imageSlug?: string
  sourceProjectId?: string
  context?: string
  responsibility?: string
  constraints?: string
  solution?: string
  technicalContribution?: string
  relatedServiceIds?: string[]
  confidential?: boolean
  projectType?: string
  status?: string
}

export const projectImageSrc = (imageSlug?: string) =>
  imageSlug ? `/images/projects/${imageSlug}.webp` : undefined

/**
 * Featured case studies for the homepage.
 * Only named, verified work. Do not add composite examples here.
 */
export const featuredCaseStudies: CaseStudy[] = [
  {
    id: "mtx-clinic-app",
    title: "MTX Clinic App",
    label: "Web App",
    confidential: true,
    projectType: "Internal clinic application",
    status:
      "Private production system. Screens and live URL are not public.",
    problem:
      "Clinic operations needed a practical internal app for appointments, client records, and day-to-day workflows, without fragile spreadsheets or disconnected tools.",
    approach:
      "Built a Next.js clinic application with structured UI, role-aware views, and workflows matched to how the team actually works on site.",
    outcome:
      "A maintainable internal tool the clinic can rely on daily, with clear screens and a codebase that can grow as requirements change.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Role-based access"],
    solution:
      "Built a Next.js clinic application with structured UI, role-aware views, and workflows matched to how the team actually works on site.",
    responsibility: "Design and implementation of the internal clinic application.",
    constraints:
      "Operational data stays inside the clinic environment. The application is not a public product.",
    sourceProjectId: "mtx-clinic-app",
  },
  {
    id: "stoney-holiday-lets",
    title: "Stoney Holiday Lets",
    label: "WordPress",
    projectType: "Client WordPress website",
    problem:
      "Holiday let business needed a trustworthy booking-focused site for The Lodge and The Nook, with clear property info, direct enquiries, and a polished countryside brand.",
    approach:
      "Delivered a WordPress site with property-led structure, mobile-first layout, booking CTAs, and technical SEO foundations for local search.",
    outcome:
      "Live site presenting both properties clearly, supporting direct bookings and giving the business a stable platform to maintain.",
    stack: ["WordPress", "PHP", "Responsive UI", "Technical SEO"],
    solution:
      "Delivered a WordPress site with property-led structure, mobile-first layout, booking CTAs, and technical SEO foundations for local search.",
    responsibility: "WordPress implementation, structure, and technical SEO foundations.",
    url: "https://www.stoneyholidaylets.co.uk/",
    imageSlug: "stoneyholidaylets",
    sourceProjectId: "stoney-holiday-lets",
  },
]

export const typicalRescueEngagement = {
  title: "Typical rescue engagement",
  label: "Typical workflow",
  problem:
    "After a migration, a business site can arrive with broken forms, incorrect DNS records, email that never reaches the inbox, and redirect gaps that put rankings at risk.",
  approach:
    "Audit DNS, SPF, DKIM and DMARC, repair mail routing, fix redirect chains and metadata, and document every change before touching production.",
  outcome:
    "Working contact flow, correct email delivery, clean redirects, and a plain-English summary the client can hand to their team.",
  stack: ["DNS", "Email", "Technical SEO", "WordPress", "Cloudflare"],
  note: "This describes a typical rescue workflow. It is not a named client case study.",
}

export const caseStudyById = (id: string) =>
  featuredCaseStudies.find((study) => study.id === id)

export const adjacentCaseStudies = (id: string) => {
  const index = featuredCaseStudies.findIndex((study) => study.id === id)
  if (index === -1) return { previous: undefined, next: undefined }
  return {
    previous: featuredCaseStudies[index - 1],
    next: featuredCaseStudies[index + 1],
  }
}
