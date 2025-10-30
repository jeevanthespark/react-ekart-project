import { describe, it, expect, vi } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  truncateText,
  slugify,
  capitalizeFirst,
  unique,
  groupBy,
  sortBy,
  isValidEmail,
  isValidPhoneNumber,
  isValidPostalCode,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  debounce,
  throttle,
} from './index';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(99.99, 'EUR')).toBe('€99.99');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('truncateText', () => {
    it('should truncate text when it exceeds max length', () => {
      const text = 'This is a very long text that should be truncated';
      expect(truncateText(text, 20)).toBe('This is a very lo...');
    });

    it('should not truncate text when it is within max length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Product Name 123!')).toBe('product-name-123');
      expect(slugify('Special@Characters#Test')).toBe('specialcharacterstest');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
      expect(capitalizeFirst('tEST')).toBe('Test');
    });
  });

  describe('unique', () => {
    it('should remove duplicates from array', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const items = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
      ];
      const grouped = groupBy(items, 'category');
      expect(grouped).toEqual({
        A: [{ category: 'A', value: 1 }, { category: 'A', value: 3 }],
        B: [{ category: 'B', value: 2 }],
      });
    });
  });

  describe('sortBy', () => {
    it('should sort array by key', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      expect(sortBy(items, 'value')).toEqual([
        { value: 1 },
        { value: 2 },
        { value: 3 },
      ]);
    });

    it('should sort in descending order', () => {
      const items = [{ value: 1 }, { value: 3 }, { value: 2 }];
      expect(sortBy(items, 'value', 'desc')).toEqual([
        { value: 3 },
        { value: 2 },
        { value: 1 },
      ]);
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate phone numbers', () => {
      expect(isValidPhoneNumber('+1234567890')).toBe(true);
      expect(isValidPhoneNumber('1234567890')).toBe(true);
      expect(isValidPhoneNumber('123-456-7890')).toBe(true);
      expect(isValidPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isValidPhoneNumber('invalid')).toBe(false);
    });
  });

  describe('isValidPostalCode', () => {
    it('should validate US postal codes', () => {
      expect(isValidPostalCode('12345', 'US')).toBe(true);
      expect(isValidPostalCode('12345-6789', 'US')).toBe(true);
      expect(isValidPostalCode('invalid', 'US')).toBe(false);
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate discount percentage', () => {
      expect(calculateDiscount(100, 80)).toBe(20);
      expect(calculateDiscount(200, 150)).toBe(25);
      expect(calculateDiscount(100, 100)).toBe(0);
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax amount', () => {
      expect(calculateTax(100, 0.08)).toBe(8);
      expect(calculateTax(50, 0.1)).toBe(5);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total amount', () => {
      expect(calculateTotal(100, 8, 10)).toBe(118);
      expect(calculateTotal(50, 5, 0)).toBe(55);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(fn).not.toHaveBeenCalled();
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(fn).toHaveBeenCalledTimes(1);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
