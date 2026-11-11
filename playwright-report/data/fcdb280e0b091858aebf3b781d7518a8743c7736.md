# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin & Strike Governance E2E Suite >> should load Admin Disputes & Strike Governance page
- Location: e2e/admin.spec.ts:9:6

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('h1, h2').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1, h2').first()
    11 × locator resolved to <h2 class="text-white text-4xl font-bold mb-4">Get Started with Us</h2>
       - unexpected value "hidden"

```

```yaml
- img "Rumer"
- text: NG
- img
- img "Rumer"
- heading "Login" [level=1]
- button "Email"
- button "Phone"
- text: Email
- textbox "eg. johnfrans@gmail.com"
- text: Password
- textbox "Enter your password"
- button
- link "Forgot Password?":
  - /url: /forgot-password
- button "Log In"
- paragraph:
  - text: Don't have an account?
  - link "Sign Up":
    - /url: /signup
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Admin & Strike Governance E2E Suite", () => {
  4  | 	test("should render admin dashboard overview", async ({ page }) => {
  5  | 		await page.goto("/admin");
  6  | 		await expect(page.locator("body")).toBeVisible();
  7  | 	});
  8  | 
  9  | 	test("should load Admin Disputes & Strike Governance page", async ({ page }) => {
  10 | 		await page.goto("/admin/disputes");
  11 | 		const heading = page.locator("h1, h2").first();
> 12 | 		await expect(heading).toBeVisible();
     |                         ^ Error: expect(locator).toBeVisible() failed
  13 | 	});
  14 | 
  15 | 	test("should display strike table headers on admin disputes page", async ({ page }) => {
  16 | 		await page.goto("/admin/disputes");
  17 | 		const tableHeader = page.getByRole("columnheader", { name: /User Details/i });
  18 | 		if (await tableHeader.count() > 0) {
  19 | 			await expect(tableHeader.first()).toBeVisible();
  20 | 		}
  21 | 	});
  22 | });
  23 | 
```