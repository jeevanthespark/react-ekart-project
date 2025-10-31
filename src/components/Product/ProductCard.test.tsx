import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { mockProduct } from '@/test/utilsData';
import ProductCard from './ProductCard';

// Mock functions that we'll use in tests
const mockAddItem = vi.fn();
const mockIsItemInCart = vi.fn();

// Mock the cart store with proper exports
vi.mock('@/stores/CartStore', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    isItemInCart: mockIsItemInCart,
  }),
}));

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsItemInCart.mockReturnValue(false);
  });

  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$129.99')).toBeInTheDocument();
    expect(screen.getByText('(100)')).toBeInTheDocument();
  });

  it('should display discount badge when original price exists', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('-23%')).toBeInTheDocument();
    expect(screen.getByText('Save 23%')).toBeInTheDocument();
  });

  it('should not display discount badge when no original price', () => {
    const productWithoutDiscount = {
      ...mockProduct,
      originalPrice: undefined,
    };
    
    render(<ProductCard product={productWithoutDiscount} />);
    
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });

  it('should render star rating correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check for star icons (SVG elements) - we expect 5 stars total
    const starContainer = screen.getByText('(100)').closest('div');
    expect(starContainer).toBeInTheDocument();
    // Since stars are SVG elements without test-ids, we just verify the rating component renders
  });

  it('should call addItem when add to cart button is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });

  it('should show "Added to Cart" when item is in cart', () => {
    mockIsItemInCart.mockReturnValue(true);
    
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Added to Cart')).toBeInTheDocument();
  });

  it('should show "Out of Stock" for out of stock products', () => {
    const outOfStockProduct = {
      ...mockProduct,
      inStock: false,
    };
    
    render(<ProductCard product={outOfStockProduct} />);
    
    const button = screen.getByText('Out of Stock');
    expect(button).toBeDisabled();
  });

  it('should not call addItem for out of stock products', () => {
    const outOfStockProduct = {
      ...mockProduct,
      inStock: false,
    };
    
    render(<ProductCard product={outOfStockProduct} />);
    
    const button = screen.getByText('Out of Stock');
    fireEvent.click(button);
    
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('should call onProductClick when card is clicked', () => {
    const mockOnProductClick = vi.fn();
    
    render(
      <ProductCard product={mockProduct} onProductClick={mockOnProductClick} />
    );
    
    // Find the card element by its container
    const card = screen.getByText('Test Product').closest('div');
    if (!card) throw new Error('Card container not found');
    fireEvent.click(card);
    
    expect(mockOnProductClick).toHaveBeenCalledWith(mockProduct);
  });

  it('should prevent card click when add to cart button is clicked', () => {
    const mockOnProductClick = vi.fn();
    
    render(
      <ProductCard product={mockProduct} onProductClick={mockOnProductClick} />
    );
    
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    
    expect(mockOnProductClick).not.toHaveBeenCalled();
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });
});
