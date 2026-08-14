import { describe, expect, it } from "vitest"
import { allNormalizedProjects } from "./projectTaxonomy"
import {
  applyProjectQuery,
  defaultProjectQuery,
  mapLegacyProjectTab,
  parseProjectQuery,
} from "./projectFilters"

const projects = allNormalizedProjects()

describe("project filters", () => {
  it("does not treat WordPress, client, and personal as mutually exclusive tabs", () => {
    const wordpress = applyProjectQuery(projects, {
      ...defaultProjectQuery,
      source: "wordpress",
      pageSize: 24,
    })
    const client = applyProjectQuery(projects, {
      ...defaultProjectQuery,
      ownership: "client",
      pageSize: 24,
    })
    const combined = applyProjectQuery(projects, {
      ...defaultProjectQuery,
      source: "wordpress",
      ownership: "client",
      pageSize: 24,
    })

    expect(wordpress.total).toBeGreaterThan(0)
    expect(client.total).toBeGreaterThan(0)
    expect(combined.total).toBeGreaterThan(0)
    expect(combined.total).toBeLessThanOrEqual(wordpress.total)
    expect(combined.items.every((project) => project.source === "wordpress")).toBe(
      true
    )
    expect(combined.items.every((project) => project.ownership === "client")).toBe(
      true
    )
  })

  it("keeps Jepeteo in the archive without featuring the 1000+ clients claim", () => {
    const jepeteo = projects.find((project) => project.id === "jepeteo")
    expect(jepeteo).toBeDefined()
    expect(jepeteo?.featured).toBe(false)
    expect(jepeteo?.description.toLowerCase()).not.toContain("1000+")
  })

  it("maps legacy project tabs to taxonomy query params", () => {
    expect(mapLegacyProjectTab("wordpress")).toBe("source=wordpress")
    expect(mapLegacyProjectTab("client")).toBe("ownership=client")
    expect(mapLegacyProjectTab("personal")).toBe("ownership=personal")
    expect(parseProjectQuery("?ownership=client&pageSize=24").ownership).toBe(
      "client"
    )
  })
})
