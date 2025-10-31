// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  addedAt: Date;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customer: Customer;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Filter and Sort Types
export interface ProductFilters {
  category?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  brand?: string[];
  tags?: string[];
  search?: string;
}

export type SortOption =
  | 'relevance'
  | 'price_low_to_high'
  | 'price_high_to_low'
  | 'rating'
  | 'newest'
  | 'popularity';

export interface ProductSearchParams {
  filters: ProductFilters;
  sort: SortOption;
  page: number;
  limit: number;
}

// UI Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}