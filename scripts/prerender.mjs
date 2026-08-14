// Lightweight static prerender for known SPA routes.
//
// After `vite build`, overwrites dist/index.html for "/" and writes per-route
// index.html files with route-specific metadata, JSON-LD, and crawlable body HTML.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  routeMeta,
  prerenderRoutes,
  absoluteUrl,
  OG_IMAGE,
  TWITTER_SITE,
  buildRouteJsonLd,
} from "../src/config/routeMeta.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, "..", "dist")
const templatePath = path.join(distDir, "index.html")

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function replaceTitle(html, title) {
  return html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeText(title)}</title>`
  )
}

function replaceMetaName(html, name, content) {
  const re = new RegExp(`<meta\\s+name="${name}"[\\s\\S]*?/>`)
  const tag = `<meta name="${name}" content="${escapeAttr(content)}" />`
  return re.test(html) ? html.replace(re, tag) : html
}

function replaceMetaProperty(html, property, content) {
  const re = new RegExp(`<meta\\s+property="${property}"[\\s\\S]*?/>`)
  const tag = `<meta property="${property}" content="${escapeAttr(content)}" />`
  return re.test(html) ? html.replace(re, tag) : html
}

function replaceCanonical(html, href) {
  const re = /<link\s+rel="canonical"[\s\S]*?\/>/
  const tag = `<link rel="canonical" href="${escapeAttr(href)}" />`
  return re.test(html) ? html.replace(re, tag) : html
}

function injectJsonLd(html, graph) {
  const script = `    <script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n    </script>`
  const existing = /<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/
  if (existing.test(html)) {
    return html.replace(existing, `${script}\n`)
  }
  return html.replace(/<\/head>/, `${script}\n  </head>`)
}

function injectCrawlableBody(html, crawlableHtml) {
  if (!crawlableHtml) return html
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${crawlableHtml}</div>`
  )
}

function buildRouteHtml(template, route) {
  const meta = routeMeta[route]
  const canonical = absoluteUrl(meta.canonicalPath)
  const ogImage = meta.ogImage || OG_IMAGE
  let html = template
  html = replaceTitle(html, meta.title)
  html = replaceMetaName(html, "description", meta.description)
  html = replaceCanonical(html, canonical)
  html = replaceMetaProperty(html, "og:title", meta.title)
  html = replaceMetaProperty(html, "og:description", meta.description)
  html = replaceMetaProperty(html, "og:url", canonical)
  html = replaceMetaProperty(html, "og:type", meta.ogType)
  html = replaceMetaProperty(html, "og:image", ogImage)
  html = replaceMetaName(html, "twitter:title", meta.title)
  html = replaceMetaName(html, "twitter:description", meta.description)
  html = replaceMetaName(html, "twitter:image", ogImage)
  html = replaceMetaName(html, "twitter:site", TWITTER_SITE)
  html = injectJsonLd(html, buildRouteJsonLd(route))
  html = injectCrawlableBody(html, meta.crawlableHtml)
  return html
}

function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(
      `prerender: dist/index.html not found at ${templatePath}. Run \`vite build\` first.`
    )
    process.exit(1)
  }

  const template = fs.readFileSync(templatePath, "utf8")
  const written = []

  for (const route of prerenderRoutes) {
    const meta = routeMeta[route]
    if (!meta) {
      console.error(`prerender: no routeMeta entry for "${route}"`)
      process.exit(1)
    }

    const html = buildRouteHtml(template, route)

    if (route === "/") {
      fs.writeFileSync(templatePath, html, "utf8")
      written.push("index.html")
      continue
    }

    const outDir = path.join(distDir, route.replace(/^\//, ""))
    fs.mkdirSync(outDir, { recursive: true })
    const outFile = path.join(outDir, "index.html")
    fs.writeFileSync(outFile, html, "utf8")
    written.push(path.relative(distDir, outFile))
  }

  console.log("✅ Prerendered routes:")
  written.forEach((file) => console.log(` - dist/${file}`))
}

main()
