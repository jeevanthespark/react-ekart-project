import { describe, it, expect } from 'vitest';
import type {
  Product,
  ProductCategory,
  CartItem,
  Cart,
  Order,
  Customer,
  Address,
  PaymentMethod,
  OrderStatus,
  ProductFilters,
  SortOption,
  ProductSearchParams,
  Toast,
  LoadingState,
  ApiResponse,
  ApiError,
} from './index';

describe('Types', () => {
  describe('Product Types', () => {
    it('should define Product interface correctly', () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        originalPrice: 129.99,
        category: {
          id: 'cat1',
          name: 'Electronics',
          slug: 'electronics',
        },
        imageUrl: 'https://example.com/image.jpg',
        rating: 4.5,
        reviewCount: 100,
        inStock: true,
        stockQuantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(product.id).toBe('1');
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(99.99);
      expect(product.inStock).toBe(true);
    });

    it('should define ProductCategory interface correctly', () => {
      const category: ProductCategory = {
        id: 'cat1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic products',
        parentId: 'parent1',
      };

      expect(category.id).toBe('cat1');
      expect(category.name).toBe('Electronics');
      expect(category.slug).toBe('electronics');
    });
  });

  describe('Cart Types', () => {
    it('should define CartItem interface correctly', () => {
      const cartItem: CartItem = {
        id: 'item1',
        productId: 'prod1',
        product: {} as Product,
        quantity: 2,
        addedAt: new Date(),
      };

      expect(cartItem.id).toBe('item1');
      expect(cartItem.quantity).toBe(2);
    });

    it('should define Cart interface correctly', () => {
      const cart: Cart = {
        id: 'cart1',
        items: [],
        totalItems: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        currency: 'USD',
        updatedAt: new Date(),
      };

      expect(cart.id).toBe('cart1');
      expect(cart.currency).toBe('USD');
    });
  });

  describe('Order Types', () => {
    it('should define OrderStatus type correctly', () => {
      const statuses: OrderStatus[] = [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ];

      expect(statuses).toHaveLength(7);
    });

    it('should define Customer interface correctly', () => {
      const customer: Customer = {
        id: 'cust1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
      };

      expect(customer.email).toBe('test@example.com');
      expect(customer.firstName).toBe('John');
    });

    it('should define Address interface correctly', () => {
      const address: Address = {
        id: 'addr1',
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      };

      expect(address.addressLine1).toBe('123 Main St');
      expect(address.city).toBe('New York');
    });

    it('should define PaymentMethod interface correctly', () => {
      const paymentMethod: PaymentMethod = {
        id: 'pm1',
        type: 'credit_card',
        last4: '1234',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
      };

      expect(paymentMethod.type).toBe('credit_card');
      expect(paymentMethod.last4).toBe('1234');
    });
  });

  describe('Filter and Sort Types', () => {
    it('should define ProductFilters interface correctly', () => {
      const filters: ProductFilters = {
        category: ['electronics'],
        priceRange: { min: 0, max: 1000 },
        rating: 4,
        inStock: true,
        brand: ['Apple'],
        tags: ['new'],
        search: 'laptop',
      };

      expect(filters.category).toEqual(['electronics']);
      expect(filters.priceRange?.min).toBe(0);
    });

    it('should define SortOption type correctly', () => {
      const sortOptions: SortOption[] = [
        'relevance',
        'price_low_to_high',
        'price_high_to_low',
        'rating',
        'newest',
        'popularity',
      ];

      expect(sortOptions).toHaveLength(6);
    });
  });

  describe('UI Types', () => {
    it('should define Toast interface correctly', () => {
      const toast: Toast = {
        id: 'toast1',
        type: 'success',
        title: 'Success!',
        message: 'Operation completed',
        duration: 5000,
      };

      expect(toast.type).toBe('success');
      expect(toast.title).toBe('Success!');
    });

    it('should define LoadingState interface correctly', () => {
      const loadingState: LoadingState = {
        isLoading: true,
        error: 'Something went wrong',
      };

      expect(loadingState.isLoading).toBe(true);
      expect(loadingState.error).toBe('Something went wrong');
    });
  });

  describe('API Types', () => {
    it('should define ApiResponse interface correctly', () => {
      const response: ApiResponse<string> = {
        data: 'test data',
        success: true,
        message: 'Success',
        pagination: {
          page: 1,
          limit: 10,
          total: 100,
          totalPages: 10,
        },
      };

      expect(response.data).toBe('test data');
      expect(response.success).toBe(true);
    });

    it('should define ApiError interface correctly', () => {
      const error: ApiError = {
        message: 'Error occurred',
        code: 'ERR_001',
        details: { field: 'email' },
      };

      expect(error.message).toBe('Error occurred');
      expect(error.code).toBe('ERR_001');
    });
  });
});