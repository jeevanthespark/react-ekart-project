import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import CheckoutPage from './CheckoutPage';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Cart mocks
const mockClearCart = vi.fn();
const populatedCart = {
  items: [
    {
      id: '1',
      productId: 'prod1',
      product: {
        id: 'prod1',
        name: 'Test Product',
        price: 50,
        imageUrl: 'https://example.com/image.jpg',
      },
      quantity: 2,
      addedAt: new Date(),
    },
    {
      id: '2',
      productId: 'prod2',
      product: {
        id: 'prod2',
        name: 'Another Product',
        price: 25,
        imageUrl: 'https://example.com/image2.jpg',
      },
      quantity: 1,
      addedAt: new Date(),
    },
  ],
  totalItems: 3,
  subtotal: 125,
  tax: 10,
  shipping: 0,
  total: 135,
};

vi.mock('../stores/CartStore', () => ({
  useCart: () => ({
    cart: populatedCart,
    clearCart: mockClearCart,
  }),
}));

// Utils mocks just reuse real validation for meaningful coverage except currency
vi.mock('../utils', async () => {
  const actual = await vi.importActual<typeof import('../utils')>('../utils');
  return {
    ...actual,
    formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
  };
});

const renderCheckout = () =>
  render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    </FluentProvider>
  );

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and order summary with items', () => {
    renderCheckout();
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
    // Per-item price appears in details; ensure subtotal present for currency formatting
    expect(screen.getByText('$125.00')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$135.00')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', () => {
    renderCheckout();
    const placeOrder = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrder);
    // Synchronous because validateForm sets errors immediately
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getAllByText('First name is required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Last name is required').length).toBeGreaterThan(0);
    expect(screen.getByText('Address is required')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderCheckout();
    const email = screen.getByPlaceholderText('Enter your email address');
    fireEvent.change(email, { target: { value: 'invalid' } });
    const placeOrder = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrder);
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates postal code format', async () => {
    renderCheckout();
    const postal = screen.getByPlaceholderText('Postal code');
    fireEvent.change(postal, { target: { value: 'abc' } });
    const placeOrder = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrder);
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid postal code')).toBeInTheDocument();
    });
  });

  it('allows filling form and placing order (success state)', async () => {
    renderCheckout();

    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), { target: { value: 'john@doe.com' } });
    fireEvent.change(screen.getByPlaceholderText('First name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Shipping first name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Shipping last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Street address'), { target: { value: '1 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'NYC' } });
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('Postal code'), { target: { value: '10001' } });
    fireEvent.change(screen.getByPlaceholderText('Name on card'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), { target: { value: '4111111111111111' } });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/30' } });
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled();
      expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
    });
  });

  it('redirects when cart is empty', async () => {
    vi.resetModules();
    // Remock with empty cart
    vi.doMock('../stores/CartStore', () => ({
      useCart: () => ({
        cart: { items: [], totalItems: 0, subtotal: 0, tax: 0, shipping: 0, total: 0 },
        clearCart: mockClearCart,
      }),
    }));
    const { default: Page } = await import('./CheckoutPage');
    render(
      <FluentProvider theme={webLightTheme}>
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      </FluentProvider>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
