/**
 * Cart Types
 * Shopping cart state management types
 */

import { Product } from './product';

// Single item in the shopping cart
export interface CartItem {
  id: string;
  product_id: string;
  product: Product; // Denormalized for immediate display
  quantity: number;
  unit_price: number; // Price at time of adding (protects against price changes)
  discount_amount: number;
  total_price: number; // (unit_price - discount) * quantity
  prescription_item_id?: string; // Link to prescription if Rx item
}

// Full cart structure
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number; // Sum of item total_prices
  discount_amount: number; // Cart-level discounts (coupons)
  tax_amount: number; // VAT/tax (12% in Philippines)
  delivery_fee: number;
  total: number; // Final amount to pay
  has_prescription_items: boolean; // Flag for checkout validation
  item_count: number; // Total quantity across all items
  coupon_code?: string;
}

// Payload for adding item to cart
export interface AddToCartPayload {
  product_id: string;
  quantity: number;
  prescription_item_id?: string;
}

// Payload for updating cart item
export interface UpdateCartItemPayload {
  product_id: string;
  quantity: number;
}

// Cart context actions
export interface CartActions {
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

// Combined cart state and actions for context
export interface CartState extends Cart, CartActions {}

// Cart summary for display
export interface CartSummary {
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  delivery_fee: number;
  total: number;
  item_count: number;
  has_prescription_items: boolean;
}

// Tax and fee constants
export const TAX_RATE = 0.12; // 12% VAT
export const DELIVERY_FEE = 50; // ₱50 flat delivery fee
export const FREE_DELIVERY_THRESHOLD = 1000; // Free delivery for orders over ₱1000
