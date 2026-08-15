import { describe, expect, it } from "vitest"
import { resolveHashRedirect } from "./hashRedirects"

describe("hash redirects", () => {
  it("maps legacy homepage hashes to dedicated routes", () => {
    expect(resolveHashRedirect("/", "#projects")).toBe("/projects")
    expect(resolveHashRedirect("/", "#certificates")).toBe("/certifications")
    expect(resolveHashRedirect("/", "#experience")).toBe("/experience")
    expect(resolveHashRedirect("/", "#skills")).toBe("/engineering")
    expect(resolveHashRedirect("/", "#about")).toBe("/about")
    expect(resolveHashRedirect("/", "#contact", "?type=not-sure")).toBe(
      "/contact?type=not-sure"
    )
    expect(resolveHashRedirect("/", "#faq")).toBe("/about#faq")
    expect(resolveHashRedirect("/", "#projects?tab=client")).toBe(
      "/projects?ownership=client"
    )
    expect(resolveHashRedirect("/", "#projects?tab=wordpress")).toBe(
      "/projects?source=wordpress"
    )
  })

  it("leaves home and unknown hashes alone", () => {
    expect(resolveHashRedirect("/", "#top")).toBeNull()
    expect(resolveHashRedirect("/", "")).toBeNull()
    expect(resolveHashRedirect("/services", "#contact")).toBeNull()
  })
})
