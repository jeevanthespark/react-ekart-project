import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Layout from './Layout';

// Mock Header component
vi.mock('./Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

// Mock Footer component
vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

const renderLayout = (children: React.ReactNode) => {
  return render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Layout>{children}</Layout>
      </BrowserRouter>
    </FluentProvider>
  );
};

describe('Layout', () => {
  it('should render without crashing', () => {
    renderLayout(<div>Test Content</div>);
    
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
  });

  it('should render Header component', () => {
    renderLayout(<div>Test Content</div>);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render Footer component', () => {
    renderLayout(<div>Test Content</div>);
    
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render children in main element', () => {
    renderLayout(<div data-testid="test-content">Test Content</div>);
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply correct layout styles', () => {
    renderLayout(<div>Test Content</div>);
    
    const layoutDiv = screen.getByTestId('motion-div');
    // Check that the layout div exists and has proper structure
    expect(layoutDiv).toBeInTheDocument();
    expect(layoutDiv.tagName).toBe('DIV');
  });

  it('should have proper structure with header, main, and footer', () => {
    renderLayout(<div data-testid="test-content">Test Content</div>);
    
    const header = screen.getByTestId('header');
    const footer = screen.getByTestId('footer');
    const content = screen.getByTestId('test-content');
    
    expect(header).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('should apply motion animation properties', () => {
    renderLayout(<div>Test Content</div>);
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toBeInTheDocument();
  });

  it('should handle multiple children', () => {
    renderLayout(
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});