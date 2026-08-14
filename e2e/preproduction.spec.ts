import { test, expect } from "@playwright/test"

test("homepage does not overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")
  const extra = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  )
  expect(extra).toBeLessThanOrEqual(1)
})

test("production homepage exposes one small JSON-LD graph", async ({
  page,
}) => {
  const response = await page.goto("/")
  expect(response?.ok()).toBeTruthy()

  const html = await page.content()
  const jsonLdCount = (html.match(/type="application\/ld\+json"/g) || []).length
  expect(jsonLdCount).toBe(1)
  expect(html).toContain('"@type": "WebSite"')
  expect(html).toContain('"@type": "Person"')
  expect(html).toContain('"@type": "ProfessionalService"')
  expect(html).not.toContain("AggregateRating")
  expect(html).not.toContain("Performance Dashboard")
})

test("contact required fields and certification year label are honest", async ({
  page,
}) => {
  await page.goto("/contact")
  await expect(page.locator("#name")).toHaveAttribute("required", "")
  await expect(page.locator("#email")).toHaveAttribute("required", "")
  await expect(page.locator("#message")).toHaveAttribute("required", "")

  await page.goto("/certifications")
  await expect(page.getByText("This Year")).toHaveCount(0)
  await expect(page.getByText(/Added in 20\d{2}/).first()).toBeVisible()
})

test("case studies stay evidence-honest", async ({ page }) => {
  await page.goto("/projects/mtx-clinic-app")
  await expect(
    page.getByText(/screens and live url are not public/i).first()
  ).toBeVisible()

  await page.goto("/projects/stoney-holiday-lets")
  await expect(page.locator("h1")).toContainText(/Stoney Holiday Lets/i)
  await expect(page.locator("img[alt*='Stoney']")).toBeVisible()

  await page.goto("/projects/technical-rescue")
  await expect(page).toHaveURL(/\/services#rescue/)
})
