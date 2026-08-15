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

const isValidWordPress = (project) =>
  project &&
  typeof project.prName === "string" &&
  typeof project.prDescription === "string" &&
  typeof project.prImageSlug === "string"

/**
 * @returns {{ slug: string, title: string, description: string }[]}
 */
export function listPublicProjectPages() {
  /** @type {Map<string, { slug: string, title: string, description: string }>} */
  const bySlug = new Map()

  myProjects.filter(isValidWordPress).forEach((project, index) => {
    const slug = `project-${index}-${slugify(project.prName)}`
    bySlug.set(slug, {
      slug,
      title: project.prName,
      description: String(project.prDescription).slice(0, 160),
    })
  })

  for (const project of [...clientProjects, ...personalProjects]) {
    if (!project?.id) continue
    bySlug.set(project.id, {
      slug: project.id,
      title: project.title || project.id,
      description: String(project.description || project.title || project.id).slice(
        0,
        160
      ),
    })
  }

  for (const project of myReactProjects) {
    if (!project?.id || !project.title || !project.description) continue
    bySlug.set(project.id, {
      slug: project.id,
      title: project.title,
      description: String(project.description).slice(0, 160),
    })
  }

  bySlug.set("mtx-clinic-app", {
    slug: "mtx-clinic-app",
    title: "MTX Clinic App",
    description:
      "Private Next.js clinic operations app for appointments, records and staff workflows.",
  })
  bySlug.set("stoney-holiday-lets", {
    slug: "stoney-holiday-lets",
    title: "Stoney Holiday Lets",
    description:
      "WordPress holiday-let website for The Lodge and The Nook, with booking-focused structure.",
  })

  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug))
}
