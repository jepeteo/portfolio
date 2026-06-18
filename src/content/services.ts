export type ServiceItem = {
  id: string
  title: string
  shortDescription: string
  priceLabel?: string
  deliveryLabel?: string
  bestFor?: string
  featured?: boolean
  emergency?: boolean
}

export type ServiceCategory = {
  id: string
  title: string
  intro: string
  services: ServiceItem[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "emergency-website-support",
    title: "Emergency Website Support",
    intro:
      "Fast, focused help when something breaks and your site or business is at risk.",
    services: [
      {
        id: "wordpress-emergency-fix",
        title: "WordPress emergency fix",
        shortDescription:
          "Fast help for broken forms, login issues, fatal errors, plugin conflicts, layout problems, and update-related issues.",
        priceLabel: "From €150",
        deliveryLabel: "Same day or next day when possible",
        featured: true,
        emergency: true,
      },
      {
        id: "website-recovery-after-update",
        title: "Website recovery after update",
        shortDescription:
          "Repair layout, plugin, theme, or PHP issues caused by recent updates.",
        priceLabel: "From €150",
        deliveryLabel: "Same day or next day when possible",
        emergency: true,
      },
      {
        id: "broken-contact-form-fix",
        title: "Broken contact form fix",
        shortDescription:
          "Diagnose and repair contact forms, email routing, validation, spam protection, and notification issues.",
        priceLabel: "From €80",
        deliveryLabel: "Usually fast",
        emergency: true,
      },
      {
        id: "white-screen-critical-error-fix",
        title: "White screen or critical error fix",
        shortDescription:
          "Debug WordPress critical errors and restore access safely where possible.",
        priceLabel: "From €150",
        emergency: true,
      },
      {
        id: "plugin-conflict-diagnosis",
        title: "Plugin conflict diagnosis",
        shortDescription:
          "Identify conflicting plugins, themes, or PHP version issues and recommend a safe fix.",
        priceLabel: "From €120",
      },
      {
        id: "website-launch-support",
        title: "Website launch support",
        shortDescription:
          "Final technical checks before launch, including DNS, SSL, forms, metadata, redirects, analytics, and mobile review.",
        priceLabel: "From €150",
      },
    ],
  },
  {
    id: "wordpress-woocommerce",
    title: "WordPress and WooCommerce",
    intro:
      "Practical WordPress and WooCommerce development for stores, plugins, and business workflows.",
    services: [
      {
        id: "woocommerce-checkout-fix",
        title: "WooCommerce checkout fix",
        shortDescription:
          "Repair checkout errors, payment display issues, broken flows, validation problems, and order-related bugs.",
        priceLabel: "From €150",
        featured: true,
      },
      {
        id: "woocommerce-shipping-rules-setup",
        title: "WooCommerce shipping rules setup",
        shortDescription:
          "Configure shipping zones, methods, conditions, and special rules for products or regions.",
        priceLabel: "From €150",
      },
      {
        id: "woocommerce-payment-method-setup",
        title: "WooCommerce payment method setup",
        shortDescription:
          "Configure Stripe, PayPal, bank transfer, COD, or payment visibility rules.",
        priceLabel: "From €120",
      },
      {
        id: "woocommerce-custom-checkout-message",
        title: "WooCommerce custom checkout message",
        shortDescription:
          "Add custom notices, payment instructions, delivery notes, or conditional messages during checkout.",
        priceLabel: "From €80",
      },
      {
        id: "woocommerce-cod-fee-setup",
        title: "WooCommerce COD fee setup",
        shortDescription:
          "Add cash-on-delivery fees based on shipping method, zone, or order rules.",
        priceLabel: "From €100",
      },
      {
        id: "custom-wordpress-snippet",
        title: "Custom WordPress snippet",
        shortDescription:
          "Small custom functionality without installing unnecessary plugins.",
        priceLabel: "From €80",
      },
      {
        id: "custom-wordpress-mini-plugin",
        title: "Custom WordPress mini-plugin",
        shortDescription:
          "Build a lightweight plugin for repeatable business logic, API integration, or admin workflow.",
        priceLabel: "From €250",
      },
      {
        id: "wordpress-security-hardening",
        title: "WordPress security hardening",
        shortDescription:
          "Basic hardening, plugin review, user review, update check, and common risk reduction.",
        priceLabel: "From €150",
      },
    ],
  },
  {
    id: "speed-technical-seo",
    title: "Speed and Technical SEO",
    intro:
      "Improve performance, Core Web Vitals, and the technical foundations that support search visibility.",
    services: [
      {
        id: "website-speed-mini-fix",
        title: "Website speed mini-fix",
        shortDescription:
          "Improve load time through image, cache, script, plugin, and frontend cleanup.",
        priceLabel: "From €150",
        featured: true,
      },
      {
        id: "core-web-vitals-review",
        title: "Core Web Vitals review",
        shortDescription:
          "Review performance metrics and identify practical fixes for user experience and SEO.",
        priceLabel: "From €150",
      },
      {
        id: "image-optimization-pass",
        title: "Image optimization pass",
        shortDescription:
          "Compress, resize, convert, and review image loading strategy for better performance.",
        priceLabel: "From €120",
      },
      {
        id: "technical-seo-audit",
        title: "Technical SEO audit",
        shortDescription:
          "Review metadata, headings, canonical tags, indexation, sitemap, robots.txt, structured data, and technical risks.",
        priceLabel: "From €180",
        featured: true,
      },
      {
        id: "seo-migration-checklist",
        title: "SEO migration checklist",
        shortDescription:
          "Plan a safe redesign or platform migration with URL mapping, redirects, metadata, and Search Console checks.",
        priceLabel: "From €250",
      },
      {
        id: "301-redirect-map",
        title: "301 redirect map",
        shortDescription:
          "Create or review redirects to preserve rankings and reduce broken URLs after a redesign.",
        priceLabel: "From €180",
      },
      {
        id: "search-console-setup",
        title: "Search Console setup",
        shortDescription:
          "Verify property, submit sitemap, check indexing, and review basic technical issues.",
        priceLabel: "From €100",
      },
    ],
  },
  {
    id: "email-dns-domains",
    title: "Email, DNS and Domains",
    intro:
      "Resolve email delivery, DNS, SSL, and domain routing issues that affect business communication.",
    services: [
      {
        id: "email-dns-outlook-fix",
        title: "Email, DNS and Outlook fix",
        shortDescription:
          "Fix business email setup issues, Outlook connection problems, DNS records, SSL, domain routing, and email delivery.",
        priceLabel: "From €100",
        featured: true,
        emergency: true,
      },
      {
        id: "cloudflare-setup",
        title: "Cloudflare setup",
        shortDescription:
          "Configure DNS, SSL mode, redirects, basic caching, and domain protection.",
        priceLabel: "From €150",
      },
      {
        id: "spf-dkim-dmarc-setup",
        title: "SPF, DKIM and DMARC setup",
        shortDescription:
          "Improve business email deliverability and reduce spoofing risks.",
        priceLabel: "From €150",
      },
      {
        id: "ssl-certificate-issue-fix",
        title: "SSL certificate issue fix",
        shortDescription:
          "Repair HTTPS, mixed content, redirect loops, and certificate configuration issues.",
        priceLabel: "From €80",
        emergency: true,
      },
      {
        id: "domain-migration-support",
        title: "Domain migration support",
        shortDescription:
          "Move a domain safely between providers or point it to new hosting without breaking email or the website.",
        priceLabel: "From €150",
      },
    ],
  },
  {
    id: "landing-pages-business-websites",
    title: "Landing Pages and Business Websites",
    intro:
      "Clear, conversion-focused pages and websites for campaigns, services, and small businesses.",
    services: [
      {
        id: "one-page-landing-page",
        title: "One-page landing page",
        shortDescription:
          "A focused page for one offer, service, campaign, event, or business idea.",
        priceLabel: "From €300",
        featured: true,
      },
      {
        id: "service-offer-page",
        title: "Service offer page",
        shortDescription:
          "A conversion-focused page that explains one service clearly and drives enquiries.",
        priceLabel: "From €250",
      },
      {
        id: "portfolio-website",
        title: "Portfolio website",
        shortDescription:
          "A polished website for artists, makers, consultants, beauty professionals, and small businesses.",
        priceLabel: "From €400",
      },
      {
        id: "small-business-website-refresh",
        title: "Small business website refresh",
        shortDescription:
          "Improve the structure, copy, layout, responsiveness, and credibility of an existing website.",
        priceLabel: "Fixed quote after scope",
      },
      {
        id: "coming-soon-page",
        title: "Coming soon page",
        shortDescription:
          "A clean launch page with basic information, contact, and lead capture.",
        priceLabel: "From €150",
      },
      {
        id: "mobile-first-homepage-redesign",
        title: "Mobile-first homepage redesign",
        shortDescription:
          "Redesign the homepage around clarity, trust, and mobile usability.",
        priceLabel: "From €300",
      },
    ],
  },
  {
    id: "ecommerce-product-websites",
    title: "E-commerce and Product Websites",
    intro:
      "Product-focused websites, shop prototypes, and checkout improvements for growing businesses.",
    services: [
      {
        id: "small-eshop-frontend-prototype",
        title: "Small e-shop frontend prototype",
        shortDescription:
          "A polished shop prototype with product cards, categories, cart UI, and brand direction.",
        priceLabel: "From €500",
      },
      {
        id: "product-catalog-website",
        title: "Product catalog website",
        shortDescription:
          "A product-focused website for businesses not ready for full checkout.",
        priceLabel: "From €400",
      },
      {
        id: "product-page-improvement",
        title: "Product page improvement",
        shortDescription:
          "Improve product layout, copy, images, calls to action, and trust signals.",
        priceLabel: "From €150",
      },
      {
        id: "checkout-flow-review",
        title: "Checkout flow review",
        shortDescription:
          "Review cart, checkout, payment steps, errors, and friction points.",
        priceLabel: "From €180",
      },
      {
        id: "stripe-checkout-setup",
        title: "Stripe checkout setup",
        shortDescription:
          "Setup or repair basic Stripe checkout flows where technically appropriate.",
        priceLabel: "From €250",
      },
      {
        id: "ecommerce-seo-foundation",
        title: "E-commerce SEO foundation",
        shortDescription:
          "Metadata, category structure, product schema basics, sitemap, and indexation review.",
        priceLabel: "From €250",
      },
    ],
  },
  {
    id: "audits-reports",
    title: "Audits and Reports",
    intro:
      "Structured reviews that identify risks, priorities, and practical next steps.",
    services: [
      {
        id: "technical-audit-video-report",
        title: "Technical audit video/report",
        shortDescription:
          "A practical review of technical issues, UX problems, SEO risks, and next actions.",
        priceLabel: "From €120",
        featured: true,
      },
      {
        id: "website-health-check",
        title: "Website health check",
        shortDescription:
          "A focused inspection of updates, errors, performance, forms, mobile layout, and basic SEO.",
        priceLabel: "From €120",
      },
      {
        id: "ux-ui-review",
        title: "UX/UI review",
        shortDescription:
          "Identify visual, layout, navigation, readability, and conversion problems.",
        priceLabel: "From €150",
      },
      {
        id: "accessibility-quick-audit",
        title: "Accessibility quick audit",
        shortDescription:
          "Review headings, contrast, keyboard flow, form labels, semantics, and common accessibility issues.",
        priceLabel: "From €150",
      },
      {
        id: "pre-launch-checklist",
        title: "Pre-launch checklist",
        shortDescription:
          "Review a website before publishing to catch technical, SEO, mobile, analytics, and content issues.",
        priceLabel: "From €150",
      },
      {
        id: "redesign-risk-audit",
        title: "Redesign risk audit",
        shortDescription:
          "Identify SEO, redirect, content, analytics, and technical risks before a redesign.",
        priceLabel: "From €250",
      },
    ],
  },
  {
    id: "internal-tools-automations",
    title: "Internal Tools and Automations",
    intro:
      "Custom dashboards, workflows, and lightweight tools that reduce manual work.",
    services: [
      {
        id: "client-portal-prototype",
        title: "Client portal prototype",
        shortDescription:
          "A custom dashboard or portal prototype for agencies and service businesses.",
        priceLabel: "Fixed quote after scope",
      },
      {
        id: "internal-dashboard-prototype",
        title: "Internal dashboard prototype",
        shortDescription:
          "A focused dashboard for clients, tasks, projects, leads, renewals, or operations.",
        priceLabel: "Fixed quote after scope",
      },
      {
        id: "form-to-dashboard-workflow",
        title: "Form to dashboard workflow",
        shortDescription:
          "Turn form submissions into a manageable internal workflow.",
        priceLabel: "From €400",
      },
      {
        id: "admin-panel-small-business",
        title: "Admin panel for small business",
        shortDescription:
          "A simple admin area for managing business data, requests, or content.",
        priceLabel: "Fixed quote after scope",
      },
      {
        id: "pdf-generation-workflow",
        title: "PDF generation workflow",
        shortDescription:
          "Generate PDFs for invoices, reports, referrals, confirmations, or internal documents.",
        priceLabel: "From €300",
      },
      {
        id: "email-notification-workflow",
        title: "Email notification workflow",
        shortDescription:
          "Send structured internal or customer emails from forms and business actions.",
        priceLabel: "From €200",
      },
    ],
  },
  {
    id: "maintenance-support",
    title: "Maintenance and Support",
    intro:
      "Ongoing care, backups, monitoring, and reliable support for business websites.",
    services: [
      {
        id: "website-care-plan",
        title: "Website care plan",
        shortDescription:
          "Updates, backups, monitoring, checks, and small support tasks.",
        priceLabel: "From €80/month",
      },
      {
        id: "wordpress-monthly-maintenance",
        title: "WordPress monthly maintenance",
        shortDescription:
          "WordPress core, theme, plugin updates, backups, uptime checks, and small fixes.",
        priceLabel: "From €100/month",
      },
      {
        id: "hosting-migration",
        title: "Hosting migration",
        shortDescription:
          "Move a website to better hosting with minimum downtime.",
        priceLabel: "From €200",
      },
      {
        id: "backup-system-setup",
        title: "Backup system setup",
        shortDescription:
          "Configure reliable website backups and restore process.",
        priceLabel: "From €120",
      },
      {
        id: "website-monitoring-setup",
        title: "Website monitoring setup",
        shortDescription:
          "Uptime and basic health monitoring for business websites.",
        priceLabel: "From €100",
      },
      {
        id: "monthly-technical-support-retainer",
        title: "Monthly technical support retainer",
        shortDescription:
          "Ongoing support for small fixes, advice, updates, and technical changes.",
        priceLabel: "From €150/month",
      },
    ],
  },
  {
    id: "agency-support",
    title: "Agency Support",
    intro:
      "Extra development capacity for agencies that need reliable WordPress or Next.js help.",
    services: [
      {
        id: "overflow-wordpress-development",
        title: "Overflow WordPress development",
        shortDescription:
          "Practical WordPress help for agencies that need extra development capacity.",
        priceLabel: "Fixed quote or day rate",
      },
      {
        id: "overflow-nextjs-development",
        title: "Overflow Next.js development",
        shortDescription:
          "Frontend and full-stack support for modern React and Next.js projects.",
        priceLabel: "Fixed quote or day rate",
      },
      {
        id: "website-qa-before-launch",
        title: "Website QA before launch",
        shortDescription:
          "Responsive, accessibility, SEO, form, performance, and deployment checks.",
        priceLabel: "From €180",
      },
      {
        id: "bug-fixing-sprint",
        title: "Bug fixing sprint",
        shortDescription:
          "A focused block of time to fix bugs before delivery or launch.",
        priceLabel: "Fixed quote after scope",
      },
      {
        id: "frontend-polish-pass",
        title: "Frontend polish pass",
        shortDescription:
          "Improve spacing, responsiveness, visual hierarchy, consistency, and mobile presentation.",
        priceLabel: "From €250",
      },
      {
        id: "seo-migration-support",
        title: "SEO migration support",
        shortDescription:
          "Support agencies during redesigns or platform migrations where rankings matter.",
        priceLabel: "Fixed quote after scope",
      },
    ],
  },
]

