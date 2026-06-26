// Generates public/sitemap.xml from routeMeta at build time.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { SITE_URL, routeMeta } from "../src/config/routeMeta.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const outFile = path.join(root, "public", "sitemap.xml")

const lastmod = new Date().toISOString().slice(0, 10)

const priorityFor = (path) => {
  if (path === "/") return "1.0"
  if (path === "/services") return "0.9"
  if (path.startsWith("/services/emergency")) return "0.85"
  if (path.startsWith("/services/")) return "0.8"
  return "0.7"
}

const changefreqFor = (path) => (path === "/" ? "weekly" : "monthly")

const urls = Object.keys(routeMeta)
  .sort((a, b) => a.localeCompare(b))
  .map((canonicalPath) => {
    const loc =
      canonicalPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${canonicalPath}`
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreqFor(canonicalPath)}</changefreq>
    <priority>${priorityFor(canonicalPath)}</priority>
  </url>`
  })

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`

fs.writeFileSync(outFile, xml, "utf8")
console.log(`✅ Generated sitemap with ${urls.length} URLs → public/sitemap.xml`)
