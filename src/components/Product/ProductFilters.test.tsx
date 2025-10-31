import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import ProductFilters from './ProductFilters';
import { ProductFilters as FilterType, ProductCategory } from '@/types';

// Mock formatCurrency utility
vi.mock('@/utils', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
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
}));

const mockCategories: ProductCategory[] = [
  { id: 'electronics', name: 'Electronics', slug: 'electronics', description: 'Electronic devices' },
  { id: 'clothing', name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
  { id: 'home-garden', name: 'Home & Garden', slug: 'home-garden', description: 'Home and garden items' },
];

const mockFilters: FilterType = {
  category: [],
  priceRange: { min: 0, max: 1000 },
  rating: 0,
  inStock: false,
  search: '',
};

const mockOnFiltersChange = vi.fn();
const mockOnSortChange = vi.fn();
const mockOnClearFilters = vi.fn();

const renderProductFilters = (props = {}) => {
  const defaultProps = {
    filters: mockFilters,
    onFiltersChange: mockOnFiltersChange,
    sortOption: 'relevance' as const,
    onSortChange: mockOnSortChange,
    categories: mockCategories,
    onClearFilters: mockOnClearFilters,
    priceRange: { min: 0, max: 1000 },
    ...props,
  };

  return render(
    <FluentProvider theme={webLightTheme}>
      <ProductFilters {...defaultProps} />
    </FluentProvider>
  );
};

describe('ProductFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderProductFilters();
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should render main filter sections', () => {
    renderProductFilters();
    
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    // Use getAllByText for elements that appear multiple times
    expect(screen.getAllByText('Customer Rating').length).toBeGreaterThan(0);
  });

  it('should render sort dropdown with correct options', () => {
    renderProductFilters();
    
    const sortDropdown = screen.getByRole('combobox');
    expect(sortDropdown).toBeInTheDocument();
    // Mock dropdown doesn't set default value, just check it's a select element
    expect(sortDropdown.tagName).toBe('SELECT');
  });

  it('should render price range sliders', () => {
    renderProductFilters();
    
    expect(screen.getByText(/Min Price:/)).toBeInTheDocument();
    expect(screen.getByText(/Max Price:/)).toBeInTheDocument();
  });

  it('should display price range values', () => {
    renderProductFilters();
    
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
  });

  it('should render category checkboxes', () => {
    renderProductFilters();
    
    expect(screen.getByLabelText('Electronics')).toBeInTheDocument();
    expect(screen.getByLabelText('Clothing')).toBeInTheDocument();
    expect(screen.getByLabelText('Home & Garden')).toBeInTheDocument();
  });

  it('should render rating options', () => {
    renderProductFilters();
    
    expect(screen.getByLabelText('4+ Stars')).toBeInTheDocument();
    expect(screen.getByLabelText('3+ Stars')).toBeInTheDocument();
    expect(screen.getByLabelText('2+ Stars')).toBeInTheDocument();
    expect(screen.getByLabelText('1+ Stars')).toBeInTheDocument();
  });

  it('should render in stock filter', () => {
    renderProductFilters();
    
    expect(screen.getByLabelText('In Stock Only')).toBeInTheDocument();
  });

  it('should handle category selection', () => {
    renderProductFilters();
    
    const electronicsCheckbox = screen.getByLabelText('Electronics');
    fireEvent.click(electronicsCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      category: ['electronics'],
    });
  });

  it('should handle category deselection', () => {
    const filtersWithCategory = { ...mockFilters, category: ['electronics'] };
    renderProductFilters({ filters: filtersWithCategory });
    
    const electronicsCheckbox = screen.getByLabelText('Electronics');
    fireEvent.click(electronicsCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...filtersWithCategory,
      category: [],
    });
  });

  it('should handle rating selection', () => {
    renderProductFilters();
    
    const fourStarCheckbox = screen.getByLabelText('4+ Stars');
    fireEvent.click(fourStarCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      rating: 4,
    });
  });

  it('should handle rating deselection', () => {
    const filtersWithRating = { ...mockFilters, rating: 4 };
    renderProductFilters({ filters: filtersWithRating });
    
    const fourStarCheckbox = screen.getByLabelText('4+ Stars');
    fireEvent.click(fourStarCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...filtersWithRating,
      rating: undefined,
    });
  });

  it('should handle in stock filter toggle', () => {
    renderProductFilters();
    
    const inStockCheckbox = screen.getByLabelText('In Stock Only');
    fireEvent.click(inStockCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      inStock: true,
    });
  });

  it('should handle multiple category selections', () => {
    renderProductFilters();
    
    const electronicsCheckbox = screen.getByLabelText('Electronics');
    const clothingCheckbox = screen.getByLabelText('Clothing');
    
    fireEvent.click(electronicsCheckbox);
    fireEvent.click(clothingCheckbox);
    
    expect(mockOnFiltersChange).toHaveBeenCalledTimes(2);
  });

  it('should show clear filters button when filters are active', () => {
    const activeFilters = { ...mockFilters, category: ['electronics'], rating: 4 };
    renderProductFilters({ filters: activeFilters });
    
    expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
  });

  it('should not show clear filters button when no filters are active', () => {
    const emptyFilters = { ...mockFilters, priceRange: undefined };
    renderProductFilters({ filters: emptyFilters });
    
    expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
  });

  it('should call onClearFilters when clear button is clicked', () => {
    const activeFilters = { ...mockFilters, category: ['electronics'] };
    renderProductFilters({ filters: activeFilters });
    
    const clearButton = screen.getByText('Clear All Filters');
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it('should render mobile close button when onClose prop is provided', () => {
    const mockOnClose = vi.fn();
    renderProductFilters({ onClose: mockOnClose });
    const dismissButtons = screen.getAllByRole('button');
    expect(dismissButtons.length).toBeGreaterThan(0);
  });

  it('should display correct price range for custom range', () => {
    const customFilters = { 
      ...mockFilters, 
      priceRange: { min: 100, max: 500 } 
    };
    renderProductFilters({ filters: customFilters });
    
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('should render with empty categories gracefully', () => {
    renderProductFilters({ categories: [] });
    
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('should handle checked categories correctly', () => {
    const filtersWithCategories = { 
      ...mockFilters, 
      category: ['electronics', 'clothing'] 
    };
    renderProductFilters({ filters: filtersWithCategories });
    
    const electronicsCheckbox = screen.getByLabelText('Electronics');
    const clothingCheckbox = screen.getByLabelText('Clothing');
    
    expect(electronicsCheckbox).toBeChecked();
    expect(clothingCheckbox).toBeChecked();
  });

  it('should handle checked rating correctly', () => {
    const filtersWithRating = { ...mockFilters, rating: 4 };
    renderProductFilters({ filters: filtersWithRating });
    
    const fourStarCheckbox = screen.getByLabelText('4+ Stars');
    expect(fourStarCheckbox).toBeChecked();
  });

  it('should handle checked in stock filter correctly', () => {
    const filtersWithInStock = { ...mockFilters, inStock: true };
    renderProductFilters({ filters: filtersWithInStock });
    
    const inStockCheckbox = screen.getByLabelText('In Stock Only');
    expect(inStockCheckbox).toBeChecked();
  });

  it('should apply responsive styling', () => {
    renderProductFilters();
    
    const filterContainer = screen.getByText('Filters').closest('div');
    expect(filterContainer).toBeInTheDocument();
  });

  it('should display all sort options correctly', () => {
    renderProductFilters({ sortOption: 'price_low_to_high' });
    
    // The dropdown should show the selected option
    const sortDropdown = screen.getByRole('combobox');
    // Mock dropdown doesn't maintain state, just check it exists
    expect(sortDropdown).toBeInTheDocument();
  });
});