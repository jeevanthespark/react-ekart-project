import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { TestProviders } from './TestProviders';

// Custom render function that wraps components with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}


export const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialRoute = '/', ...renderOptions } = options || {};
  
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }
  
  return render(ui, { wrapper: TestProviders, ...renderOptions });
};

// Re-exporting selective helpers instead of export * to satisfy react-refresh rule
export { cleanup, fireEvent, screen, within } from '@testing-library/react';
export { customRender as render };


// NOTE: Non-component test helpers moved to utilsData.ts to satisfy react-refresh/only-export-components
// Import here only if needed locally (currently not). Test files should import from '@/test/utilsData'
