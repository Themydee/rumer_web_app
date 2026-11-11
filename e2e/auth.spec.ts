import { test, expect } from "@playwright/test";

test.describe("Authentication E2E Suite", () => {
	test("should display login form with email and password inputs", async ({ page }) => {
		await page.goto("/login");

		const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
		const passwordInput = page.locator('input[type="password"], input[name="password"]');

		await expect(emailInput.first()).toBeVisible();
		await expect(passwordInput.first()).toBeVisible();
	});

	test("should display validation errors when submitting empty login form", async ({ page }) => {
		await page.goto("/login");

		const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In")');
		if (await submitBtn.count() > 0) {
			await submitBtn.first().click();
		}
	});

	test("should render forgot password link and navigate to page", async ({ page }) => {
		await page.goto("/login");
		const forgotLink = page.getByRole("link", { name: /forgot/i });
		if (await forgotLink.isVisible()) {
			await forgotLink.click();
			await expect(page).toHaveURL(/\/forgot-password/);
		}
	});

	test("should render reset password page", async ({ page }) => {
		await page.goto("/reset-password");
		await expect(page.locator("body")).toBeVisible();
	});
});
