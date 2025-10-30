// Formatting utilities
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (
  value: number,
  locale = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatDate = (
  date: Date,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Array utilities
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    return {
      ...groups,
      [value]: [...(groups[value] || []), item],
    };
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const isValidPostalCode = (postalCode: string, country = 'US'): boolean => {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
  };
  
  const pattern = patterns[country as keyof typeof patterns];
  return pattern ? pattern.test(postalCode) : true;
};

// DOM utilities
export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({ top: 0, behavior });
};

export const scrollToElement = (
  elementId: string,
  behavior: ScrollBehavior = 'smooth'
): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior });
  }
};

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage quota exceeded or other errors
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle errors
    }
  },
  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Handle errors
    }
  },
};

// Debounce utility
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Random utilities
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Price calculation utilities
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const calculateTax = (amount: number, taxRate: number): number => {
  return Number((amount * taxRate).toFixed(2));
};

export const calculateTotal = (
  subtotal: number,
  tax: number,
  shipping: number
): number => {
  return Number((subtotal + tax + shipping).toFixed(2));
};
