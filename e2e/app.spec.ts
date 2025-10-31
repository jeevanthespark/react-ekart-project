import { test, expect } from '@playwright/test';

// Clean smoke tests for core flow
test.describe('E-Commerce Smoke Flow', () => {
  test('homepage renders and shows products', async ({ page }) => {
    // Capture console errors for diagnostics
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle(/eKart - Modern Ecommerce/);
    // Wait for products container first
    await page.waitForSelector('[data-testid="products-container"]', { timeout: 15000 });
    // Wait until at least one product-card exists in DOM
    await page.waitForFunction(() => !!document.querySelector('[data-testid="product-card"]'), undefined, { timeout: 15000 });
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct).toBeVisible();
    if (errors.length) {
      console.log('Console errors captured during homepage test:', errors);
    }
  });

  test('can add product to cart and view cart', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="products-container"]', { timeout: 15000 });
    const addToCartButton = page.locator('[data-testid="add-to-cart-button"]').first();
    await addToCartButton.scrollIntoViewIfNeeded();
    await addToCartButton.click();
    // cart count badge appears asynchronously (animation/popover); poll for text 1
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toHaveText('1');
    await page.goto('/cart');
    await expect(page.locator('[data-testid="cart-page-title"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
  });

  test('can proceed to checkout and see form', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="products-container"]', { timeout: 15000 });
    const addToCartButton = page.locator('[data-testid="add-to-cart-button"]').first();
    await addToCartButton.scrollIntoViewIfNeeded();
    await addToCartButton.click();
    await page.goto('/cart');
    await page.locator('[data-testid="proceed-to-checkout"]').click();
    await expect(page.locator('[data-testid="checkout-form"]').first()).toBeVisible();
  });
});