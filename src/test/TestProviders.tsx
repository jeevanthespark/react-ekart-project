import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

export const TestProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>
    <BrowserRouter>{children}</BrowserRouter>
  </FluentProvider>
);
