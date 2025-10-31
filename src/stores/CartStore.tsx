/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, ReactNode } from 'react';
import { useCartStore, useCart as useCartCore } from './CartStoreCore';

// Context for future extension (kept minimal to satisfy react-refresh rule)
interface CartContextType {}
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue: CartContextType = {};
  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

// Re-export hook so consumers don't break
export const useCart = () => useCartCore();
export { useCartStore };
