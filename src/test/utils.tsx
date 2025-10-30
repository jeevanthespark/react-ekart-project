import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { vi } from 'vitest';

// Custom render function that wraps components with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </FluentProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialRoute = '/', ...renderOptions } = options || {};
  
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }
  
  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };

// Mock data for tests
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

// Helper functions for tests
export const createMockEvent = (value: string) => ({
  target: { value },
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
});

export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));
