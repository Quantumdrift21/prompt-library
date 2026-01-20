import { test, expect } from '@playwright/test';

test('Discover page loads successfully', async ({ page }) => {
    // Navigate to the Discover page (root specific logic might redirect, but assuming / lands on discover or we go there)
    // Based on your app structure, loading root '/' shows the app. 
    // Let's verify the main elements.

    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/prompt-library/i);

    // Wait for auth loading to finish (if any spinner exists)
    // AuthRedirect renders .app-loading while loading
    await expect(page.locator('.app-loading')).not.toBeVisible({ timeout: 15000 });

    // Check if "Master the Art of Context" header is visible
    await expect(page.getByRole('heading', { name: /Master the Art of Context/i })).toBeVisible();

    // Verify Search Bar is present
    await expect(page.getByPlaceholderText(/Search/i)).toBeVisible();

    // Verify at least one prompt card is loaded (mock data)
    // We check for the class .prompt-card from PromptDiscoveryGrid
    await expect(page.locator('.prompt-card').first()).toBeVisible();
});
