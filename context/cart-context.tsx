/**
 * Cart Context
 * Manages shopping cart state with localStorage persistence
 *
 * Features:
 * - Add/remove items
 * - Update quantities
 * - Auto-calculate totals (subtotal, tax, delivery, total)
 * - localStorage persistence
 * - Hydration check to prevent SSR mismatch
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  Cart,
  CartItem,
  CartState,
  Product,
  TAX_RATE,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  calculatePriceInfo,
} from '@/types';

const CART_STORAGE_KEY = 'pharma-line-cart';

// Initial empty cart
const initialCart: Cart = {
  id: 'cart-default',
  items: [],
  subtotal: 0,
  discount_amount: 0,
  tax_amount: 0,
  delivery_fee: 0,
  total: 0,
  has_prescription_items: false,
  item_count: 0,
};

// Create context
const CartContext = createContext<CartState | undefined>(undefined);

// Cart Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsedCart = JSON.parse(stored);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        // If parsing fails, start with empty cart
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // Calculate cart totals from items
  const calculateTotals = useCallback((items: CartItem[]): Partial<Cart> => {
    // Subtotal = sum of all item total_prices
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);

    // Check if cart has prescription items
    const has_prescription_items = items.some((item) => item.product.requires_prescription);

    // Tax = 12% VAT
    const tax_amount = subtotal * TAX_RATE;

    // Delivery fee - free if subtotal >= 1000, otherwise flat fee
    const delivery_fee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : items.length > 0 ? DELIVERY_FEE : 0;

    // Total = subtotal + tax + delivery
    const total = subtotal + tax_amount + delivery_fee;

    // Total item count
    const item_count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      tax_amount,
      delivery_fee,
      total,
      has_prescription_items,
      item_count,
      discount_amount: 0, // Cart-level discounts (coupons) - not implemented yet
    };
  }, []);

  // Add item to cart
  const addItem = useCallback(
    (product: Product, quantity: number) => {
      setCart((prev) => {
        const existingIndex = prev.items.findIndex((item) => item.product_id === product.id);
        let newItems: CartItem[];

        if (existingIndex >= 0) {
          // Update existing item quantity
          newItems = prev.items.map((item, i) => {
            if (i === existingIndex) {
              const newQuantity = item.quantity + quantity;
              const priceInfo = calculatePriceInfo(product);
              const discountAmount = priceInfo.savings * newQuantity;
              const totalPrice = priceInfo.final_price * newQuantity;

              return {
                ...item,
                quantity: newQuantity,
                discount_amount: discountAmount,
                total_price: totalPrice,
              };
            }
            return item;
          });
        } else {
          // Add new item
          const priceInfo = calculatePriceInfo(product);
          const discountAmount = priceInfo.savings * quantity;
          const totalPrice = priceInfo.final_price * quantity;

          const newItem: CartItem = {
            id: `cart-item-${Date.now()}-${product.id}`,
            product_id: product.id,
            product,
            quantity,
            unit_price: product.base_price,
            discount_amount: discountAmount,
            total_price: totalPrice,
          };
          newItems = [...prev.items, newItem];
        }

        return {
          ...prev,
          items: newItems,
          ...calculateTotals(newItems),
        };
      });
    },
    [calculateTotals]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const newItems = prev.items.filter((item) => item.product_id !== productId);
        return {
          ...prev,
          items: newItems,
          ...calculateTotals(newItems),
        };
      });
    },
    [calculateTotals]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setCart((prev) => {
        const newItems = prev.items.map((item) => {
          if (item.product_id === productId) {
            const priceInfo = calculatePriceInfo(item.product);
            const discountAmount = priceInfo.savings * quantity;
            const totalPrice = priceInfo.final_price * quantity;

            return {
              ...item,
              quantity,
              discount_amount: discountAmount,
              total_price: totalPrice,
            };
          }
          return item;
        });

        return {
          ...prev,
          items: newItems,
          ...calculateTotals(newItems),
        };
      });
    },
    [calculateTotals, removeItem]
  );

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart(initialCart);
  }, []);

  // Get quantity of specific product in cart
  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = cart.items.find((item) => item.product_id === productId);
      return item ? item.quantity : 0;
    },
    [cart.items]
  );

  // Check if product is in cart
  const isInCart = useCallback(
    (productId: string): boolean => {
      return cart.items.some((item) => item.product_id === productId);
    },
    [cart.items]
  );

  // Don't render children until hydrated (prevents SSR mismatch)
  if (!isHydrated) {
    return null; // or a loading skeleton
  }

  return (
    <CartContext.Provider
      value={{
        ...cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
