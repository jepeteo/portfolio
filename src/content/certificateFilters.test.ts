import { describe, expect, it } from "vitest"
import { normalizeCertificates } from "./certificateModel"
import {
  applyCertificateQuery,
  defaultCertificateQuery,
  parseCertificateQuery,
  serializeCertificateQuery,
} from "./certificateFilters"

const certificates = normalizeCertificates()

describe("certificate filters", () => {
  it("keeps the full archive when no filters are applied", () => {
    const result = applyCertificateQuery(certificates, defaultCertificateQuery)
    expect(certificates.length).toBeGreaterThanOrEqual(69)
    expect(result.total).toBe(certificates.length)
    expect(result.items).toHaveLength(12)
    expect(result.totalPages).toBe(Math.ceil(certificates.length / 12))
  })

  it("filters by category, issuer, year, and search without dropping source records", () => {
    const category = certificates[0].category
    const byCategory = applyCertificateQuery(certificates, {
      ...defaultCertificateQuery,
      category,
      pageSize: 24,
    })
    expect(byCategory.total).toBeGreaterThan(0)
    expect(byCategory.items.every((cert) => cert.category === category)).toBe(true)

    const issuer = certificates[0].issuer
    const byIssuer = applyCertificateQuery(certificates, {
      ...defaultCertificateQuery,
      issuer,
      pageSize: 24,
    })
    expect(byIssuer.items.every((cert) => cert.issuer === issuer)).toBe(true)

    const searched = applyCertificateQuery(certificates, {
      ...defaultCertificateQuery,
      q: "project management",
      pageSize: 24,
    })
    expect(searched.total).toBeGreaterThan(0)
    expect(searched.items.length).toBeGreaterThan(0)
  })

  it("round-trips URL params and omits defaults", () => {
    const query = parseCertificateQuery(
      "?q=react&category=Frontend%20Development&sort=title&page=2&pageSize=24"
    )
    expect(query.q).toBe("react")
    expect(query.category).toBe("Frontend Development")
    expect(query.sort).toBe("title")
    expect(query.page).toBe(2)
    expect(query.pageSize).toBe(24)
    expect(serializeCertificateQuery(defaultCertificateQuery)).toBe("")
    expect(serializeCertificateQuery(query)).toContain("q=react")
  })
})
