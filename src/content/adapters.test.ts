import { describe, expect, it } from "vitest"
import {
  freelanceOverlapNote,
  jobIdFor,
  normalizeJobs,
  periodsOverlap,
} from "./experienceModel"
import {
  allNormalizedProjects,
  domainFromWordPressType,
  engineeringProjects,
  ownershipFromEmployer,
  projectTaxonomyLabel,
  publicEngineeringTracks,
  workTypeFromTags,
} from "./projectTaxonomy"
import {
  certificateStats,
  getFeaturedCertificates,
  normalizeCertificates,
} from "./certificateModel"
import { hasTestimonials, testimonials } from "./testimonials"
import { evidenceLevelFromSkill } from "./skillsEvidence"
import type { Job } from "../types"

describe("experience model", () => {
  it("builds stable ids and tags Global Touch payments work", () => {
    const jobs = normalizeJobs()
    const freelance = jobs.find((job) => job.company === "Freelancer")
    const globalTouch = jobs.find((job) => job.company === "Global Touch")

    expect(freelance?.id).toBe("freelancer-01-2011")
    expect(freelance?.employmentType).toBe("freelance")
    expect(freelance?.current).toBe(true)
    expect(globalTouch?.financialDomains).toEqual(["payments"])
    expect(globalTouch?.overlapsFreelance).toBe(true)
    expect(jobIdFor({ company: "Example Bank", from: "09-2026" })).toBe(
      "example-bank-09-2026"
    )
  })

  it("treats overlapping freelance and employment as concurrent, not invalid", () => {
    const freelance: Job = {
      title: "Engineer",
      company: "Freelancer",
      from: "01-2011",
      to: "Present",
      description: "Freelance",
    }
    const employed: Job = {
      title: "Engineer",
      company: "Global Touch",
      from: "08-2023",
      to: "06-2024",
      description: "Employment",
    }

    expect(periodsOverlap(freelance, employed)).toBe(true)
    expect(freelanceOverlapNote.toLowerCase()).toContain("alongside")
  })
})

describe("project taxonomy", () => {
  it("maps WordPress employer codes and work types without collapsing dimensions", () => {
    expect(ownershipFromEmployer("fl")).toBe("client")
    expect(ownershipFromEmployer("gron")).toBe("employer")
    expect(domainFromWordPressType("E-Shop")).toBe("e-commerce")
    expect(workTypeFromTags("From scratch")).toBe("build")
    expect(workTypeFromTags("Redesign")).toBe("redesign")
    expect(workTypeFromTags("Maintenance")).toBe("maintenance")
    expect(workTypeFromTags("Technical audit")).toBe("audit")
  })

  it("keeps the full archive and isolates engineering work", () => {
    const all = allNormalizedProjects()
    const engineering = engineeringProjects()

    expect(all.length).toBeGreaterThan(120)
    expect(all.some((project) => project.source === "wordpress")).toBe(true)
    expect(all.some((project) => project.ownership === "client")).toBe(true)
    expect(all.some((project) => project.engineering)).toBe(true)
    expect(engineering.every((project) => project.engineering)).toBe(true)
    expect(all.some((project) => project.domain === "fintech")).toBe(false)
    expect(all.find((project) => project.id === "mtx-studio")?.engineering).toBe(
      false
    )
    expect(
      engineering.every((project) => publicEngineeringTracks[project.id])
    ).toBe(true)
    expect(engineering.length).toBeLessThan(10)
    expect(projectTaxonomyLabel("wordpress")).toBe("WordPress")
    expect(projectTaxonomyLabel("e-commerce")).toBe("E-commerce")
    expect(projectTaxonomyLabel("open-source")).toBe("Open source")
  })
})

describe("certificate model", () => {
  it("preserves every certificate and does not invent proficiency levels", () => {
    const certificates = normalizeCertificates()
    const stats = certificateStats(certificates)
    const preview = getFeaturedCertificates(certificates, 8)

    expect(stats.total).toBe(certificates.length)
    expect(certificates.length).toBeGreaterThanOrEqual(69)
    expect(preview).toHaveLength(8)
    expect(certificates.every((cert) => cert.title && cert.issuer && cert.date)).toBe(
      true
    )
    expect(
      certificates.some((cert) =>
        Object.prototype.hasOwnProperty.call(cert, "level")
      )
    ).toBe(false)
  })
})

describe("testimonials and skills evidence", () => {
  it("does not expose placeholder testimonials", () => {
    expect(testimonials).toEqual([])
    expect(hasTestimonials()).toBe(false)
  })

  it("maps numeric skill data to evidence labels without requiring UI percentages", () => {
    expect(evidenceLevelFromSkill({ level: 95, experienceYears: 12 })).toBe(
      "core-production"
    )
    expect(evidenceLevelFromSkill({ level: 82, experienceYears: 4 })).toBe(
      "extensive"
    )
    expect(evidenceLevelFromSkill({ level: 70, experienceYears: 3 })).toBe(
      "working"
    )
    expect(evidenceLevelFromSkill({ level: 50, experienceYears: 1 })).toBe(
      "developing"
    )
  })
})