export const fastHelpServiceIds = [
  "wordpress-emergency-fix",
  "woocommerce-checkout-fix",
  "email-dns-outlook-fix",
  "website-speed-mini-fix",
  "technical-seo-audit",
  "one-page-landing-page",
] as const

export const featuredServices: ServiceItem[] = serviceCategories.flatMap(
  (category) => category.services.filter((service) => service.featured)
)

export const emergencyServices: ServiceItem[] = serviceCategories.flatMap(
  (category) => category.services.filter((service) => service.emergency)
)

export const getServiceById = (id: string): ServiceItem | undefined => {
  for (const category of serviceCategories) {
    const match = category.services.find((service) => service.id === id)
    if (match) return match
  }
  return undefined
}

export const getFastHelpServices = (): ServiceItem[] =>
  fastHelpServiceIds
    .map((id) => getServiceById(id))
    .filter((service): service is ServiceItem => service !== undefined)

export const requestTypeOptions = [
  { value: "wordpress-emergency", label: "WordPress emergency" },
  { value: "woocommerce-issue", label: "WooCommerce issue" },
  { value: "email-dns-problem", label: "Email/DNS problem" },
  { value: "website-speed", label: "Website speed" },
  { value: "technical-seo", label: "Technical SEO" },
  { value: "landing-page", label: "Landing page" },
  { value: "website-redesign", label: "Website redesign" },
  { value: "maintenance-plan", label: "Maintenance plan" },
  { value: "internal-tool-dashboard", label: "Internal tool/dashboard" },
  { value: "not-sure", label: "Not sure" },
] as const

