// Validates SEO build artifacts: sitemap.xml, robots.txt, and (when present)
// the prerendered route HTML in dist/. Fails the build on inconsistencies.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  SITE_URL,
  routeMeta,
  prerenderRoutes,
  absoluteUrl,
} from "../src/config/routeMeta.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const errors = []

const requiredSitemapUrls = [
  `${SITE_URL}/`,
  `${SITE_URL}/services`,
  `${SITE_URL}/services/emergency-website-help`,
]

function validateSitemap() {
  const file = path.join(root, "public", "sitemap.xml")
  const xml = fs.readFileSync(file, "utf8")

  // Basic well-formedness: balanced core tags.
  const pairs = [
    ["<urlset", "</urlset>"],
    ["<url>", "</url>"],
    ["<loc>", "</loc>"],
  ]
  for (const [open, close] of pairs) {
    const opens = (xml.match(new RegExp(open.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length
    const closes = (xml.match(new RegExp(close.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length
    if (opens !== closes) {
      errors.push(`sitemap.xml: unbalanced ${open} (${opens}) vs ${close} (${closes})`)
    }
  }

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())

  for (const loc of locs) {
    if (loc.includes("#")) errors.push(`sitemap.xml: hash fragment URL not allowed: ${loc}`)
    if (!loc.startsWith(SITE_URL)) errors.push(`sitemap.xml: URL does not use canonical host: ${loc}`)
  }

  for (const required of requiredSitemapUrls) {
    if (!locs.includes(required)) errors.push(`sitemap.xml: missing required URL: ${required}`)
  }
}

function validateRobots() {
  const file = path.join(root, "public", "robots.txt")
  const txt = fs.readFileSync(file, "utf8")
  const expected = `Sitemap: ${SITE_URL}/sitemap.xml`
  if (!txt.includes(expected)) {
    errors.push(`robots.txt: missing or incorrect sitemap line (expected "${expected}")`)
  }
  if (!/^User-agent:\s*\*/m.test(txt)) {
    errors.push("robots.txt: missing User-agent: * directive")
  }
}

function validatePrerender() {
  const distDir = path.join(root, "dist")
  if (!fs.existsSync(distDir)) {
    console.log("validate-seo: dist/ not found, skipping prerender checks (run after build)")
    return
  }

  for (const route of prerenderRoutes) {
    const meta = routeMeta[route]
    const file = path.join(distDir, route.replace(/^\//, ""), "index.html")
    if (!fs.existsSync(file)) {
      errors.push(`prerender: expected file missing: ${path.relative(root, file)}`)
      continue
    }
    const html = fs.readFileSync(file, "utf8")
    const canonical = absoluteUrl(meta.canonicalPath)
    if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
      errors.push(`prerender: ${route} missing canonical ${canonical}`)
    }
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/)
    const expectedTitle = meta.title.replace(/&/g, "&amp;")
    if (!titleMatch || titleMatch[1].trim() !== expectedTitle) {
      errors.push(`prerender: ${route} title mismatch (got "${titleMatch ? titleMatch[1].trim() : "none"}")`)
    }
    if (!html.includes('"@type": "BreadcrumbList"')) {
      errors.push(`prerender: ${route} missing BreadcrumbList JSON-LD`)
    }
  }
}

validateSitemap()
validateRobots()
validatePrerender()

if (errors.length > 0) {
  console.error("❌ SEO validation failed:\n")
  errors.forEach((e) => console.error(` - ${e}`))
  process.exit(1)
}

console.log("✅ SEO validation passed (sitemap, robots, prerender).")
