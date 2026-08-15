import type {
  NormalizedProject,
  ProjectDomain,
  ProjectOwnership,
  ProjectSource,
  ProjectWorkType,
} from "./projectTaxonomy"

export const PROJECT_PAGE_SIZES = [12, 24] as const
export const DEFAULT_PROJECT_PAGE_SIZE = 12

export type ProjectSort = "featured" | "title" | "source"
export type ProjectPageSize = (typeof PROJECT_PAGE_SIZES)[number]

export type ProjectQuery = {
  q: string
  ownership: string
  domain: string
  workType: string
  source: string
  engineering: boolean | null
  sort: ProjectSort
  page: number
  pageSize: ProjectPageSize
}

export const defaultProjectQuery: ProjectQuery = {
  q: "",
  ownership: "",
  domain: "",
  workType: "",
  source: "",
  engineering: null,
  sort: "featured",
  page: 1,
  pageSize: DEFAULT_PROJECT_PAGE_SIZE,
}

const SORTS: ProjectSort[] = ["featured", "title", "source"]
const isPageSize = (value: number): value is ProjectPageSize =>
  PROJECT_PAGE_SIZES.includes(value as ProjectPageSize)
const isSort = (value: string): value is ProjectSort =>
  SORTS.includes(value as ProjectSort)

export const mapLegacyProjectTab = (tab: string | null) => {
  if (tab === "wordpress") return "source=wordpress"
  if (tab === "client") return "ownership=client"
  if (tab === "personal") return "ownership=personal"
  return ""
}

export const parseProjectQuery = (search: string): ProjectQuery => {
  const params = new URLSearchParams(search)
  const rawSize = Number(params.get("pageSize") || DEFAULT_PROJECT_PAGE_SIZE)
  const rawPage = Number(params.get("page") || 1)
  const sort = params.get("sort") || "featured"
  const engineering = params.get("engineering")

  return {
    q: (params.get("q") || "").trim(),
    ownership: params.get("ownership") || "",
    domain: params.get("domain") || "",
    workType: params.get("workType") || "",
    source: params.get("source") || "",
    engineering:
      engineering === "1" ? true : engineering === "0" ? false : null,
    sort: isSort(sort) ? sort : "featured",
    page: Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1,
    pageSize: isPageSize(rawSize) ? rawSize : DEFAULT_PROJECT_PAGE_SIZE,
  }
}

export const serializeProjectQuery = (
  query: ProjectQuery,
  omit: Array<keyof ProjectQuery> = []
) => {
  const params = new URLSearchParams()
  if (query.q && !omit.includes("q")) params.set("q", query.q)
  if (query.ownership && !omit.includes("ownership")) {
    params.set("ownership", query.ownership)
  }
  if (query.domain && !omit.includes("domain")) params.set("domain", query.domain)
  if (query.workType && !omit.includes("workType")) {
    params.set("workType", query.workType)
  }
  if (query.source && !omit.includes("source")) params.set("source", query.source)
  if (query.engineering === true && !omit.includes("engineering")) {
    params.set("engineering", "1")
  }
  if (query.engineering === false && !omit.includes("engineering")) {
    params.set("engineering", "0")
  }
  if (query.sort !== defaultProjectQuery.sort && !omit.includes("sort")) {
    params.set("sort", query.sort)
  }
  if (query.page > 1 && !omit.includes("page")) params.set("page", String(query.page))
  if (
    query.pageSize !== DEFAULT_PROJECT_PAGE_SIZE &&
    !omit.includes("pageSize")
  ) {
    params.set("pageSize", String(query.pageSize))
  }
  return params.toString()
}

const matchesQuery = (project: NormalizedProject, query: ProjectQuery) => {
  if (query.ownership && project.ownership !== query.ownership) return false
  if (query.domain && project.domain !== query.domain) return false
  if (query.workType && project.workType !== query.workType) return false
  if (query.source && project.source !== query.source) return false
  if (query.engineering === true && !project.engineering) return false
  if (query.engineering === false && project.engineering) return false

  const needle = query.q.toLowerCase()
  if (!needle) return true

  const haystack = [
    project.title,
    project.description,
    project.ownership,
    project.domain,
    project.workType,
    ...project.technologies,
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(needle)
}

export const sortProjects = (
  projects: NormalizedProject[],
  sort: ProjectSort
) => {
  const copy = [...projects]
  copy.sort((a, b) => {
    switch (sort) {
      case "title":
        return a.title.localeCompare(b.title)
      case "source":
        return a.source.localeCompare(b.source) || a.title.localeCompare(b.title)
      case "featured":
      default:
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        return a.title.localeCompare(b.title)
    }
  })
  return copy
}

export const applyProjectQuery = (
  projects: NormalizedProject[],
  query: ProjectQuery
) => {
  const filtered = projects.filter((project) => matchesQuery(project, query))
  const sorted = sortProjects(filtered, query.sort)
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize))
  const page = Math.min(query.page, totalPages)
  const start = (page - 1) * query.pageSize

  return {
    items: sorted.slice(start, start + query.pageSize),
    total,
    totalPages,
    page,
    pageSize: query.pageSize,
  }
}

export const projectFilterOptions = (projects: NormalizedProject[]) => ({
  ownership: [...new Set(projects.map((project) => project.ownership))].sort() as ProjectOwnership[],
  domain: [...new Set(projects.map((project) => project.domain))].sort() as ProjectDomain[],
  workType: [...new Set(projects.map((project) => project.workType))].sort() as ProjectWorkType[],
  source: [...new Set(projects.map((project) => project.source))].sort() as ProjectSource[],
})
