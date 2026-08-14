import type { NormalizedCertificate } from "./certificateModel"

export const CERT_PAGE_SIZES = [12, 24] as const
export const DEFAULT_CERT_PAGE_SIZE = 12

export type CertificateSort = "newest" | "oldest" | "issuer" | "title"
export type CertificatePageSize = (typeof CERT_PAGE_SIZES)[number]

export type CertificateQuery = {
  q: string
  category: string
  issuer: string
  year: string
  sort: CertificateSort
  page: number
  pageSize: CertificatePageSize
}

export const defaultCertificateQuery: CertificateQuery = {
  q: "",
  category: "",
  issuer: "",
  year: "",
  sort: "newest",
  page: 1,
  pageSize: DEFAULT_CERT_PAGE_SIZE,
}

const SORTS: CertificateSort[] = ["newest", "oldest", "issuer", "title"]

const isPageSize = (value: number): value is CertificatePageSize =>
  CERT_PAGE_SIZES.includes(value as CertificatePageSize)

const isSort = (value: string): value is CertificateSort =>
  SORTS.includes(value as CertificateSort)

export const parseCertificateQuery = (search: string): CertificateQuery => {
  const params = new URLSearchParams(search)
  const rawSize = Number(params.get("pageSize") || DEFAULT_CERT_PAGE_SIZE)
  const rawPage = Number(params.get("page") || 1)
  const sort = params.get("sort") || "newest"

  return {
    q: (params.get("q") || "").trim(),
    category: params.get("category") || "",
    issuer: params.get("issuer") || "",
    year: params.get("year") || "",
    sort: isSort(sort) ? sort : "newest",
    page: Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1,
    pageSize: isPageSize(rawSize) ? rawSize : DEFAULT_CERT_PAGE_SIZE,
  }
}

export const serializeCertificateQuery = (query: CertificateQuery) => {
  const params = new URLSearchParams()
  if (query.q) params.set("q", query.q)
  if (query.category) params.set("category", query.category)
  if (query.issuer) params.set("issuer", query.issuer)
  if (query.year) params.set("year", query.year)
  if (query.sort !== defaultCertificateQuery.sort) params.set("sort", query.sort)
  if (query.page > 1) params.set("page", String(query.page))
  if (query.pageSize !== DEFAULT_CERT_PAGE_SIZE) {
    params.set("pageSize", String(query.pageSize))
  }
  return params.toString()
}

const matchesQuery = (cert: NormalizedCertificate, query: CertificateQuery) => {
  if (query.category && cert.category !== query.category) return false
  if (query.issuer && cert.issuer !== query.issuer) return false
  if (query.year && cert.year !== query.year) return false

  const needle = query.q.toLowerCase()
  if (!needle) return true

  const haystack = [
    cert.title,
    cert.issuer,
    cert.category,
    cert.description,
    ...cert.skills,
  ]
    .join(" ")
    .toLowerCase()

  return haystack.includes(needle)
}

export const sortCertificates = (
  certificates: NormalizedCertificate[],
  sort: CertificateSort
) => {
  const copy = [...certificates]
  copy.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "issuer":
        return a.issuer.localeCompare(b.issuer) || a.title.localeCompare(b.title)
      case "title":
        return a.title.localeCompare(b.title)
      case "newest":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })
  return copy
}

export const applyCertificateQuery = (
  certificates: NormalizedCertificate[],
  query: CertificateQuery
) => {
  const filtered = certificates.filter((cert) => matchesQuery(cert, query))
  const sorted = sortCertificates(filtered, query.sort)
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

export const certificateFilterOptions = (
  certificates: NormalizedCertificate[]
) => {
  const categories = [...new Set(certificates.map((cert) => cert.category))].sort()
  const issuers = [...new Set(certificates.map((cert) => cert.issuer))].sort()
  const years = [...new Set(certificates.map((cert) => cert.year))].sort(
    (a, b) => Number(b) - Number(a)
  )
  return { categories, issuers, years }
}
