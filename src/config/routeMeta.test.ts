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

    expect(mtx.some((node) => node["@type"] === "SoftwareApplication")).toBe(true)
    expect(stoney.some((node) => node["@type"] === "CreativeWork")).toBe(true)
    expect(JSON.stringify(mtx).includes("AggregateRating")).toBe(false)
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
