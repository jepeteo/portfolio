import { test, expect } from "@playwright/test"

test("landing page smoke flow", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/Theodoros Mentis/i)

  await expect(page.locator("#faq")).toBeVisible()
  await expect(
    page.getByText("What technologies does Theodoros Mentis specialize in?")
  ).toBeVisible()

  await page.locator('a[href="#contact"]').first().click()
  await expect(page.locator("#contact")).toBeVisible()
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
  await page.locator('a[href="/services/technical-seo-audit"]').first().click()
  await expect(page).toHaveURL(/\/services\/technical-seo-audit/)
})
