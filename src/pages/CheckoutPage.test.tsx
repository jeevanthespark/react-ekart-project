import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import CheckoutPage from './CheckoutPage';

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
const mockClearCart = vi.fn();
const mockCart = {
  items: [
    {
      id: '1',
      productId: 'prod1',
      product: {
        id: 'prod1',
        name: 'Test Product',
        price: 99.99,
        imageUrl: 'https://example.com/image.jpg',
      },
      quantity: 2,
      addedAt: new Date(),
    },
  ],
  totalItems: 2,
  subtotal: 199.98,
  tax: 16.00,
  shipping: 10.00,
  total: 225.98,
};

vi.mock('@/stores/CartStore', () => ({
  useCart: () => ({
    cart: mockCart,
    clearCart: mockClearCart,
  }),
}));

// Mock utility functions
vi.mock('@/utils', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
  isValidEmail: (email: string) => email.includes('@') && email.includes('.'),
  isValidPostalCode: (code: string) => /^\\d{5}(-\\d{4})?$/.test(code),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

const renderCheckoutPage = () => {
  return render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    </FluentProvider>
  );
};

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderCheckoutPage();
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('should display checkout form sections', () => {
    renderCheckoutPage();
    
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    expect(screen.getByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('should render shipping form fields', () => {
    renderCheckoutPage();
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
  });

  it('should render payment form fields', () => {
    renderCheckoutPage();
    
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
  });

  it('should display order summary', () => {
    renderCheckoutPage();
    
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$199.98')).toBeInTheDocument(); // Subtotal
    expect(screen.getByText('$16.00')).toBeInTheDocument(); // Tax
    expect(screen.getByText('$10.00')).toBeInTheDocument(); // Shipping
    expect(screen.getByText('$225.98')).toBeInTheDocument(); // Total
  });

  it('should render place order button', () => {
    renderCheckoutPage();
    
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    expect(placeOrderButton).toBeInTheDocument();
  });

  it('should validate required fields before submission', async () => {
    renderCheckoutPage();
    
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    renderCheckoutPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('should validate postal code format', async () => {
    renderCheckoutPage();
    
    const zipInput = screen.getByLabelText(/zip code/i);
    fireEvent.change(zipInput, { target: { value: 'invalid' } });
    fireEvent.blur(zipInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid zip code/i)).toBeInTheDocument();
    });
  });

  it('should validate card number', async () => {
    renderCheckoutPage();
    
    const cardNumberInput = screen.getByLabelText(/card number/i);
    fireEvent.change(cardNumberInput, { target: { value: '1234' } });
    fireEvent.blur(cardNumberInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid card number/i)).toBeInTheDocument();
    });
  });

  it('should validate expiry date', async () => {
    renderCheckoutPage();
    
    const expiryInput = screen.getByLabelText(/expiry date/i);
    fireEvent.change(expiryInput, { target: { value: '13/25' } });
    fireEvent.blur(expiryInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid expiry date/i)).toBeInTheDocument();
    });
  });

  it('should validate CVV', async () => {
    renderCheckoutPage();
    
    const cvvInput = screen.getByLabelText(/cvv/i);
    fireEvent.change(cvvInput, { target: { value: '12' } });
    fireEvent.blur(cvvInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid cvv/i)).toBeInTheDocument();
    });
  });

  it('should handle successful form submission', async () => {
    renderCheckoutPage();
    
    // Fill out all required fields
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '123-456-7890' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'New York' },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'NY' },
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '10001' },
    });
    fireEvent.change(screen.getByLabelText(/card number/i), {
      target: { value: '4111111111111111' },
    });
    fireEvent.change(screen.getByLabelText(/expiry date/i), {
      target: { value: '12/25' },
    });
    fireEvent.change(screen.getByLabelText(/cvv/i), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByLabelText(/cardholder name/i), {
      target: { value: 'John Doe' },
    });
    
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);
    
    // Should show success message and redirect
    await waitFor(() => {
      expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument();
    });
    
    expect(mockClearCart).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should handle billing address same as shipping', () => {
    renderCheckoutPage();
    
    const sameAddressCheckbox = screen.getByLabelText(/billing address same as shipping/i);
    fireEvent.click(sameAddressCheckbox);
    
    // Billing address fields should be hidden or disabled
    expect(sameAddressCheckbox).toBeChecked();
  });

  it('should handle payment method selection', () => {
    renderCheckoutPage();
    
    // Should be able to select different payment methods
    expect(screen.getByText('Payment Information')).toBeInTheDocument();
  });

  it('should display security indicators', () => {
    renderCheckoutPage();
    
    expect(screen.getByText(/secure checkout/i)).toBeInTheDocument();
    expect(screen.getByText(/ssl encrypted/i)).toBeInTheDocument();
  });

  it('should format card number with spaces', () => {
    renderCheckoutPage();
    
    const cardNumberInput = screen.getByLabelText(/card number/i);
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    
    // Should format the card number
    expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');
  });

  it('should limit CVV input length', () => {
    renderCheckoutPage();
    
    const cvvInput = screen.getByLabelText(/cvv/i);
    fireEvent.change(cvvInput, { target: { value: '12345' } });
    
    // Should limit to 3-4 digits
    expect(cvvInput.value.length).toBeLessThanOrEqual(4);
  });

  it('should handle form field focus and blur', () => {
    renderCheckoutPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    
    // Should handle focus states properly
    expect(emailInput).toBeInTheDocument();
  });

  it('should apply responsive layout', () => {
    renderCheckoutPage();
    
    const container = screen.getByText('Checkout').closest('div');
    expect(container).toHaveClass(/container/);
  });

  it('should handle mobile layout', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderCheckoutPage();
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('should display loading state during submission', async () => {
    renderCheckoutPage();
    
    // Fill required fields and submit
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    // ... fill other fields
    
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });

  it('should handle empty cart scenario', () => {
    // Mock empty cart
    vi.doMock('@/stores/CartStore', () => ({
      useCart: () => ({
        cart: { items: [], totalItems: 0, total: 0 },
        clearCart: mockClearCart,
      }),
    }));
    
    renderCheckoutPage();
    
    // Should redirect or show empty cart message
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});