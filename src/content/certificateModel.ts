import myCertificates from "../assets/myCertificates.json"
import type { CertificateCategory } from "../types"

export type CertificateRecord = {
  id: string
  name: string
  issuer: string
  issueDate: string
  category: string
  credentialUrl?: string
  description?: string
  skills?: string[]
  featured?: boolean
}

export type NormalizedCertificate = {
  id: string
  title: string
  issuer: string
  date: string
  category: string
  credentialUrl?: string
  description: string
  skills: string[]
  verified: boolean
  featured: boolean
  year: string
}

/**
 * Future-ready category union. Existing certificates keep their stored category.
 * Do not recategorize historical records unless the classification is factual.
 */
export const futureCertificateCategories: CertificateCategory[] = [
  "Fintech and Banking",
  "Payments",
  "Risk and Compliance",
  "Financial Crime / AML / KYC",
  "Cybersecurity",
  "Cloud and DevOps",
  "WordPress and CMS",
  "General Professional Development",
]

/**
 * Homepage preview: explicit featured IDs, otherwise newest certificates.
 * Order here is the homepage card order.
 */
export const featuredCertificateIds: string[] = [
  "nextjs-2022",
  "learning-csharp",
  "javascript-ai-react-openai",
  "ethical-hacking-intro",
  "centos-linux",
  "pm-foundations",
  "gdpr-compliance",
  "typescript-essential",
]

export const HOMEPAGE_CERTIFICATE_PREVIEW_COUNT = 8

export const normalizeCertificate = (
  cert: CertificateRecord,
  featuredIds: string[] = featuredCertificateIds
): NormalizedCertificate => {
  const year = new Date(cert.issueDate).getFullYear().toString()

  return {
    id: cert.id,
    title: cert.name,
    issuer: cert.issuer,
    date: cert.issueDate,
    category: cert.category,
    credentialUrl: cert.credentialUrl,
    description: cert.description || "",
    skills: cert.skills || [],
    verified: Boolean(cert.credentialUrl),
    featured: cert.featured === true || featuredIds.includes(cert.id),
    year,
  }
}

export const normalizeCertificates = (
  records: CertificateRecord[] = myCertificates as CertificateRecord[]
) =>
  records
    .filter((cert) => cert.name && cert.issuer && cert.issueDate && cert.category)
    .map((cert) => normalizeCertificate(cert))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const getFeaturedCertificates = (
  certificates: NormalizedCertificate[] = normalizeCertificates(),
  count = HOMEPAGE_CERTIFICATE_PREVIEW_COUNT
) => {
  const byId = new Map(certificates.map((cert) => [cert.id, cert]))
  const orderedFeatured = featuredCertificateIds
    .map((id) => byId.get(id))
    .filter((cert): cert is NormalizedCertificate => Boolean(cert))

  if (orderedFeatured.length >= count) {
    return orderedFeatured.slice(0, count)
  }

  const featuredIds = new Set(orderedFeatured.map((cert) => cert.id))
  const newest = certificates.filter((cert) => !featuredIds.has(cert.id))
  return [...orderedFeatured, ...newest].slice(0, count)
}

export const certificateStats = (
  certificates: NormalizedCertificate[] = normalizeCertificates()
) => {
  const byCategory: Record<string, number> = {}
  const byYear: Record<string, number> = {}
  const byIssuer: Record<string, number> = {}
  const allSkills = new Set<string>()
  const currentYear = new Date().getFullYear()

  certificates.forEach((cert) => {
    byCategory[cert.category] = (byCategory[cert.category] || 0) + 1
    byYear[cert.year] = (byYear[cert.year] || 0) + 1
    byIssuer[cert.issuer] = (byIssuer[cert.issuer] || 0) + 1
    cert.skills.forEach((skill) => allSkills.add(skill))
  })

  return {
    total: certificates.length,
    byCategory,
    byYear,
    byIssuer,
    totalSkills: allSkills.size,
    currentYearCount: certificates.filter(
      (cert) => Number(cert.year) === currentYear
    ).length,
    latestCredentialYear: Object.keys(byYear)
      .map(Number)
      .filter((year) => !Number.isNaN(year))
      .reduce((latest, year) => Math.max(latest, year), 0),
  }
}

export const certificateHighlight = (
  stats: ReturnType<typeof certificateStats>
) => {
  if (stats.currentYearCount > 0) {
    const year = new Date().getFullYear()
    return {
      value: String(stats.currentYearCount),
      label: `Added in ${year}`,
    }
  }

  return {
    value: String(stats.byYear[String(stats.latestCredentialYear)] || 0),
    label: `Added in ${stats.latestCredentialYear}`,
  }
}
