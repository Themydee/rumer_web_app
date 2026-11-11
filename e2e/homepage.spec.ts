import { test, expect } from "@playwright/test";

test.describe("Homepage & Navigation Suite", () => {
	test("should load the homepage and render main elements", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/Rumer|Rummer|Livestock/i);

		// Header navigation check
		const navElement = page.locator("header");
		await expect(navElement.first()).toBeVisible();
	});

	test("should navigate to login page from header", async ({ page }) => {
		await page.goto("/");
		const loginLink = page.getByRole("link", { name: /login|sign in/i }).first();
		if (await loginLink.isVisible()) {
			await loginLink.click();
			await expect(page).toHaveURL(/\/login/);
		}
	});

	test("should navigate to story / about us page", async ({ page }) => {
		await page.goto("/story");
		await expect(page.locator("h1, h2").first()).toBeVisible();
	});

	test("should render footer links properly", async ({ page }) => {
		await page.goto("/");
		const footer = page.locator("footer");
		await expect(footer.first()).toBeVisible();
	});
});
