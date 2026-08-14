import { useMemo } from "react"
import {
  certificateStats,
  getFeaturedCertificates,
  normalizeCertificates,
  type NormalizedCertificate,
} from "../content/certificateModel"

export type ModernCertificate = {
  id: string
  title: string
  issuer: string
  date: string
  credentialId?: string
  credentialUrl?: string
  description?: string
  category: string
  skills?: string[]
  verified?: boolean
  featured?: boolean
  year?: string
}

export interface CertificateStats {
  total: number
  byCategory: Record<string, number>
  byYear: Record<string, number>
  byIssuer: Record<string, number>
  totalSkills: number
  recentCount: number
}

const toDisplayCertificate = (
  cert: NormalizedCertificate
): ModernCertificate => ({
  id: cert.id,
  title: cert.title,
  issuer: cert.issuer,
  date: cert.date,
  credentialId: cert.id,
  credentialUrl: cert.credentialUrl,
  description: cert.description,
  category: cert.category,
  skills: cert.skills,
  verified: cert.verified,
  featured: cert.featured,
  year: cert.year,
})

export const useCertificatesData = () => {
  const certificates = useMemo(
    () => normalizeCertificates().map(toDisplayCertificate),
    []
  )
  const stats = useMemo(
    () => certificateStats(normalizeCertificates()),
    []
  )

  const categories = useMemo(
    () => Object.keys(stats.byCategory).sort(),
    [stats.byCategory]
  )

  const topIssuers = useMemo(
    () =>
      Object.entries(stats.byIssuer)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([issuer, count]) => ({ issuer, count })),
    [stats.byIssuer]
  )

  const recentCertificates = useMemo(
    () => getFeaturedCertificates().map(toDisplayCertificate),
    []
  )

  const getCertificatesByCategory = useMemo(
    () => (category: string) =>
      certificates.filter((cert) => cert.category === category),
    [certificates]
  )

  const getCertificatesByYear = useMemo(
    () => (year: string) =>
      certificates.filter(
        (cert) => new Date(cert.date).getFullYear().toString() === year
      ),
    [certificates]
  )

  return {
    certificates,
    stats,
    categories,
    topIssuers,
    recentCertificates,
    getCertificatesByCategory,
    getCertificatesByYear,
  }
}
