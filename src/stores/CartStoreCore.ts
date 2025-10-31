import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface CartStore {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isItemInCart: (productId: string) => boolean;
}

const TAX_RATE = 0.08; // 8% tax
const SHIPPING_RATE = 10.0; // $10 flat shipping
const FREE_SHIPPING_THRESHOLD = 75.0; // Free shipping over $75

const createInitialCart = (): Cart => ({
  id: uuidv4(),
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  currency: 'USD',
  updatedAt: new Date(),
});

const calculateCartTotals = (items: CartItem[]): Omit<Cart, 'id' | 'items' | 'currency' | 'updatedAt'> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (totalItems === 0) {
    return { totalItems: 0, subtotal: 0, tax: 0, shipping: 0, total: 0 };
  }

  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const total = subtotal + tax + shipping;

  return {
    totalItems,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: createInitialCart(),
      addItem: (product: Product, quantity = 1) => {
        set(state => {
          const existingItemIndex = state.cart.items.findIndex(item => item.productId === product.id);
          let newItems: CartItem[];
          if (existingItemIndex >= 0) {
            newItems = state.cart.items.map((item, index) => index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item);
          } else {
            const newItem: CartItem = { id: uuidv4(), productId: product.id, product, quantity, addedAt: new Date() };
            newItems = [...state.cart.items, newItem];
          }
          const totals = calculateCartTotals(newItems);
          return { cart: { ...state.cart, items: newItems, ...totals, updatedAt: new Date() } };
        });
      },
      removeItem: (productId: string) => {
        set(state => {
          const newItems = state.cart.items.filter(item => item.productId !== productId);
          const totals = calculateCartTotals(newItems);
          return { cart: { ...state.cart, items: newItems, ...totals, updatedAt: new Date() } };
        });
      },
      updateItemQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set(state => {
          const newItems = state.cart.items.map(item => item.productId === productId ? { ...item, quantity } : item);
          const totals = calculateCartTotals(newItems);
          return { cart: { ...state.cart, items: newItems, ...totals, updatedAt: new Date() } };
        });
      },
      clearCart: () => {
        set({ cart: createInitialCart() });
      },
      getItemQuantity: (productId: string) => {
        const state = get();
        const item = state.cart.items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
      },
      isItemInCart: (productId: string) => {
        const state = get();
        return state.cart.items.some(item => item.productId === productId);
      },
    }),
    { name: 'ekart-cart-storage', version: 1 }
  )
);

export const useCart = () => {
  const store = useCartStore();
  return {
    cart: store.cart,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateItemQuantity: store.updateItemQuantity,
    clearCart: store.clearCart,
    getItemQuantity: store.getItemQuantity,
    isItemInCart: store.isItemInCart,
  };
};
