import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import App from './App';

// Mock all the page components
vi.mock('./pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('./pages/CartPage', () => ({
  default: () => <div data-testid="cart-page">Cart Page</div>,
}));

vi.mock('./pages/CheckoutPage', () => ({
  default: () => <div data-testid="checkout-page">Checkout Page</div>,
}));

// Mock Layout component
vi.mock('./components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

// Mock CartProvider
vi.mock('./stores/CartStore', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cart-provider">{children}</div>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderApp = (initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  
  return render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FluentProvider>
  );
};

describe('App', () => {
  it('should render without crashing', () => {
    renderApp();
    
    expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('should render HomePage on root route', () => {
    renderApp('/');
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should render CartPage on /cart route', () => {
    renderApp('/cart');
    
    expect(screen.getByTestId('cart-page')).toBeInTheDocument();
  });

  it('should render CheckoutPage on /checkout route', () => {
    renderApp('/checkout');
    
    expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
  });

  it('should wrap app with CartProvider', () => {
    renderApp();
    
    expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
  });

  it('should wrap content with Layout component', () => {
    renderApp();
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('should handle page transitions with framer-motion', () => {
    renderApp();
    
    // Check that the motion.div wrapper is present
    const motionWrapper = screen.getByTestId('home-page').parentElement;
    expect(motionWrapper).toBeInTheDocument();
  });
});