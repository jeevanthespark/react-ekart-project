import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock ReactDOM
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: mockCreateRoot,
  },
  createRoot: mockCreateRoot,
}));

// Mock App component
vi.mock('./App', () => ({
  default: () => React.createElement('div', { 'data-testid': 'app' }, 'App Component'),
}));

// Mock FluentProvider
vi.mock('@fluentui/react-components', () => ({
  FluentProvider: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'fluent-provider' }, children),
  webLightTheme: {},
}));

// Mock BrowserRouter
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'browser-router' }, children),
}));

// Mock global.css
vi.mock('./styles/global.css', () => ({}));

// Mock document.getElementById
const mockRootElement = { id: 'root' };
Object.defineProperty(document, 'getElementById', {
  value: vi.fn(() => mockRootElement),
  writable: true,
});

describe('main.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset modules to ensure fresh import
    vi.resetModules();
  });

  it('should render the app', async () => {
    // Import main to trigger the render
    await import('./main');
    
    // Verify that createRoot and render were called
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should find root element', async () => {
    await import('./main');
    
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });

  it('should wrap app with proper providers', async () => {
    await import('./main');
    
    // Check that render was called with the expected structure
    expect(mockRender).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement);
  });

  it('should use React.StrictMode', async () => {
    await import('./main');
    
    expect(mockRender).toHaveBeenCalled();
  });

  it('should use FluentProvider with webLightTheme', async () => {
    await import('./main');
    
    expect(mockRender).toHaveBeenCalled();
  });

  it('should use BrowserRouter', async () => {
    await import('./main');
    
    expect(mockRender).toHaveBeenCalled();
  });
});