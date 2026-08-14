// Validates SEO build artifacts: sitemap.xml, robots.txt, and prerendered HTML.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  SITE_URL,
  OG_IMAGE,
  routeMeta,
  prerenderRoutes,
  absoluteUrl,
} from "../src/config/routeMeta.js"
import { homeFaq } from "../src/content/homeFaq.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const errors = []

function validateSitemap() {
  const file = path.join(root, "public", "sitemap.xml")
  const xml = fs.readFileSync(file, "utf8")

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())

  for (const loc of locs) {
    if (loc.includes("#")) errors.push(`sitemap.xml: hash fragment URL not allowed: ${loc}`)
    if (!loc.startsWith(SITE_URL)) {
      errors.push(`sitemap.xml: URL does not use canonical host: ${loc}`)
    }
  }

  for (const route of prerenderRoutes) {
    const expected =
      route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`
    if (!locs.includes(expected)) {
      errors.push(`sitemap.xml: missing required URL: ${expected}`)
    }
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

function validateRouteMeta() {
  for (const route of prerenderRoutes) {
    const meta = routeMeta[route]
    if (!meta) {
      errors.push(`routeMeta: missing entry for prerender route ${route}`)
      continue
    }
    if (meta.description.length > 160) {
      errors.push(
        `routeMeta: ${route} description too long (${meta.description.length} chars)`
      )
    }
  }
}

function validateIndexHtmlBaseline() {
  const file = path.join(root, "index.html")
  const html = fs.readFileSync(file, "utf8")
  if (!html.includes(OG_IMAGE)) {
    errors.push(`index.html: og:image does not reference OG_IMAGE (${OG_IMAGE})`)
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
    const file =
      route === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, route.replace(/^\//, ""), "index.html")

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
      errors.push(
        `prerender: ${route} title mismatch (got "${titleMatch ? titleMatch[1].trim() : "none"}")`
      )
    }

    const jsonLdCount = (html.match(/type="application\/ld\+json"/g) || []).length
    if (jsonLdCount !== 1) {
      errors.push(
        `prerender: ${route} expected 1 JSON-LD script in head, found ${jsonLdCount}`
      )
    }

    if (!html.includes(`<meta name="description"`)) {
      errors.push(`prerender: ${route} missing description meta`)
    }

    if (!html.includes(`property="og:title"`) || !html.includes(`property="og:image"`)) {
      errors.push(`prerender: ${route} missing Open Graph title or image`)
    }

    if (meta.crawlableHtml && !html.includes("<h1>")) {
      errors.push(`prerender: ${route} missing crawlable h1`)
    }

    if (route === "/") {
      if (!html.includes('id="static-crawl-fallback"')) {
        errors.push("prerender: home missing static-crawl-fallback article")
      }
      if (!html.includes("<h1>")) {
        errors.push("prerender: home missing crawlable h1")
      }
      if (html.includes('"@type": "FAQPage"')) {
        errors.push("prerender: home should not include FAQPage JSON-LD")
      }
      if (!html.includes('"@type": "WebSite"')) {
        errors.push("prerender: home missing WebSite JSON-LD")
      }
      if (!html.includes('"@type": "Person"')) {
        errors.push("prerender: home missing Person JSON-LD")
      }
      if (!html.includes('"@type": "ProfessionalService"')) {
        errors.push("prerender: home missing ProfessionalService JSON-LD")
      }
    }

    if (route === "/projects" && !html.includes('"@type": "ItemList"')) {
      errors.push("prerender: /projects missing ItemList JSON-LD")
    }

    if (route === "/projects/mtx-clinic-app") {
      if (!html.includes('"@type": "SoftwareApplication"')) {
        errors.push("prerender: MTX missing SoftwareApplication JSON-LD")
      }
      if (!html.includes("Private Next.js clinic operations application")) {
        errors.push("prerender: MTX missing authored description")
      }
      if (!html.includes(OG_IMAGE)) {
        errors.push("prerender: MTX should keep generic social-card OG image")
      }
    }

    if (route === "/projects/stoney-holiday-lets") {
      if (!html.includes('"@type": "CreativeWork"')) {
        errors.push("prerender: Stoney missing CreativeWork JSON-LD")
      }
      if (!html.includes("WordPress holiday-let website for The Lodge and The Nook")) {
        errors.push("prerender: Stoney missing authored description")
      }
      if (!html.includes("/images/projects/stoneyholidaylets.webp")) {
        errors.push("prerender: Stoney missing project OG image")
      }
    }

    if (route === "/contact" && !html.includes('"@type": "ContactPage"')) {
      errors.push("prerender: /contact missing ContactPage JSON-LD")
    }

    if (route === "/about") {
      for (const item of homeFaq) {
        if (!html.includes(item.question)) {
          errors.push(`prerender: about FAQ schema/HTML missing question: ${item.question}`)
        }
      }
      if (!html.includes('"@type": "FAQPage"')) {
        errors.push("prerender: about missing FAQPage JSON-LD")
      }
    }

    if (route.startsWith("/services") && route !== "/services") {
      if (!html.includes('"@type": "BreadcrumbList"')) {
        errors.push(`prerender: ${route} missing BreadcrumbList JSON-LD`)
      }
    }
  }
}

validateRouteMeta()
validateIndexHtmlBaseline()
validateSitemap()
validateRobots()
validatePrerender()

if (errors.length > 0) {
  console.error("❌ SEO validation failed:\n")
  errors.forEach((e) => console.error(` - ${e}`))
  process.exit(1)
}

console.log("✅ SEO validation passed (sitemap, robots, prerender).")
