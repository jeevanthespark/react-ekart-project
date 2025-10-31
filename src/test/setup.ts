import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(() => []),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock Fluent UI Components globally
// Typed mock implementations for Fluent UI components
interface CommonProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}
interface InputProps extends CommonProps {
  value?: string;
  onChange?: (ev: unknown, data: { value: string }) => void;
}
interface DropdownProps extends CommonProps {
  value?: string;
  onOptionSelect?: (ev: unknown, data: { optionValue: string }) => void;
  placeholder?: string;
}
interface OptionProps extends CommonProps {
  value?: string;
}
interface FieldProps extends CommonProps {
  label?: string;
  validationMessage?: string;
}
vi.mock('@fluentui/react-components', async () => {
  const actual = await vi.importActual<typeof import('@fluentui/react-components')>('@fluentui/react-components');
  return {
    ...actual,
    Text: ({ children, className, ...props }: CommonProps) => React.createElement('span', { className, ...(props as Record<string, unknown>) }, children),
    Button: ({ children, className, onClick, disabled, ...props }: CommonProps & { onClick?: () => void; disabled?: boolean }) => 
      React.createElement('button', { className, onClick, disabled, ...(props as Record<string, unknown>) }, children),
    Card: ({ children, className, ...props }: CommonProps) => React.createElement('div', { className, ...(props as Record<string, unknown>) }, children),
    Input: ({ className, value, onChange, ...props }: InputProps) => 
      React.createElement('input', { 
        className,
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e, { value: e.target.value }),
        ...(props as Record<string, unknown>)
      }),
    Field: ({ children, label, validationMessage, ...props }: FieldProps) => 
      React.createElement('div', { ...(props as Record<string, unknown>) },
        label && React.createElement('label', {}, label),
        children,
        validationMessage && React.createElement('span', { className: 'error-message' }, validationMessage)
      ),
    Dropdown: ({ children, value, onOptionSelect, placeholder, ...props }: DropdownProps) => 
      React.createElement('select', { 
        value,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onOptionSelect?.(e, { optionValue: e.target.value }),
        ...(props as Record<string, unknown>)
      },
        React.createElement('option', { value: '' }, placeholder),
        children
      ),
    Option: ({ children, value, ...props }: OptionProps) => React.createElement('option', { value, ...(props as Record<string, unknown>) }, children),
    Divider: ({ className, ...props }: CommonProps) => React.createElement('hr', { className, ...(props as Record<string, unknown>) }),
    makeStyles: () => () => ({}),
    tokens: {},
  };
});

// Mock Fluent UI Icons globally
vi.mock('@fluentui/react-icons', () => ({
  Payment24Regular: () => React.createElement('span', { 'data-testid': 'payment-icon' }, 'Payment'),
  Shield24Regular: () => React.createElement('span', { 'data-testid': 'shield-icon' }, 'Shield'),
  CheckmarkCircle24Regular: () => React.createElement('span', { 'data-testid': 'checkmark-icon' }, 'Checkmark'),
  Filter24Regular: () => React.createElement('span', { 'data-testid': 'filter-icon' }, 'Filter'),
  Dismiss24Regular: () => React.createElement('span', { 'data-testid': 'dismiss-icon' }, 'Dismiss'),
  ArrowLeft24Regular: () => React.createElement('span', { 'data-testid': 'arrow-left-icon' }, 'ArrowLeft'),
  ShoppingBag24Regular: () => React.createElement('span', { 'data-testid': 'shopping-bag-icon' }, 'ShoppingBag'),
  Home24Regular: () => React.createElement('span', { 'data-testid': 'home-icon' }, 'Home'),
  Star24Filled: () => React.createElement('span', { 'data-testid': 'star-filled-icon' }, 'StarFilled'),
  Star24Regular: () => React.createElement('span', { 'data-testid': 'star-regular-icon' }, 'StarRegular'),
  ShoppingCart24Regular: () => React.createElement('span', { 'data-testid': 'shopping-cart-icon' }, 'ShoppingCart'),
  Cart24Regular: () => React.createElement('span', { 'data-testid': 'cart-icon' }, 'Cart'),
  Search24Regular: () => React.createElement('span', { 'data-testid': 'search-icon' }, 'Search'),
  Grid24Regular: () => React.createElement('span', { 'data-testid': 'grid-icon' }, 'Grid'),
  List24Regular: () => React.createElement('span', { 'data-testid': 'list-icon' }, 'List'),
  Delete24Regular: () => React.createElement('span', { 'data-testid': 'delete-icon' }, 'Delete'),
  Add24Regular: () => React.createElement('span', { 'data-testid': 'add-icon' }, 'Add'),
  Remove24Regular: () => React.createElement('span', { 'data-testid': 'remove-icon' }, 'Remove'),
  Person24Regular: () => React.createElement('span', { 'data-testid': 'person-icon' }, 'Person'),
}));

// Mock Framer Motion globally with typed props
interface MotionElementProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MotionElementProps) => React.createElement('div', { ...(props as Record<string, unknown>) }, children),
    form: ({ children, ...props }: MotionElementProps) => React.createElement('form', { ...(props as Record<string, unknown>) }, children),
  },
}));

// Extend expect with custom matchers if needed
expect.extend({});
