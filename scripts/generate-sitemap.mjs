// Generates sitemap.xml from the public route table and the project archive.
//
// Run before `vite build`. Vite copies public/ into dist/ at the start of the
// build, so a sitemap written afterwards never ships. lastmod comes from the
// git date of the files that define each URL. On a shallow CI checkout that
// cannot see that commit, an existing lastmod is kept instead of stamping
// every URL with the deploy date.

import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { SITE_URL, routeMeta } from "../src/config/routeMeta.js"
import { listPublicProjectPages } from "./listPublicProjectPages.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const publicFile = path.join(root, "public", "sitemap.xml")
const distFile = path.join(root, "dist", "sitemap.xml")

const EXCLUDED_PATHS = new Set(["/projects/technical-rescue"])

const STATIC_SOURCES = {
  "/": [
    "src/pages/HomePage.tsx",
    "src/components/sections/CertificationsPreview.tsx",
    "src/assets/myCertificates.json",
  ],
  "/about": ["src/pages/AboutPage.tsx", "src/components/sections/Bio.tsx"],
  "/certifications": [
    "src/pages/CertificationsPage.tsx",
    "src/assets/myCertificates.json",
  ],
  "/contact": [
    "src/pages/ContactPage.tsx",
    "src/components/sections/Contact.tsx",
  ],
  "/engineering": [
    "src/pages/EngineeringPage.tsx",
    "src/content/engineeringCatalog.ts",
    "src/assets/myCertificates.json",
  ],
  "/experience": ["src/pages/ExperiencePage.tsx"],
  "/privacy": ["src/pages/PrivacyPage.tsx"],
  "/projects": [
    "src/pages/ProjectsPage.tsx",
    "src/assets/myProjects.json",
    "src/assets/clientProjects.json",
    "src/assets/personalProjects.json",
    "src/assets/myReactProjects.json",
  ],
  "/services": ["src/pages/ServicesPage.tsx", "src/content/services.ts"],
  "/services/email-dns-outlook-fix": ["src/content/serviceLandings.ts"],
  "/services/emergency-website-help": ["src/pages/EmergencyHelpPage.tsx"],
  "/services/technical-seo-audit": ["src/content/serviceLandings.ts"],
  "/services/woocommerce-checkout-fix": ["src/content/serviceLandings.ts"],
  "/projects/mtx-clinic-app": ["src/content/caseStudies.ts"],
  "/projects/stoney-holiday-lets": ["src/content/caseStudies.ts"],
}

const priorityFor = (pathname) => {
  if (pathname === "/") return "1.0"
  if (pathname === "/services") return "0.9"
  if (pathname.startsWith("/services/emergency")) return "0.85"
  if (pathname.startsWith("/services/")) return "0.8"
  if (pathname === "/privacy") return "0.4"
  if (pathname.startsWith("/projects/")) return "0.6"
  return "0.7"
}

const changefreqFor = (pathname) => {
  if (pathname === "/") return "weekly"
  if (pathname === "/privacy") return "yearly"
  return "monthly"
}

const today = new Date().toISOString().slice(0, 10)
const dateCache = new Map()

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function readPreviousLastmods(file) {
  const previous = new Map()
  if (!fs.existsSync(file)) return previous
  const xml = fs.readFileSync(file, "utf8")
  for (const block of xml.split("<url>").slice(1)) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim()
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim()
    if (loc && isDate(lastmod)) previous.set(loc, lastmod)
  }
  return previous
}

function sourceDate(relativePath) {
  if (dateCache.has(relativePath)) return dateCache.get(relativePath)
  const absolute = path.join(root, relativePath)
  let date = null

  if (fs.existsSync(absolute)) {
    try {
      const dirty = execFileSync(
        "git",
        ["status", "--porcelain", "--", relativePath],
        { cwd: root, encoding: "utf8" }
      ).trim()
      if (dirty) {
        date = today
      } else {
        const logged = execFileSync(
          "git",
          ["log", "-1", "--format=%cs", "--", relativePath],
          { cwd: root, encoding: "utf8" }
        ).trim()
        if (isDate(logged)) date = logged
      }
    } catch {
      date = null
    }
  }

  dateCache.set(relativePath, date)
  return date
}

function latestDate(files, fallback) {
  const dates = files
    .filter((file) => fs.existsSync(path.join(root, file)))
    .map(sourceDate)
    .filter(isDate)
    .sort()
  if (dates.length > 0) return dates[dates.length - 1]
  if (isDate(fallback)) return fallback
  return today
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function locFor(pathname) {
  return pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${pathname}`
}

const previous = readPreviousLastmods(publicFile)
/** @type {Map<string, { path: string, lastmod: string, changefreq: string, priority: string }>} */
const entries = new Map()

for (const pathname of Object.keys(routeMeta)) {
  if (EXCLUDED_PATHS.has(pathname)) continue
  const sources = STATIC_SOURCES[pathname] ?? ["src/config/routeMeta.js"]
  entries.set(pathname, {
    path: pathname,
    lastmod: latestDate(sources, previous.get(locFor(pathname))),
    changefreq: changefreqFor(pathname),
    priority: priorityFor(pathname),
  })
}

for (const project of listPublicProjectPages()) {
  const pathname = `/projects/${project.slug}`
  if (EXCLUDED_PATHS.has(pathname)) continue
  const sources = [
    ...(STATIC_SOURCES[pathname] ?? []),
    ...(project.sources ?? []),
  ]
  const existing = entries.get(pathname)
  const lastmod = latestDate(sources, previous.get(locFor(pathname)))
  if (existing) {
    existing.lastmod = lastmod > existing.lastmod ? lastmod : existing.lastmod
    continue
  }
  entries.set(pathname, {
    path: pathname,
    lastmod,
    changefreq: "monthly",
    priority: "0.6",
  })
}

const urls = [...entries.values()]
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(locFor(entry.path))}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`

fs.writeFileSync(publicFile, xml, "utf8")
if (fs.existsSync(path.join(root, "dist"))) {
  fs.writeFileSync(distFile, xml, "utf8")
}

const lastmods = new Set([...entries.values()].map((entry) => entry.lastmod))
console.log(
  `✅ Generated sitemap with ${urls.length} URLs (${lastmods.size} distinct lastmod values) → public/sitemap.xml`
)
