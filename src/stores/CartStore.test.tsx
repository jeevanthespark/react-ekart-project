import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from './CartStore';
import { mockProduct } from '@/test/utils';

describe('CartStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 2);
      });
      
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(mockProduct.id);
      expect(result.current.cart.items[0].quantity).toBe(2);
      expect(result.current.cart.totalItems).toBe(2);
    });

    it('should increase quantity when adding existing item', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 1);
      });
      
      act(() => {
        result.current.addItem(mockProduct, 2);
      });
      
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(3);
      expect(result.current.cart.totalItems).toBe(3);
    });

    it('should calculate totals correctly', () => {
      const { result } = renderHook(() => useCartStore());
      
      // Use a product under $75 to test shipping
      const cheapProduct = { ...mockProduct, price: 50.00 };
      
      act(() => {
        result.current.addItem(cheapProduct, 1);
      });
      
      expect(result.current.cart.subtotal).toBe(50.00);
      expect(result.current.cart.tax).toBe(4.00); // 8% tax
      expect(result.current.cart.shipping).toBe(10); // Under $75, so $10 shipping
      expect(result.current.cart.total).toBe(64.00);
    });

    it('should provide free shipping over $75', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 1); // $99.99 > $75
      });
      
      expect(result.current.cart.shipping).toBe(0); // Free shipping
      expect(result.current.cart.total).toBe(107.99); // 99.99 + 8% tax
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 2);
      });
      
      act(() => {
        result.current.removeItem(mockProduct.id);
      });
      
      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalItems).toBe(0);
      expect(result.current.cart.subtotal).toBe(0);
      expect(result.current.cart.tax).toBe(0);
      expect(result.current.cart.shipping).toBe(0);
      expect(result.current.cart.total).toBe(0);
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 2);
      });
      
      act(() => {
        result.current.updateItemQuantity(mockProduct.id, 5);
      });
      
      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.totalItems).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 2);
      });
      
      act(() => {
        result.current.updateItemQuantity(mockProduct.id, 0);
      });
      
      expect(result.current.cart.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 2);
      });
      
      act(() => {
        result.current.clearCart();
      });
      
      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalItems).toBe(0);
      expect(result.current.cart.total).toBe(0);
    });
  });

  describe('getItemQuantity', () => {
    it('should return correct quantity for existing item', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 3);
      });
      
      expect(result.current.getItemQuantity(mockProduct.id)).toBe(3);
    });

    it('should return 0 for non-existing item', () => {
      const { result } = renderHook(() => useCartStore());
      
      expect(result.current.getItemQuantity('non-existing')).toBe(0);
    });
  });

  describe('isItemInCart', () => {
    it('should return true for existing item', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockProduct, 1);
      });
      
      expect(result.current.isItemInCart(mockProduct.id)).toBe(true);
    });

    it('should return false for non-existing item', () => {
      const { result } = renderHook(() => useCartStore());
      
      expect(result.current.isItemInCart('non-existing')).toBe(false);
    });
  });
});
