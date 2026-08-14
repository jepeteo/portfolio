import { describe, expect, it } from "vitest"
import {
  engineeringCatalog,
  engineeringGroups,
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
    expect(fintechPath.body.toLowerCase()).not.toContain("bank")
  })
})
