import { describe, expect, it } from "vitest"
import {
  buildProjectPageJsonLd,
  buildRouteJsonLd,
  SITE_URL,
} from "./routeMeta.js"

type GraphNode = Record<string, unknown> & { "@type"?: string }

function graphOf(route: string) {
  return (buildRouteJsonLd(route)["@graph"] as GraphNode[]) ?? []
}

function personNodes(nodes: GraphNode[]) {
  return nodes.filter((node) => node["@type"] === "Person")
}

describe("buildRouteJsonLd", () => {
  it("keeps a single Person on the homepage graph", () => {
    const nodes = graphOf("/")
    const types = nodes.map((node) => node["@type"])

    expect(personNodes(nodes)).toHaveLength(1)
    expect(types).toContain("WebSite")
    expect(types).toContain("ProfessionalService")
    expect(JSON.stringify(buildRouteJsonLd("/")).length).toBeLessThan(8000)
  })

  it("adds a featured ItemList on /projects without dumping the archive", () => {
    const list = graphOf("/projects").find((node) => node["@type"] === "ItemList")
    const items = list?.itemListElement as unknown[]

    expect(list?.numberOfItems).toBe(2)
    expect(items).toHaveLength(2)
  })

  it("describes MTX as SoftwareApplication and Stoney as CreativeWork", () => {
    const mtx = graphOf("/projects/mtx-clinic-app")
    const stoney = graphOf("/projects/stoney-holiday-lets")
    const mtxApp = mtx.find((node) => node["@type"] === "SoftwareApplication")
    const stoneyWork = stoney.find((node) => node["@type"] === "CreativeWork")

    expect(mtxApp).toBeTruthy()
    expect(stoneyWork).toBeTruthy()
    expect(mtxApp?.description).toContain("Private Next.js clinic")
    expect(stoneyWork?.description).toContain("WordPress holiday-let website")
    expect(JSON.stringify(mtx).includes("AggregateRating")).toBe(false)
  })

  it("keeps authored featured descriptions complete and tidy", async () => {
    const { routeMeta } = await import("./routeMeta.js")
    const mtx = routeMeta["/projects/mtx-clinic-app"].description
    const stoney = routeMeta["/projects/stoney-holiday-lets"].description

    for (const description of [mtx, stoney]) {
      expect(description.trimEnd()).toBe(description)
      expect(description.endsWith(".")).toBe(true)
      expect(description.length).toBeGreaterThanOrEqual(138)
      expect(description.length).toBeLessThanOrEqual(160)
      expect(/\s$/.test(description)).toBe(false)
      const words = description.replace(/\.$/, "").split(/\s+/)
      const lastWord = words[words.length - 1] ?? ""
      expect(lastWord.length).toBeGreaterThan(1)
      expect(/-$/.test(lastWord)).toBe(false)
    }

    expect(routeMeta["/projects/stoney-holiday-lets"].ogImage).toContain(
      "stoneyholidaylets.webp"
    )
  })

  it("keeps service landing graphs small and Person-unique", () => {
    const nodes = graphOf("/services/emergency-website-help")

    expect(personNodes(nodes)).toHaveLength(1)
    expect(nodes.some((node) => node["@type"] === "Service")).toBe(true)
    expect(JSON.stringify(buildRouteJsonLd("/services")).length).toBeLessThan(8000)
  })

  it("adds ContactPage and certification summary without listing every credential", () => {
    const contact = graphOf("/contact")
    const certs = graphOf("/certifications")
    const certList = certs.find((node) => node["@type"] === "ItemList")

    expect(contact.some((node) => node["@type"] === "ContactPage")).toBe(true)
    expect(certList?.numberOfItems).toBe(69)
    expect(certList?.itemListElement).toBeUndefined()
  })
})

describe("buildProjectPageJsonLd", () => {
  it("adds one CreativeWork for an archive slug", () => {
    const graph = buildProjectPageJsonLd({
      name: "Example Site",
      description: "A delivered WordPress site.",
      path: "/projects/example-site",
    })
    const nodes = graph["@graph"] as GraphNode[]

    expect(personNodes(nodes)).toHaveLength(1)
    expect(nodes.some((node) => node["@type"] === "CreativeWork")).toBe(true)
    expect(JSON.stringify(graph)).toContain(`${SITE_URL}/projects/example-site`)
  })
})
