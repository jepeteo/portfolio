import { test, expect } from "@playwright/test"

test("landing page smoke flow", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/Theodoros Mentis/i)

  await page.locator('a[href="#contact"]').first().click()
  await expect(page.locator("#contact")).toBeVisible()
})
