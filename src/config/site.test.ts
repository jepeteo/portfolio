import { site } from "./site"
import { SITE_EMAIL, SITE_URL } from "./routeMeta.js"

describe("site identity", () => {
  it("uses the canonical domain email and profile URLs", () => {
    expect(site.email).toBe(SITE_EMAIL)
    expect(site.email).toBe("contact@theodorosmentis.com")
    expect(site.url).toBe(SITE_URL)
    expect(site.social.github).toBe("https://github.com/jepeteo")
    expect(site.social.linkedin).toBe(
      "https://www.linkedin.com/in/thmentis/"
    )
    expect(site.cvPath).toBe("/cv/Theodoros-Mentis-CV.pdf")
  })

  it("keeps career stats as a single source of truth", () => {
    expect(site.stats.yearsExperience).toBe(18)
    expect(site.stats.projectCount).toBe(390)
    expect(site.stats.clientCount).toBe(172)
    expect(site.stats.yearsExperienceLabel).toBe("18+")
    expect(site.stats.projectCountLabel).toBe("390+")
    expect(site.stats.clientCountLabel).toBe("172+")
  })

  it("exposes a consistent professional title", () => {
    expect(site.name).toBe("Theodoros Mentis")
    expect(site.title).toBe("Senior Full-Stack Engineer")
    expect(site.location.label).toBe("Berlin, Germany")
  })
})
