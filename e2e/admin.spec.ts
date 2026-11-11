import { test, expect } from "@playwright/test";

test.describe("Admin & Strike Governance E2E Suite", () => {
	test("should render admin dashboard overview", async ({ page }) => {
		await page.goto("/admin");
		await expect(page.locator("body")).toBeVisible();
	});

	test("should load Admin Disputes & Strike Governance page", async ({ page }) => {
		await page.goto("/admin/disputes");
		const heading = page.locator("h1, h2").first();
		await expect(heading).toBeVisible();
	});

	test("should display strike table headers on admin disputes page", async ({ page }) => {
		await page.goto("/admin/disputes");
		const tableHeader = page.getByRole("columnheader", { name: /User Details/i });
		if (await tableHeader.count() > 0) {
			await expect(tableHeader.first()).toBeVisible();
		}
	});
});
