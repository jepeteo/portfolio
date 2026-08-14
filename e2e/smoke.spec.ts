import { test, expect } from "@playwright/test"

test("homepage is a decision page with dual-audience CTAs", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/Senior Full-Stack Engineer/i)
  await expect(page.locator("h1")).toContainText(/reliable digital systems/i)
  await expect(
    page.getByRole("link", { name: /i need help with a website/i })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: /explore my engineering portfolio/i })
  ).toBeVisible()
  await expect(page.locator("#faq")).toHaveCount(0)
  await expect(page.locator("form")).toHaveCount(0)
})

test("legacy hashes and primary routes resolve", async ({ page }) => {
  await page.goto("/#faq")
  await page.waitForURL(/\/about/)
  await expect(page).toHaveURL(/\/about#faq/)
  await expect(page.locator("#faq")).toBeVisible()

  await page.goto("/contact")
  await expect(page.locator("#contact")).toBeVisible()
  await expect(page.getByLabel(/name/i).first()).toBeVisible()
  await expect(page.getByLabel(/email/i).first()).toBeVisible()
  await expect(page.getByLabel(/message/i).first()).toBeVisible()
})

test("service landing pages render", async ({ page }) => {
  const landings = [
    {
      path: "/services/technical-seo-audit",
      title: /Technical SEO Audit/i,
      heading: /Technical SEO audit/i,
    },
    {
      path: "/services/woocommerce-checkout-fix",
      title: /WooCommerce Checkout Fix/i,
      heading: /WooCommerce checkout broken/i,
    },
    {
      path: "/services/email-dns-outlook-fix",
      title: /Email, DNS/i,
      heading: /Business email, DNS/i,
    },
  ]

  for (const landing of landings) {
    await page.goto(landing.path)
    await expect(page).toHaveTitle(landing.title)
    await expect(page.locator("h1")).toContainText(landing.heading)
  }
})

test("service card learn more navigates to landing page", async ({ page }) => {
  await page.goto("/services")
  await expect(page.locator("#rescue")).toBeVisible()
  await page.locator('a[href="/services/technical-seo-audit"]').first().click()
  await expect(page).toHaveURL(/\/services\/technical-seo-audit/)
})

test("unknown routes render a real 404", async ({ page }) => {
  await page.goto("/this-page-does-not-exist")
  await expect(page.locator("h1")).toContainText(/not here/i)
})
