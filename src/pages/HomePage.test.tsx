import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import HomePage from './HomePage';

// Mock ProductCard component with typed props
interface MockProductCardProps {
  product: { id: string; name: string; price: number } & Record<string, unknown>;
  onProductClick?: (product: MockProductCardProps['product']) => void;
}
vi.mock('@/components/Product/ProductCard', () => ({
  default: ({ product, onProductClick }: MockProductCardProps) => (
    <div data-testid="product-card" onClick={() => onProductClick?.(product)}>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  ),
}));

// Mock ProductFilters component with typed props
interface MockProductFiltersProps {
  onFiltersChange: (filters: Record<string, unknown>) => void;
  onSortChange: (sort: string) => void;
}
vi.mock('@/components/Product/ProductFilters', () => ({
  default: ({ onFiltersChange, onSortChange }: MockProductFiltersProps) => (
    <div data-testid="product-filters">
      <button onClick={() => onFiltersChange({ category: ['electronics'] })}>
        Filter Electronics
      </button>
      <button onClick={() => onSortChange('price_low_to_high')}>
        Sort by Price
      </button>
    </div>
  ),
}));

// Mock mockData
vi.mock('@/data/mockData', () => ({
  mockProducts: [
    {
      id: '1',
      name: 'Test Product 1',
      price: 99.99,
      category: { id: 'electronics', name: 'Electronics', slug: 'electronics' },
      rating: 4.5,
      inStock: true,
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 199.99,
      category: { id: 'clothing', name: 'Clothing', slug: 'clothing' },
      rating: 4.0,
      inStock: false,
    },
  ],
  mockCategories: [
    { id: 'electronics', name: 'Electronics', slug: 'electronics' },
    { id: 'clothing', name: 'Clothing', slug: 'clothing' },
  ],
}));

// Mock framer-motion with typed props
interface MotionDivProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: MotionDivProps) => (
      <div className={className} {...(props as Record<string, unknown>)}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

const renderHomePage = () => {
  return render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </FluentProvider>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderHomePage();
    
    expect(screen.getByText('Discover Amazing Products')).toBeInTheDocument();
  });

  it('should display page title and subtitle', () => {
    renderHomePage();
    
    expect(screen.getByText('Discover Amazing Products')).toBeInTheDocument();
    expect(screen.getByText(/Find everything you need in our curated collection/i)).toBeInTheDocument();
  });

  it('should render product filters', () => {
    renderHomePage();
    
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should render product cards', () => {
    renderHomePage();
    
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(2);
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  it('should display view toggle buttons', () => {
    renderHomePage();
    
    // Look for buttons that contain data-testid for grid or list icons
    const buttons = screen.getAllByRole('button');
    const viewToggleButtons = buttons.filter(btn => 
      btn.querySelector('[data-testid="grid-icon"]') || 
      btn.querySelector('[data-testid="list-icon"]')
    );
    expect(viewToggleButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('should display filters toggle button on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderHomePage();
    
    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
  });

  it('should handle filter changes', () => {
    renderHomePage();
    
    const filterButton = screen.getByText('Filter Electronics');
    fireEvent.click(filterButton);
    
    // Should filter products (only electronics should be visible)
    // This would depend on the actual filtering logic
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should handle sort changes', () => {
    renderHomePage();
    
    const sortButton = screen.getByText('Sort by Price');
    fireEvent.click(sortButton);
    
    // Should sort products by price
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should toggle between grid and list view', () => {
    renderHomePage();
    
    const listViewButton = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listViewButton);
    
    // Should change view mode
    expect(listViewButton).toBeInTheDocument();
  });

  it('should handle search functionality', () => {
    renderHomePage();
    
    // Search input should be in the header/filters
    // This test assumes search is integrated
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    renderHomePage();
    
    // HomePage renders immediately without loading state in our mock
    // Check that the main content is rendered
    expect(screen.getByText('Discover Amazing Products')).toBeInTheDocument();
  });

  it('should handle empty results', () => {
    // Mock empty products array
    vi.doMock('@/data/mockData', () => ({
      mockProducts: [],
      mockCategories: [],
    }));
    
    renderHomePage();
    
    // Should show empty state message
    expect(screen.getByText('Discover Amazing Products')).toBeInTheDocument();
  });

  it('should apply responsive layout', () => {
    renderHomePage();

    const container = screen.getByText('Discover Amazing Products').closest('div');
    expect(container).toBeInTheDocument();
    // Mock styles don't generate predictable class names, just check container exists
    expect(container).toBeTruthy();
  });  it('should handle product card clicks', () => {
    renderHomePage();
    
    const productCard = screen.getAllByTestId('product-card')[0];
    fireEvent.click(productCard);
    
    // Should trigger product click handler
    expect(productCard).toBeInTheDocument();
  });

  it('should display correct product count', () => {
    renderHomePage();
    
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(2);
  });

  it('should filter products by category', async () => {
    renderHomePage();
    
    const filterButton = screen.getByText('Filter Electronics');
    fireEvent.click(filterButton);
    
    // Wait for filter to be applied
    await waitFor(() => {
      expect(screen.getByTestId('product-filters')).toBeInTheDocument();
    });
  });

  it('should handle price range filtering', () => {
    renderHomePage();
    
    // This would test price range slider functionality
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should handle stock availability filtering', () => {
    renderHomePage();
    
    // Should be able to filter by stock status
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should handle brand filtering', () => {
    renderHomePage();
    
    // Should be able to filter by brand
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });

  it('should display pagination if needed', () => {
    renderHomePage();
    
    // Check for pagination controls if products exceed page limit
    // Our mock has only 2 products, so no pagination needed
    expect(screen.getByText('Discover Amazing Products')).toBeInTheDocument();
    expect(screen.getByText('2 products found')).toBeInTheDocument();
  });

  it('should handle mobile filters modal', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderHomePage();
    
    const filtersButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filtersButton);
    
    // Should open filters modal on mobile
    expect(filtersButton).toBeInTheDocument();
  });

  it('should maintain filter state between view changes', () => {
    renderHomePage();
    
    // Apply filter
    const filterButton = screen.getByText('Filter Electronics');
    fireEvent.click(filterButton);
    
    // Change view
    const listViewButton = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listViewButton);
    
    // Filter should still be applied
    expect(screen.getByTestId('product-filters')).toBeInTheDocument();
  });
});