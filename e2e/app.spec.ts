import { test, expect } from '@playwright/test';

test.describe('E-Commerce Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage with products', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/React E-Cart/);
    
    // Check if header is visible
    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    
    // Check if products are displayed
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
    
    // Check if search functionality is available
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
  });

  test('should be able to search for products', async ({ page }) => {
    // Search for a specific product
    await page.fill('[data-testid="search-input"]', 'laptop');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Check if search results are displayed
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1);
    await expect(page.locator('text=Gaming Laptop')).toBeVisible();
  });

  test('should be able to filter products by category', async ({ page }) => {
    // Click on Electronics filter
    await page.click('[data-testid="filter-electronics"]');
    
    // Check if filtered products are displayed
    const products = page.locator('[data-testid="product-card"]');
    await expect(products).toHaveCount(2); // Laptop and Phone
  });

  test('should be able to sort products by price', async ({ page }) => {
    // Sort by price high to low
    await page.selectOption('[data-testid="sort-select"]', 'price-desc');
    
    // Check if products are sorted correctly
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct.locator('text=$1199.99')).toBeVisible();
  });

  test('should be able to add product to cart', async ({ page }) => {
    // Add first product to cart
    await page.click('[data-testid="product-card"] button:has-text("Add to Cart")');
    
    // Check if cart count is updated
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // Check if success message is shown
    await expect(page.locator('text=Added to cart')).toBeVisible();
  });

  test('should display cart page with added items', async ({ page }) => {
    // Add a product to cart first
    await page.click('[data-testid="product-card"] button:has-text("Add to Cart")');
    
    // Navigate to cart
    await page.click('[data-testid="cart-link"]');
    
    // Check if cart page is displayed
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();
    
    // Check if cart item is displayed
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
  });

  test('should be able to update item quantity in cart', async ({ page }) => {
    // Add a product to cart
    await page.click('[data-testid="product-card"] button:has-text("Add to Cart")');
    
    // Navigate to cart
    await page.click('[data-testid="cart-link"]');
    
    // Increase quantity
    await page.click('[data-testid="increase-quantity"]');
    
    // Check if quantity is updated
    await expect(page.locator('[data-testid="quantity-input"]')).toHaveValue('2');
    
    // Check if total is updated
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('$2398.98');
  });

  test('should be able to remove item from cart', async ({ page }) => {
    // Add a product to cart
    await page.click('[data-testid="product-card"] button:has-text("Add to Cart")');
    
    // Navigate to cart
    await page.click('[data-testid="cart-link"]');
    
    // Remove item from cart
    await page.click('[data-testid="remove-item"]');
    
    // Check if cart is empty
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
  });

  test('should navigate to checkout page', async ({ page }) => {
    // Add a product to cart
    await page.click('[data-testid="product-card"] button:has-text("Add to Cart")');
    
    // Navigate to cart
    await page.click('[data-testid="cart-link"]');
    
    // Click checkout button
    await page.click('button:has-text("Proceed to Checkout")');
    
    // Check if checkout page is displayed
    await expect(page.locator('h1:has-text("Checkout")')).toBeVisible();
    
    // Check if checkout form is displayed
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
  });

  test('should validate checkout form', async ({ page }) => {
    // Add a product to cart and navigate to checkout
    await page.click('[data-testid="product-card"] button:has-text("Add to Cart")');
    await page.click('[data-testid="cart-link"]');
    await page.click('button:has-text("Proceed to Checkout")');
    
    // Try to submit empty form
    await page.click('button:has-text("Place Order")');
    
    // Check if validation errors are displayed
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should complete checkout process', async ({ page }) => {
    // Add a product to cart and navigate to checkout
    await page.click('[data-testid="product-card"] button:has-text("Add to Cart")');
    await page.click('[data-testid="cart-link"]');
    await page.click('button:has-text("Proceed to Checkout")');
    
    // Fill out the form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="zipCode"]', '10001');
    await page.fill('input[name="cardNumber"]', '4111111111111111');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    
    // Submit the form
    await page.click('button:has-text("Place Order")');
    
    // Check if success message is displayed
    await expect(page.locator('text=Order placed successfully')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile navigation is working
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Check if products are displayed in mobile layout
    await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
  });
});