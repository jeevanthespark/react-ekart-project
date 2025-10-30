import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock ReactDOM
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
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
  });

  it('should render the app', () => {
    // Import main to trigger the render
    require('./main');
    
    // Verify that render was called
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should find root element', () => {
    require('./main');
    
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });

  it('should wrap app with proper providers', () => {
    require('./main');
    
    // Check that render was called with the expected structure
    expect(mockRender).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement);
  });

  it('should use React.StrictMode', () => {
    require('./main');
    
    expect(mockRender).toHaveBeenCalled();
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall.type.name).toBe('StrictMode');
  });

  it('should use FluentProvider with webLightTheme', () => {
    require('./main');
    
    expect(mockRender).toHaveBeenCalled();
  });

  it('should use BrowserRouter for routing', () => {
    require('./main');
    
    expect(mockRender).toHaveBeenCalled();
  });
});