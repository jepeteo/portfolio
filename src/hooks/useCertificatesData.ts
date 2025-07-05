import { useMemo } from "react"
import myCertificates from "../assets/myCertificates.json"

export interface ModernCertificate {
  id: string
  title: string
  issuer: string
  date: string
  credentialId?: string
  credentialUrl?: string
  description?: string
  category: string
  skills?: string[]
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  type?: "Certificate" | "Certification" | "Course" | "Degree"
  duration?: string
  verified?: boolean
}

export interface CertificateStats {
  total: number
  byCategory: Record<string, number>
  byYear: Record<string, number>
  byIssuer: Record<string, number>
  totalSkills: number
  recentCount: number
}
const transformCertificates = (): ModernCertificate[] => {
  return myCertificates
    .filter((cert) => {
      return cert.name && cert.issuer && cert.issueDate && cert.category
    })
    .map((cert, index) => ({
      id: cert.id || `cert-${index}`,
      title: cert.name,
      issuer: cert.issuer,
      date: cert.issueDate,
      credentialId: cert.id,
      credentialUrl: cert.credentialUrl,
      description: cert.description || "",
      category: cert.category,
      skills: cert.skills || [],
      level: "Intermediate" as const,
      type: "Certificate" as const,
      duration: "",
      verified: !!cert.credentialUrl,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
const calculateCertificateStats = (
  certificates: ModernCertificate[]
): CertificateStats => {
  const byCategory: Record<string, number> = {}
  const byYear: Record<string, number> = {}
  const byIssuer: Record<string, number> = {}
  const allSkills = new Set<string>()
  const currentYear = new Date().getFullYear()

  certificates.forEach((cert) => {
    byCategory[cert.category] = (byCategory[cert.category] || 0) + 1
    const year = new Date(cert.date).getFullYear().toString()
    byYear[year] = (byYear[year] || 0) + 1
    byIssuer[cert.issuer] = (byIssuer[cert.issuer] || 0) + 1
    cert.skills?.forEach((skill) => allSkills.add(skill))
  })
  const recentCount = certificates.filter((cert) => {
    const certYear = new Date(cert.date).getFullYear()
    return certYear >= currentYear - 1
  }).length

  return {
    total: certificates.length,
    byCategory,
    byYear,
    byIssuer,
    totalSkills: allSkills.size,
    recentCount,
  }
}

export const useCertificatesData = () => {
  const certificates = useMemo(() => transformCertificates(), [])
  const stats = useMemo(
    () => calculateCertificateStats(certificates),
    [certificates]
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
    () => certificates.slice(0, 6),
    [certificates]
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
