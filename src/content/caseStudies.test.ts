import { describe, expect, it } from "vitest"
import {
  adjacentCaseStudies,
  featuredCaseStudies,
  projectImageSrc,
  typicalRescueEngagement,
} from "./caseStudies"

describe("featured case studies", () => {
  it("does not present the technical rescue example as completed client evidence", () => {
    expect(
      featuredCaseStudies.some((study) => study.id === "technical-rescue")
    ).toBe(false)
    expect(typicalRescueEngagement.label).toBe("Typical workflow")
    expect(typicalRescueEngagement.note.toLowerCase()).toContain("not a named")
  })

  it("uses absolute project image paths", () => {
    expect(projectImageSrc("stoneyholidaylets")).toBe(
      "/images/projects/stoneyholidaylets.webp"
    )
    expect(projectImageSrc()).toBeUndefined()
  })

  it("keeps MTX Clinic confidential and Stoney as a live WordPress case", () => {
    const mtx = featuredCaseStudies.find((study) => study.id === "mtx-clinic-app")
    const stoney = featuredCaseStudies.find(
      (study) => study.id === "stoney-holiday-lets"
    )

    expect(mtx?.confidential).toBe(true)
    expect(mtx?.url).toBeUndefined()
    expect(stoney?.url).toContain("stoneyholidaylets")
    expect(adjacentCaseStudies("mtx-clinic-app").next?.id).toBe(
      "stoney-holiday-lets"
    )
  })
})
