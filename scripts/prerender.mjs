// Lightweight static prerender for known SPA routes + real HTTP 404 page.
//
// After `vite build`, writes per-route index.html files and dist/404.html.
// Valid archive project slugs also get shells so Vercel can drop the SPA
// catch-all rewrite and return a genuine 404 for unknown URLs.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  routeMeta,
  prerenderRoutes,
  absoluteUrl,
  OG_IMAGE,
  TWITTER_SITE,
  SITE_URL,
  SITE_NAME,
  buildRouteJsonLd,
  buildProjectPageJsonLd,
} from "../src/config/routeMeta.js"
import { listPublicProjectPages } from "./listPublicProjectPages.mjs"

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
  // Keep crawlable LCP content OUTSIDE #root so createRoot does not destroy the
  // heading node on mount. React adopts the same <h1> via useAdoptedLcpHeading.
  return html.replace(
    /<div id="root">[\s\S]*?<\/div>(\s*)<\/body>/,
    `${crawlableHtml}\n    <div id="root"></div>$1</body>`
  )
}

function applyPageMeta(html, {
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = OG_IMAGE,
  robots = "index, follow",
  crawlableHtml,
  jsonLd,
}) {
  let next = html
  next = replaceTitle(next, title)
  next = replaceMetaName(next, "description", description)
  next = replaceMetaName(next, "robots", robots)
  next = replaceCanonical(next, canonical)
  next = replaceMetaProperty(next, "og:title", title)
  next = replaceMetaProperty(next, "og:description", description)
  next = replaceMetaProperty(next, "og:url", canonical)
  next = replaceMetaProperty(next, "og:type", ogType)
  next = replaceMetaProperty(next, "og:image", ogImage)
  next = replaceMetaName(next, "twitter:title", title)
  next = replaceMetaName(next, "twitter:description", description)
  next = replaceMetaName(next, "twitter:image", ogImage)
  next = replaceMetaName(next, "twitter:site", TWITTER_SITE)
  if (jsonLd) next = injectJsonLd(next, jsonLd)
  next = injectCrawlableBody(next, crawlableHtml)
  return next
}

function buildRouteHtml(template, route) {
  const meta = routeMeta[route]
  const canonical = absoluteUrl(meta.canonicalPath)
  return applyPageMeta(template, {
    title: meta.title,
    description: meta.description,
    canonical,
    ogType: meta.ogType,
    ogImage: meta.ogImage || OG_IMAGE,
    robots: "index, follow",
    crawlableHtml: meta.crawlableHtml,
    jsonLd: buildRouteJsonLd(route),
  })
}

function buildArchiveProjectHtml(template, project) {
  const pathName = `/projects/${project.slug}`
  if (routeMeta[pathName]) {
    return buildRouteHtml(template, pathName)
  }

  const title = `${project.title} | ${SITE_NAME}`
  const description =
    project.description?.trim() ||
    `${project.title} is listed in Theodoros Mentis's public project archive.`
  const canonical = `${SITE_URL}${pathName}`
  const crawlableHtml = `<article id="static-crawl-fallback"><h1>${escapeText(project.title)}</h1><p>${escapeText(description)}</p></article>`

  return applyPageMeta(template, {
    title,
    description: description.slice(0, 160),
    canonical,
    ogType: "article",
    crawlableHtml,
    jsonLd: buildProjectPageJsonLd({
      name: project.title,
      description: description.slice(0, 160),
      path: pathName,
    }),
  })
}

function buildNotFoundHtml(template) {
  const title = `Page not found | ${SITE_NAME}`
  const description = "The page you requested is not in this portfolio."
  const canonical = `${SITE_URL}/404`
  const crawlableHtml = `<article id="static-crawl-fallback"><h1>This page is not here.</h1><p>${escapeText(description)}</p><nav aria-label="Primary links"><a href="/">Home</a><a href="/services">Services</a><a href="/contact">Contact</a></nav></article>`

  return applyPageMeta(template, {
    title,
    description,
    canonical,
    ogType: "website",
    robots: "noindex,follow",
    crawlableHtml,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonical,
    },
  })
}

function writeHtml(relativePath, html) {
  const outFile = path.join(distDir, relativePath)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, html, "utf8")
  return path.relative(distDir, outFile)
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

    written.push(
      writeHtml(path.join(route.replace(/^\//, ""), "index.html"), html)
    )
  }

  const projects = listPublicProjectPages()
  for (const project of projects) {
    const routePath = `/projects/${project.slug}`
    if (routeMeta[routePath]) continue
    const html = buildArchiveProjectHtml(template, project)
    written.push(
      writeHtml(path.join("projects", project.slug, "index.html"), html)
    )
  }

  written.push(writeHtml("404.html", buildNotFoundHtml(template)))

  console.log("✅ Prerendered routes:")
  written.forEach((file) => console.log(` - dist/${file}`))
  console.log(`✅ Archive project shells: ${projects.length}`)
  console.log("✅ Wrote dist/404.html (noindex,follow)")
}

main()
