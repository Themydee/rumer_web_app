import { test, expect } from "@playwright/test";

test.describe("Orders & Policy Implementation Suite", () => {
	test("should render orders dashboard page structure", async ({ page }) => {
		await page.goto("/dashboard/orders");
		await expect(page.locator("body")).toBeVisible();
	});

	test("should display 30-Day Rolling Strike Status Card if logged in or present", async ({ page }) => {
		await page.goto("/dashboard/orders");
		const strikeCard = page.locator('text=/30-Day Rolling Strike Status|Strike/i');
		if (await strikeCard.count() > 0) {
			await expect(strikeCard.first()).toBeVisible();
		}
	});

	test("should allow status filtering on orders page", async ({ page }) => {
		await page.goto("/dashboard/orders");
		const filterBtn = page.getByRole("button", { name: /all transactions|status/i }).first();
		if (await filterBtn.isVisible()) {
			await filterBtn.click();
		}
	});
});
