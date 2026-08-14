import { describe, expect, it } from "vitest"
import { normalizeCertificates } from "./certificateModel"
import {
  engineeringCatalog,
  engineeringGroups,
  fintechLearning,
  fintechPath,
} from "./engineeringCatalog"

describe("engineering catalog", () => {
  it("shows a small public collection that includes MTX Clinic", () => {
    expect(engineeringCatalog.some((entry) => entry.id === "mtx-clinic-app")).toBe(
      true
    )
    expect(engineeringCatalog.some((entry) => entry.id === "mtx-studio")).toBe(
      false
    )
    expect(engineeringCatalog.length).toBeLessThan(10)
    expect(engineeringGroups.every((group) => group.items.length > 0)).toBe(true)
  })

  it("keeps the fintech path as learning, not invented jobs", () => {
    expect(fintechPath.futureCategories.length).toBeGreaterThan(0)
    expect(fintechPath.roadmapHeading).toBe("Current learning roadmap")
    expect(fintechPath.roadmapBody.toLowerCase()).not.toContain("bank")
    expect(fintechPath.roadmapBody.toLowerCase()).not.toContain("employed")
    expect(fintechPath.body.toLowerCase()).not.toContain("bank")
  })

  it("curates verified fintech learning without Unity-first padding", () => {
    expect(fintechLearning.length).toBeGreaterThan(0)
    expect(fintechLearning.length).toBeLessThanOrEqual(8)
    expect(fintechLearning[0]?.id).toMatch(/csharp|learning-csharp/)
    expect(fintechLearning.every((cert) => Boolean(cert.credentialUrl))).toBe(
      true
    )
    expect(fintechLearning.some((cert) => cert.id.startsWith("unity-"))).toBe(
      false
    )
    expect(normalizeCertificates().length).toBeGreaterThanOrEqual(69)
  })
})
