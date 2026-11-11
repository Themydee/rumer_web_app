import { test, expect } from "@playwright/test";

test.describe("Marketplace & Products Suite", () => {
	test("should load marketplace feed page", async ({ page }) => {
		await page.goto("/marketplace");
		await expect(page.locator("body")).toBeVisible();
	});

	test("should allow searching for products", async ({ page }) => {
		await page.goto("/marketplace");
		const searchInput = page.locator('input[placeholder*="search" i]').first();
		if (await searchInput.isVisible()) {
			await searchInput.fill("cattle");
			await expect(searchInput).toHaveValue("cattle");
		}
	});

	test("should access product details page if available", async ({ page }) => {
		await page.goto("/marketplace");
		const firstProduct = page.locator('a[href*="/marketplace/products/"]').first();
		if (await firstProduct.isVisible()) {
			await firstProduct.click();
			await expect(page).toHaveURL(/\/marketplace\/products\//);
		}
	});
});
