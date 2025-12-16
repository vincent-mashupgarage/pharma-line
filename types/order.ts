/**
 * Order Types
 * Types for order management, checkout, and order history
 */

// Order status workflow
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Payment status
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

// Payment methods supported
export type PaymentMethod = 'cod' | 'gcash' | 'credit_card' | 'debit_card';

// Shipping address interface
export interface ShippingAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
}

// Order item (snapshot of product at time of purchase)
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null; // Can be null if product deleted
  product_name: string;
  product_sku: string;
  product_generic_name?: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  total_price: number;
  prescription_id?: string;
  created_at: string;
  product?: {
    images: {
      url: string;
      alt: string;
    }[];
  };
}

// Order interface
export interface Order {
  id: string;
  order_number: string;
  user_id?: string;

  // Customer information (snapshot)
  customer_name: string;
  customer_email: string;
  customer_phone: string;

  // Shipping address
  delivery_address_line1: string;
  delivery_address_line2?: string;
  delivery_city: string;
  delivery_province: string;
  delivery_postal_code: string;

  // Order totals
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  delivery_fee: number;
  total: number;

  // Status
  status: OrderStatus;
  payment_method?: PaymentMethod;
  payment_status: PaymentStatus;

  // Flags
  has_prescription_items: boolean;
  requires_prescription_verification: boolean;

  // Metadata
  notes?: string;
  created_at: string;
  updated_at: string;

  // Relations (optional, loaded with joins)
  items?: OrderItem[];
}

// Checkout form data
export interface CheckoutFormData {
  // Customer information
  customer_name: string;
  customer_email: string;
  customer_phone: string;

  // Shipping address
  shipping_address: ShippingAddress;

  // Payment
  payment_method: PaymentMethod;

  // Notes
  notes?: string;
}

// Create order payload
export interface CreateOrderPayload extends CheckoutFormData {
  // Cart will be read from context
  // Prescription uploads handled separately
}

// Order summary for display
export interface OrderSummary {
  order_number: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  item_count: number;
}
