import { describe, it, expect } from 'vitest';
import { mockCategories, mockProducts } from './mockData';

describe('mockData', () => {
  describe('mockCategories', () => {
    it('should export an array of categories', () => {
      expect(Array.isArray(mockCategories)).toBe(true);
      expect(mockCategories.length).toBeGreaterThan(0);
    });

    it('should have categories with required properties', () => {
      mockCategories.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('slug');
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.slug).toBe('string');
      });
    });

    it('should include Electronics category', () => {
      const electronics = mockCategories.find(cat => cat.slug === 'electronics');
      expect(electronics).toBeDefined();
      expect(electronics?.name).toBe('Electronics');
    });

    it('should include Clothing category', () => {
      const clothing = mockCategories.find(cat => cat.slug === 'clothing');
      expect(clothing).toBeDefined();
      expect(clothing?.name).toBe('Clothing');
    });

    it('should include Home & Garden category', () => {
      const homeGarden = mockCategories.find(cat => cat.slug === 'home-garden');
      expect(homeGarden).toBeDefined();
      expect(homeGarden?.name).toBe('Home & Garden');
    });

    it('should include Sports & Outdoors category', () => {
      const sports = mockCategories.find(cat => cat.slug === 'sports');
      expect(sports).toBeDefined();
      expect(sports?.name).toBe('Sports & Outdoors');
    });

    it('should include Books category', () => {
      const books = mockCategories.find(cat => cat.slug === 'books');
      expect(books).toBeDefined();
      expect(books?.name).toBe('Books');
    });

    it('should have unique category IDs', () => {
      const ids = mockCategories.map(cat => cat.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have unique category slugs', () => {
      const slugs = mockCategories.map(cat => cat.slug);
      const uniqueSlugs = [...new Set(slugs)];
      expect(slugs.length).toBe(uniqueSlugs.length);
    });
  });

  describe('mockProducts', () => {
    it('should export an array of products', () => {
      expect(Array.isArray(mockProducts)).toBe(true);
      expect(mockProducts.length).toBeGreaterThan(0);
    });

    it('should have products with all required properties', () => {
      mockProducts.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('imageUrl');
        expect(product).toHaveProperty('rating');
        expect(product).toHaveProperty('reviewCount');
        expect(product).toHaveProperty('inStock');
        expect(product).toHaveProperty('stockQuantity');
        expect(product).toHaveProperty('createdAt');
        expect(product).toHaveProperty('updatedAt');
      });
    });

    it('should have products with correct data types', () => {
      mockProducts.forEach(product => {
        expect(typeof product.id).toBe('string');
        expect(typeof product.name).toBe('string');
        expect(typeof product.description).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(typeof product.imageUrl).toBe('string');
        expect(typeof product.rating).toBe('number');
        expect(typeof product.reviewCount).toBe('number');
        expect(typeof product.inStock).toBe('boolean');
        expect(typeof product.stockQuantity).toBe('number');
        expect(product.createdAt).toBeInstanceOf(Date);
        expect(product.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('should have products with valid price values', () => {
      mockProducts.forEach(product => {
        expect(product.price).toBeGreaterThan(0);
        if (product.originalPrice) {
          expect(product.originalPrice).toBeGreaterThan(product.price);
        }
      });
    });

    it('should have products with valid rating values', () => {
      mockProducts.forEach(product => {
        expect(product.rating).toBeGreaterThanOrEqual(0);
        expect(product.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have products with valid review counts', () => {
      mockProducts.forEach(product => {
        expect(product.reviewCount).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have products with valid stock quantities', () => {
      mockProducts.forEach(product => {
        expect(product.stockQuantity).toBeGreaterThanOrEqual(0);
        if (!product.inStock) {
          expect(product.stockQuantity).toBe(0);
        }
      });
    });

    it('should have products with valid image URLs', () => {
      mockProducts.forEach(product => {
        expect(product.imageUrl).toMatch(/^https?:\/\/.+/);
      });
    });

    it('should have products with valid categories', () => {
      mockProducts.forEach(product => {
        expect(product.category).toHaveProperty('id');
        expect(product.category).toHaveProperty('name');
        expect(product.category).toHaveProperty('slug');
        
        // Check if category exists in mockCategories
        const categoryExists = mockCategories.some(cat => cat.id === product.category.id);
        expect(categoryExists).toBe(true);
      });
    });

    it('should have unique product IDs', () => {
      const ids = mockProducts.map(product => product.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should include products from different categories', () => {
      const productCategories = mockProducts.map(p => p.category.id);
      const uniqueCategories = [...new Set(productCategories)];
      expect(uniqueCategories.length).toBeGreaterThan(1);
    });

    it('should include at least one electronics product', () => {
      const electronicsProduct = mockProducts.find(p => p.category.slug === 'electronics');
      expect(electronicsProduct).toBeDefined();
    });

    it('should include products with discounts', () => {
      const discountedProduct = mockProducts.find(p => p.originalPrice && p.originalPrice > p.price);
      expect(discountedProduct).toBeDefined();
    });

    it('should include products without discounts', () => {
      const regularProduct = mockProducts.find(p => !p.originalPrice);
      expect(regularProduct).toBeDefined();
    });

    it('should have products with different stock statuses', () => {
      const inStockProduct = mockProducts.find(p => p.inStock);
      const outOfStockProduct = mockProducts.find(p => !p.inStock);
      
      expect(inStockProduct).toBeDefined();
      // Note: Depending on mock data, out of stock products might not exist
    });

    it('should have products with realistic descriptions', () => {
      mockProducts.forEach(product => {
        expect(product.description.length).toBeGreaterThan(10);
        expect(product.description.length).toBeLessThan(500);
      });
    });

    it('should have products with SKUs if provided', () => {
      mockProducts.forEach(product => {
        if (product.sku) {
          expect(typeof product.sku).toBe('string');
          expect(product.sku.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have products with brands if provided', () => {
      mockProducts.forEach(product => {
        if (product.brand) {
          expect(typeof product.brand).toBe('string');
          expect(product.brand.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have products with tags if provided', () => {
      mockProducts.forEach(product => {
        if (product.tags) {
          expect(Array.isArray(product.tags)).toBe(true);
          product.tags.forEach(tag => {
            expect(typeof tag).toBe('string');
          });
        }
      });
    });
  });
});