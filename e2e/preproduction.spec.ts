import { test, expect } from "@playwright/test"

const overflowRoutes = ["/", "/contact", "/services", "/projects"] as const
const overflowViewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
] as const

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

for (const viewport of overflowViewports) {
  for (const route of overflowRoutes) {
    test(`${route} does not overflow at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto(route)
      const extra = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      )
      expect(extra).toBeLessThanOrEqual(1)
    })
  }
}

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

test("contact form reaches the first viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/contact")
  await expect(page.locator("#name")).toBeVisible()
  const desktopTop = await page.locator("#name").evaluate((el) => {
    return el.getBoundingClientRect().top
  })
  expect(desktopTop).toBeLessThan(900)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/contact")
  await expect(page.locator("#name")).toBeVisible()
  const order = await page.evaluate(() => {
    const name = document.getElementById("name")
    const details = document.querySelector("aside details summary")
    if (!name || !details) return null
    return name.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING
      ? "form-before-details"
      : "details-before-form"
  })
  expect(order).toBe("form-before-details")
  const mobileTop = await page.locator("#name").evaluate((el) => {
    return el.getBoundingClientRect().top
  })
  expect(mobileTop).toBeLessThan(900)
})

test("contact aria-invalid follows custom errors after empty submit", async ({
  page,
}) => {
  await page.goto("/contact")
  // Timing bot check requires 3s after mount before custom validation runs.
  await page.waitForTimeout(3100)
  // Dispatch submit so custom validation runs (native required would block a click).
  await page.locator("form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
  })

  await expect(page.locator("#name")).toBeFocused()
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true")
  await expect(page.locator("#name")).toHaveAttribute(
    "aria-describedby",
    "name-error"
  )
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true")
  await expect(page.locator("#message")).toHaveAttribute("aria-invalid", "true")

  const falseInvalid = await page.locator('[aria-invalid="false"]').count()
  expect(falseInvalid).toBe(0)

  await page.locator("#name").fill("Theo Mentis")
  await expect(page.locator("#name")).not.toHaveAttribute("aria-invalid")
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true")
  await expect(page.locator("#message")).toHaveAttribute("aria-invalid", "true")
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
