import { describe, expect, it } from "vitest"
import {
  hashTargetId,
  shouldRestoreScroll,
  waitForElement,
} from "./routeScroll"

describe("route scroll helpers", () => {
  it("reads hash target ids", () => {
    expect(hashTargetId("#rescue")).toBe("rescue")
    expect(hashTargetId("improve")).toBe("improve")
    expect(hashTargetId("")).toBe("")
  })

  it("restores scroll only for back/forward without a hash", () => {
    expect(shouldRestoreScroll("POP", "")).toBe(true)
    expect(shouldRestoreScroll("POP", "#rescue")).toBe(false)
    expect(shouldRestoreScroll("PUSH", "")).toBe(false)
    expect(shouldRestoreScroll("REPLACE", "")).toBe(false)
  })

  it("waits for a hash target to appear", async () => {
    const node = document.createElement("section")
    node.id = "build"
    window.setTimeout(() => document.body.appendChild(node), 20)

    const found = await waitForElement("build", 500)
    expect(found).toBe(node)
    node.remove()
  })
})