export const urgencyOptions = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
  { value: "flexible", label: "Flexible" },
] as const

export const budgetOptions = [
  { value: "under-150", label: "Under €150" },
  { value: "150-300", label: "€150 to €300" },
  { value: "300-700", label: "€300 to €700" },
  { value: "700-plus", label: "€700+" },
  { value: "monthly-support", label: "Monthly support" },
  { value: "not-sure", label: "Not sure yet" },
] as const

export type RequestType = (typeof requestTypeOptions)[number]["value"]
export type Urgency = (typeof urgencyOptions)[number]["value"]
export type Budget = (typeof budgetOptions)[number]["value"]

export const mapServiceIdToRequestType = (serviceId: string): RequestType => {
  const mapping: Record<string, RequestType> = {
    "wordpress-emergency-fix": "wordpress-emergency",
    "website-recovery-after-update": "wordpress-emergency",
    "broken-contact-form-fix": "wordpress-emergency",
    "white-screen-critical-error-fix": "wordpress-emergency",
    "plugin-conflict-diagnosis": "wordpress-emergency",
    "website-launch-support": "wordpress-emergency",
    "woocommerce-checkout-fix": "woocommerce-issue",
    "woocommerce-shipping-rules-setup": "woocommerce-issue",
    "woocommerce-payment-method-setup": "woocommerce-issue",
    "woocommerce-custom-checkout-message": "woocommerce-issue",
    "woocommerce-cod-fee-setup": "woocommerce-issue",
    "email-dns-outlook-fix": "email-dns-problem",
    "cloudflare-setup": "email-dns-problem",
    "spf-dkim-dmarc-setup": "email-dns-problem",
    "ssl-certificate-issue-fix": "email-dns-problem",
    "domain-migration-support": "email-dns-problem",
    "website-speed-mini-fix": "website-speed",
    "core-web-vitals-review": "website-speed",
    "image-optimization-pass": "website-speed",
    "technical-seo-audit": "technical-seo",
    "seo-migration-checklist": "technical-seo",
    "301-redirect-map": "technical-seo",
    "search-console-setup": "technical-seo",
    "one-page-landing-page": "landing-page",
    "service-offer-page": "landing-page",
    "coming-soon-page": "landing-page",
    "small-business-website-refresh": "website-redesign",
    "mobile-first-homepage-redesign": "website-redesign",
    "portfolio-website": "website-redesign",
    "website-care-plan": "maintenance-plan",
    "wordpress-monthly-maintenance": "maintenance-plan",
    "monthly-technical-support-retainer": "maintenance-plan",
    "client-portal-prototype": "internal-tool-dashboard",
    "internal-dashboard-prototype": "internal-tool-dashboard",
    "form-to-dashboard-workflow": "internal-tool-dashboard",
    "admin-panel-small-business": "internal-tool-dashboard",
  }
  return mapping[serviceId] ?? "not-sure"
}
