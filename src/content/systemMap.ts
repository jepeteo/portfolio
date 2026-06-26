export type SystemMapNode = {
  id: string
  label: string
  details: string[]
}

export const systemMapCenter = {
  id: "center",
  label: "Theodoros Mentis",
}

export const systemMapNodes: SystemMapNode[] = [
  {
    id: "wordpress",
    label: "WordPress",
    details: [
      "Plugin conflicts and fatal errors",
      "Theme bugs and admin issues",
      "Custom features and migrations",
    ],
  },
  {
    id: "woocommerce",
    label: "WooCommerce",
    details: [
      "Checkout and payment flow issues",
      "Product imports and catalog bugs",
      "Shipping rules and order problems",
    ],
  },
  {
    id: "react",
    label: "React",
    details: [
      "Modern UI components and routing",
      "State management and frontend apps",
      "Performance-aware interfaces",
    ],
  },
  {
    id: "php",
    label: "PHP / MySQL",
    details: [
      "Backend logic and database queries",
      "Custom integrations and APIs",
      "Safe production debugging",
    ],
  },
  {
    id: "hosting",
    label: "Hosting",
    details: [
      "cPanel, WHM, Plesk environments",
      "Apache and Nginx configuration",
      "Backups and PHP version issues",
    ],
  },
  {
    id: "dns",
    label: "DNS / Email",
    details: [
      "SPF, DKIM, DMARC setup",
      "Outlook and deliverability fixes",
      "Cloudflare, SSL, and DNS records",
    ],
  },
  {
    id: "seo",
    label: "Technical SEO",
    details: [
      "Schema, redirects, and sitemaps",
      "Migration ranking risks",
      "Metadata and crawl issues",
    ],
  },
  {
    id: "performance",
    label: "Performance",
    details: [
      "Core Web Vitals improvements",
      "Image loading and caching",
      "Frontend weight reduction",
    ],
  },
  {
    id: "security",
    label: "Security / Stability",
    details: [
      "Safer changes in production",
      "Access and risk awareness",
      "Stability after fixes",
    ],
  },
]

/** Evenly space nodes on a circle (viewBox 0–100). */
export const getSystemMapPosition = (
  index: number,
  total: number,
  radius = 36
) => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  }
}
