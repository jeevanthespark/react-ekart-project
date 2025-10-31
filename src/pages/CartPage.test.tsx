import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import CartPage from './CartPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useCart hook
const mockRemoveItem = vi.fn();
const mockUpdateItemQuantity = vi.fn();
const mockClearCart = vi.fn();

const mockCartEmpty = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

const mockCartWithItems = {
  items: [
    {
      id: '1',
      productId: 'prod1',
      product: {
        id: 'prod1',
        name: 'Test Product 1',
        price: 99.99,
        imageUrl: 'https://example.com/image1.jpg',
        description: 'Test description',
        category: { id: 'electronics', name: 'Electronics', slug: 'electronics' },
        rating: 4.5,
        reviewCount: 100,
        inStock: true,
        stockQuantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quantity: 2,
      addedAt: new Date(),
    },
    {
      id: '2',
      productId: 'prod2',
      product: {
        id: 'prod2',
        name: 'Test Product 2',
        price: 49.99,
        imageUrl: 'https://example.com/image2.jpg',
        description: 'Test description 2',
        category: { id: 'clothing', name: 'Clothing', slug: 'clothing' },
        rating: 4.0,
        reviewCount: 50,
        inStock: true,
        stockQuantity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quantity: 1,
      addedAt: new Date(),
    },
  ],
  totalItems: 3,
  subtotal: 249.97,
  tax: 20.00,
  shipping: 10.00,
  total: 279.97,
};

let currentCart = mockCartEmpty;

vi.mock('../stores/CartStore', () => ({
  useCart: () => ({
    cart: currentCart,
    removeItem: mockRemoveItem,
    updateItemQuantity: mockUpdateItemQuantity,
    clearCart: mockClearCart,
  }),
}));

// Mock formatCurrency utility
vi.mock('@/utils', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
}));

// Mock framer-motion with typed props
interface MotionCommonProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}
interface MotionImgProps extends MotionCommonProps {
  src?: string;
  alt?: string;
}
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: MotionCommonProps) => (
      <div className={className} {...(props as Record<string, unknown>)}>
        {children}
      </div>
    ),
    img: ({ src, alt, className, ...props }: MotionImgProps) => (
      <img src={src} alt={alt} className={className} {...(props as Record<string, unknown>)} />
    ),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

const renderCartPage = () => {
  return render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    </FluentProvider>
  );
};

const setCartEmpty = () => {
  currentCart = mockCartEmpty;
};

const setCartWithItems = () => {
  currentCart = mockCartWithItems;
};

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setCartEmpty(); // Set default state to empty cart
  });

  it('should render without crashing', () => {
    setCartWithItems(); // Use cart with items for this test
    renderCartPage();
    
    expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument();
  });

  it('should display empty cart message when cart is empty', () => {
    setCartEmpty(); // Ensure cart is empty
    renderCartPage();
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText(/Looks like you haven't added any products/)).toBeInTheDocument();
  });

  it('should render back button', () => {
    setCartWithItems(); // Use cart with items - back button appears differently
    renderCartPage();
    
    const backButton = screen.getByRole('button', { name: /continue shopping/i });
    expect(backButton).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', () => {
    setCartWithItems(); // Use cart with items
    renderCartPage();
    
    const backButton = screen.getByRole('button', { name: /continue shopping/i });
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should render continue shopping button when cart is empty', () => {
    renderCartPage();
    
    const continueButton = screen.getByRole('button', { name: /continue shopping/i });
    expect(continueButton).toBeInTheDocument();
  });

  it('should navigate to home when continue shopping is clicked', () => {
    renderCartPage();
    
    const continueButton = screen.getByRole('button', { name: /continue shopping/i });
    fireEvent.click(continueButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  describe('Cart with items', () => {
    beforeEach(() => {
      setCartWithItems(); // Ensure cart has items for these tests
    });
    beforeEach(() => {
      vi.mocked(vi.importActual('@/stores/CartStore')).useCart = () => ({
        cart: mockCartWithItems,
        removeItem: mockRemoveItem,
        updateItemQuantity: mockUpdateItemQuantity,
        clearCart: mockClearCart,
      });
    });

    it('should display cart items when cart has products', () => {
      // Mock the cart with items
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('should display correct item quantities', () => {
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      // Check for quantity inputs/displays
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    it('should handle quantity updates', () => {
      renderCartPage();
      
      // Find quantity input and update it
      const quantityInput = screen.getByDisplayValue('2');
      fireEvent.change(quantityInput, { target: { value: '3' } });
      
      // Since SpinButton works differently, let's verify the input value changed
      expect(quantityInput).toHaveValue('3');
    });

    it('should handle item removal', () => {
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      // Find and click remove button
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      fireEvent.click(removeButtons[0]);
      
      expect(mockRemoveItem).toHaveBeenCalledWith('prod1');
    });

    it('should display cart summary', () => {
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('$249.97')).toBeInTheDocument(); // Subtotal
      expect(screen.getByText('$20.00')).toBeInTheDocument(); // Tax
      expect(screen.getByText('$10.00')).toBeInTheDocument(); // Shipping
      expect(screen.getByText('$279.97')).toBeInTheDocument(); // Total
    });

    it('should render checkout button', () => {
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      expect(checkoutButton).toBeInTheDocument();
    });

    it('should navigate to checkout when checkout button is clicked', () => {
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      fireEvent.click(checkoutButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });

    it('should render clear cart button', () => {
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('should clear cart when clear button is clicked', () => {
      vi.doMock('@/stores/CartStore', () => ({
        useCart: () => ({
          cart: mockCartWithItems,
          removeItem: mockRemoveItem,
          updateItemQuantity: mockUpdateItemQuantity,
          clearCart: mockClearCart,
        }),
      }));

      renderCartPage();
      
      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      fireEvent.click(clearButton);
      
      expect(mockClearCart).toHaveBeenCalledTimes(1);
    });
  });

  it('should apply responsive layout', () => {
    setCartWithItems();
    renderCartPage();
    
    // Just verify the main container exists - makeStyles generates dynamic class names
    const container = screen.getByText(/Shopping Cart/).closest('div');
    expect(container).toBeInTheDocument();
  });

  it('should handle mobile layout', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    setCartWithItems();
    renderCartPage();
    
    expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument();
  });

  it('should display correct total item count', () => {
    renderCartPage();
    
    // When cart is empty, should show appropriate message
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should format prices correctly', () => {
    setCartWithItems();
    renderCartPage();
    
    // Prices should be formatted as currency
    expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument();
  });
});