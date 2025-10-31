import { vi } from 'vitest';

// Shared mock entities for tests (non-component exports separated to satisfy react-refresh rule)
export const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test product description',
  price: 99.99,
  originalPrice: 129.99,
  category: {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
  },
  imageUrl: 'https://example.com/image.jpg',
  rating: 4.5,
  reviewCount: 100,
  inStock: true,
  stockQuantity: 10,
  brand: 'Test Brand',
  sku: 'TEST-001',
  tags: ['test', 'product'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

export const mockCartItem = {
  id: 'cart-item-1',
  productId: '1',
  product: mockProduct,
  quantity: 2,
  addedAt: new Date('2024-01-01'),
};

export const createMockEvent = (value: string) => ({
  target: { value },
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
});

export const waitForLoadingToFinish = () => new Promise(resolve => setTimeout(resolve, 0));
