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

test("unknown routes render a real 404", async ({ page, request }) => {
  const response = await request.get("/this-page-does-not-exist")
  expect(response.status()).toBe(404)
  const html = await response.text()
  expect(html).toMatch(/noindex/i)
  expect(html).toMatch(/Page not found|This page is not here/i)
  expect(html).not.toMatch(/<h1>I build and rescue reliable digital systems/i)

  await page.goto("/this-page-does-not-exist")
  await expect(page.locator("h1")).toContainText(/not here/i)
})

test("known routes return HTTP 200 with route-specific static meta", async ({
  request,
}) => {
  const checks = [
    {
      path: "/",
      title: /Theodoros Mentis \| Senior Full-Stack Engineer/,
      robots: /index/i,
    },
    {
      path: "/projects",
      title: /Projects and Case Studies/,
      robots: /index/i,
    },
    {
      path: "/projects/mtx-clinic-app",
      title: /MTX Clinic App/,
      robots: /index/i,
    },
    {
      path: "/services/emergency-website-help",
      title: /Emergency WordPress Help/,
      robots: /index/i,
    },
  ]

  for (const check of checks) {
    const response = await request.get(check.path)
    expect(response.status(), check.path).toBe(200)
    const html = await response.text()
    expect(html).toMatch(check.title)
    expect(html).toMatch(/rel="canonical"/)
    expect(html).toMatch(check.robots)
  }
})

test("in-app navigation starts at the top of the next page", async ({
  page,
}) => {
  await page.goto("/services")
  await page.locator("footer a[href='/projects']").click()
  await expect(page).toHaveURL(/\/projects/)
  await expect
    .poll(async () => page.evaluate(() => window.scrollY))
    .toBeLessThan(24)
})

test("services hash targets sit below the sticky header", async ({ page }) => {
  for (const id of ["rescue", "improve", "build"]) {
    await page.goto(`/services#${id}`)
    const target = page.locator(`#${id}`)
    await expect(target).toBeVisible()
    await expect
      .poll(async () => {
        const header = await page.locator("header").boundingBox()
        const box = await target.boundingBox()
        if (!header || !box) return Number.POSITIVE_INFINITY
        return Math.abs(box.y - header.height)
      })
      .toBeLessThan(96)
  }
})
