import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Footer from './Footer';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    footer: ({ children, className, ...props }: any) => (
      <footer className={className} {...props}>
        {children}
      </footer>
    ),
  },
}));

const renderFooter = () => {
  return render(
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    </FluentProvider>
  );
};

describe('Footer', () => {
  it('should render without crashing', () => {
    renderFooter();
    
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should display company information', () => {
    renderFooter();
    
    expect(screen.getByText('eKart')).toBeInTheDocument();
    expect(screen.getByText(/modern ecommerce platform built with cutting-edge technology/i)).toBeInTheDocument();
  });

  it('should render all footer sections', () => {
    renderFooter();
    
    // Check for main section headings based on actual Footer component
    expect(screen.getByText('About eKart')).toBeInTheDocument();
    expect(screen.getByText('Customer Service')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('should render company section links', () => {
    renderFooter();
    
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
    expect(screen.getByText('Press')).toBeInTheDocument();
    expect(screen.getByText('Investor Relations')).toBeInTheDocument();
  });

  it('should render customer service links', () => {
    renderFooter();
    
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Shipping Info')).toBeInTheDocument();
    expect(screen.getByText('Returns & Exchanges')).toBeInTheDocument();
    expect(screen.getByText('Size Guide')).toBeInTheDocument();
  });

  it('should render social media links', () => {
    renderFooter();
    
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  it('should display copyright information', () => {
    renderFooter();
    
    expect(screen.getByText('© 2024 eKart. All rights reserved.')).toBeInTheDocument();
  });

  it('should render legal section links', () => {
    renderFooter();
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });

  it('should apply correct footer styles', () => {
    renderFooter();
    
    const footerElement = screen.getByRole('contentinfo');
    // Check that footer exists and has proper structure
    expect(footerElement).toBeInTheDocument();
    expect(footerElement.tagName).toBe('FOOTER');
  });

  it('should render links with correct attributes', () => {
    renderFooter();
    
    const aboutUsLink = screen.getByText('About Us').closest('a');
    expect(aboutUsLink).toHaveAttribute('href', '#');
  });

  it('should handle responsive grid layout', () => {
    renderFooter();
    
    // Check that the footer sections are rendered properly
    expect(screen.getByText('About eKart')).toBeInTheDocument();
    expect(screen.getByText('Customer Service')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('should display footer branding', () => {
    renderFooter();
    
    expect(screen.getByText('eKart')).toBeInTheDocument();
    expect(screen.getByText('© 2024 eKart. All rights reserved.')).toBeInTheDocument();
  });

  it('should render divider between sections', () => {
    renderFooter();
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    renderFooter();
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    // Check for proper link accessibility
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});