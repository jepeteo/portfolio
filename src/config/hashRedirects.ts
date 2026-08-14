import { mapLegacyProjectTab } from "../content/projectFilters"

export const hashRedirects: Record<string, string> = {
  projects: "/projects",
  certificates: "/certifications",
  experience: "/experience",
  skills: "/engineering",
  about: "/about",
  contact: "/contact",
  faq: "/about#faq",
}

export const resolveHashRedirect = (
  pathname: string,
  hash: string,
  search = ""
) => {
  if (pathname !== "/") return null
  const raw = hash.replace(/^#/, "")
  const queryIndex = raw.indexOf("?")
  const key = (queryIndex === -1 ? raw : raw.slice(0, queryIndex)).split("&")[0]
  const hashQuery = queryIndex === -1 ? "" : raw.slice(queryIndex + 1)
  if (!key || key === "top") return null
  const target = hashRedirects[key]
  if (!target) return null
  if (target.includes("#")) return target

  if (key === "projects") {
    const hashParams = new URLSearchParams(hashQuery || "")
    const searchParams = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
    const tab = hashParams.get("tab") || searchParams.get("tab")
    const mapped = mapLegacyProjectTab(tab)
    if (mapped) return `/projects?${mapped}`
  }

  return `${target}${search}`
}
