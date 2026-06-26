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
}

/**
 * Featured case studies for the homepage.
 * TODO: Add project screenshots (webp) to public/images/projects/ when available.
 */
export const featuredCaseStudies: CaseStudy[] = [
  {
    id: "mtx-clinic-app",
    title: "MTX Clinic App",
    label: "Web App",
    problem:
      "Clinic operations needed a practical internal app for appointments, client records, and day-to-day workflows — without fragile spreadsheets or disconnected tools.",
    approach:
      "Built a React-based clinic application with structured UI, role-aware views, and workflows matched to how the team actually works on site.",
    outcome:
      "A maintainable internal tool the clinic can rely on daily, with clear screens and a codebase that can grow as requirements change.",
    stack: ["React", "TypeScript", "Tailwind", "Internal dashboard"],
    // TODO: Confirm public URL if the app should be linked from the portfolio
    sourceProjectId: "mtx-clinic-app",
  },
  {
    id: "stoney-holiday-lets",
    title: "Stoney Holiday Lets",
    label: "WordPress",
    problem:
      "Holiday let business needed a trustworthy booking-focused site for The Lodge and The Nook — clear property info, direct enquiries, and a polished countryside brand.",
    approach:
      "Delivered a WordPress site with property-led structure, mobile-first layout, booking CTAs, and technical SEO foundations for local search.",
    outcome:
      "Live site presenting both properties clearly, supporting direct bookings and giving the business a stable platform to maintain.",
    stack: ["WordPress", "PHP", "Responsive UI", "Technical SEO"],
    url: "https://www.stoneyholidaylets.co.uk/",
    imageSlug: "stoneyholidaylets",
    sourceProjectId: "stoney-holiday-lets",
  },
  {
    id: "technical-rescue",
    title: "DNS, email & SEO rescue",
    label: "Technical Fix",
    problem:
      "Business site after migration: broken forms, wrong DNS records, email deliverability failures, and SEO redirect gaps risking rankings.",
    approach:
      "Audited DNS/SPF/DKIM/DMARC, repaired mail routing, fixed redirect chains and metadata, and documented every change before touching production.",
    outcome:
      "Working contact flow, correct email delivery, clean redirects, and a plain-English summary the client could hand to their team.",
    stack: ["DNS", "Email", "Technical SEO", "WordPress", "Cloudflare"],
    // TODO: Add real project URL and image when available
  },
]
