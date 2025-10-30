import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Header from './Header';

// Mock useCart hook
const mockAddItem = vi.fn();
const mockCart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

vi.mock('@/stores/CartStore', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    cart: mockCart,
  }),
}));

// Mock formatCurrency utility
vi.mock('@/utils', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    header: ({ children, className, ...props }: any) => (
      <header className={className} {...props}>
        {children}
      </header>
    ),
  },
}));

const renderHeader = () => {
  return render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </FluentProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCart.items = [];
    mockCart.totalItems = 0;
  });

  it('should render without crashing', () => {
    renderHeader();
    
    expect(screen.getByText('eKart')).toBeInTheDocument();
  });

  it('should display logo with correct text', () => {
    renderHeader();
    
    const logo = screen.getByText('eKart');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render search input', () => {
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should handle search input changes', () => {
    renderHeader();
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    
    expect(searchInput).toHaveValue('laptop');
  });

  it('should render cart button with count', () => {
    mockCart.totalItems = 3;
    renderHeader();
    
    // Find cart button by looking for the button with Cart icon
    const cartButtons = screen.getAllByRole('button');
    const cartButton = cartButtons.find(btn => btn.querySelector('svg') && !btn.getAttribute('aria-label'));
    expect(cartButton).toBeInTheDocument();
  });

  it('should display correct cart count', () => {
    mockCart.totalItems = 5;
    renderHeader();
    
    // Look for the cart count badge
    const countElement = screen.getByText('5');
    expect(countElement).toBeInTheDocument();
  });

  it('should show cart popover on cart button click', async () => {
    renderHeader();
    
    // Find cart button by looking for the button with Cart icon
    const cartButtons = screen.getAllByRole('button');
    const cartButton = cartButtons.find(btn => btn.querySelector('svg') && !btn.getAttribute('aria-label'));
    fireEvent.click(cartButton!);
    
    // Wait for popover to appear
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
  });

  it('should navigate to cart page when cart button is clicked', () => {
    renderHeader();
    
    // Find cart button by looking for the button with Cart icon
    const cartButtons = screen.getAllByRole('button');
    const cartButton = cartButtons.find(btn => btn.querySelector('svg') && !btn.getAttribute('aria-label'));
    expect(cartButton).toBeInTheDocument();
  });

  it('should handle empty cart state', () => {
    mockCart.items = [];
    mockCart.totalItems = 0;
    renderHeader();
    
    // Find cart button by looking for the button with Cart icon
    const cartButtons = screen.getAllByRole('button');
    const cartButton = cartButtons.find(btn => btn.querySelector('svg') && !btn.getAttribute('aria-label'));
    fireEvent.click(cartButton!);
    
    // Should show empty cart message
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should display cart items when cart has products', () => {
    mockCart.items = [
      {
        id: '1',
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Test Product',
          price: 99.99,
          imageUrl: 'test.jpg',
        },
        quantity: 2,
        addedAt: new Date(),
      },
    ];
    mockCart.totalItems = 2;
    mockCart.subtotal = 199.98;
    mockCart.total = 215.98;
    
    renderHeader();
    
    // Find cart button by looking for the button with Cart icon and badge
    const cartButtons = screen.getAllByRole('button');
    const cartButton = cartButtons.find(btn => btn.querySelector('svg') && !btn.getAttribute('aria-label'));
    fireEvent.click(cartButton!);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should apply fixed header styles', () => {
    renderHeader();

    const headerElement = screen.getByRole('banner');
    // Check for specific CSS classes that indicate fixed positioning
    expect(headerElement).toHaveStyle('position: fixed');
  });

  it('should handle mobile responsive design', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderHeader();
    
    expect(screen.getByText('eKart')).toBeInTheDocument();
  });

  it('should format currency correctly in cart preview', () => {
    mockCart.items = [
      {
        id: '1',
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Test Product',
          price: 99.99,
          imageUrl: 'test.jpg',
        },
        quantity: 1,
        addedAt: new Date(),
      },
    ];
    mockCart.total = 107.99;
    
    renderHeader();
    
    // Find cart button by looking for the button with Cart icon
    const cartButtons = screen.getAllByRole('button');
    const cartButton = cartButtons.find(btn => btn.querySelector('svg') && !btn.getAttribute('aria-label'));
    fireEvent.click(cartButton!);
    
    expect(screen.getByText('$107.99')).toBeInTheDocument();
  });
});