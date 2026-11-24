/**
 * Collect public archive project slugs/titles for prerender shells.
 * Mirrors wordpressProjects / webProjects / reactShowcaseProjects ID rules.
 */
import myProjects from "../src/assets/myProjects.json" with { type: "json" }
import clientProjects from "../src/assets/clientProjects.json" with { type: "json" }
import personalProjects from "../src/assets/personalProjects.json" with { type: "json" }
import myReactProjects from "../src/assets/myReactProjects.json" with { type: "json" }

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const WORDPRESS_SOURCE = "src/assets/myProjects.json"
const CLIENT_SOURCE = "src/assets/clientProjects.json"
const PERSONAL_SOURCE = "src/assets/personalProjects.json"
const REACT_SOURCE = "src/assets/myReactProjects.json"
const CASE_STUDY_SOURCE = "src/content/caseStudies.ts"

// Same gate as isValidProject() in src/utils/validation.ts. A weaker check
// would shift `project-${index}-…` slugs away from the links the app renders.
const isValidWordPress = (project) =>
  project &&
  typeof project.prName === "string" &&
  typeof project.prType === "string" &&
  typeof project.prFeatured === "boolean" &&
  typeof project.prUrl === "string" &&
  typeof project.prDescription === "string" &&
  typeof project.prImageSlug === "string"

/**
 * @param {Map<string, { slug: string, title: string, description: string, sources: string[] }>} bySlug
 * @param {string} slug
 * @param {{ title: string, description: string }} data
 * @param {string} source
 */
function upsert(bySlug, slug, data, source) {
  const current = bySlug.get(slug)
  if (!current) {
    bySlug.set(slug, {
      slug,
      title: data.title,
      description: data.description,
      sources: [source],
    })
    return
  }

  current.title = data.title
  current.description = data.description
  if (!current.sources.includes(source)) current.sources.push(source)
}

/**
 * Public /projects/:slug pages, in the same slug order the archive links use.
 * `sources` lists the content files that define the page, for sitemap lastmod.
 *
 * @returns {{ slug: string, title: string, description: string, sources: string[] }[]}
 */
export function listPublicProjectPages() {
  /** @type {Map<string, { slug: string, title: string, description: string, sources: string[] }>} */
  const bySlug = new Map()

  myProjects.filter(isValidWordPress).forEach((project, index) => {
    const slug = `project-${index}-${slugify(project.prName)}`
    upsert(
      bySlug,
      slug,
      {
        title: project.prName,
        description: String(project.prDescription).slice(0, 160),
      },
      WORDPRESS_SOURCE
    )
  })

  for (const project of clientProjects) {
    if (!project?.id) continue
    upsert(
      bySlug,
      project.id,
      {
        title: project.title || project.id,
        description: String(
          project.description || project.title || project.id
        ).slice(0, 160),
      },
      CLIENT_SOURCE
    )
  }

  for (const project of personalProjects) {
    if (!project?.id) continue
    upsert(
      bySlug,
      project.id,
      {
        title: project.title || project.id,
        description: String(
          project.description || project.title || project.id
        ).slice(0, 160),
      },
      PERSONAL_SOURCE
    )
  }

  for (const project of myReactProjects) {
    if (!project?.id || !project.title || !project.description) continue
    upsert(
      bySlug,
      project.id,
      {
        title: project.title,
        description: String(project.description).slice(0, 160),
      },
      REACT_SOURCE
    )
  }

  upsert(
    bySlug,
    "mtx-clinic-app",
    {
      title: "MTX Clinic App",
      description:
        "Private Next.js clinic operations app for appointments, records and staff workflows.",
    },
    CASE_STUDY_SOURCE
  )
  upsert(
    bySlug,
    "stoney-holiday-lets",
    {
      title: "Stoney Holiday Lets",
      description:
        "WordPress holiday-let website for The Lodge and The Nook, with booking-focused structure.",
    },
    CASE_STUDY_SOURCE
  )

  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug))
}
