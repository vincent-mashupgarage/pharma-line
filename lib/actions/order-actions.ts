/**
 * Order Server Actions
 *
 * Server-side functions for order management:
 * - Create orders from cart
 * - Fetch user orders
 * - Get order details
 */

'use server';

import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CreateOrderPayload, Order, ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXX (e.g., ORD-20250101-A1B2)
 */
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Create order from checkout data
 */
export async function createOrder(
  formData: CreateOrderPayload,
  cartData: {
    items: Array<{
      product_id: string;
      product_name: string;
      product_sku: string;
      product_generic_name?: string;
      quantity: number;
      unit_price: number;
      discount_amount: number;
      total_price: number;
      requires_prescription: boolean;
    }>;
    subtotal: number;
    tax_amount: number;
    delivery_fee: number;
    total: number;
    has_prescription_items: boolean;
  }
): Promise<ApiResponse<{ order_id: string; order_number: string }>> {
  try {
    const supabase = await createServerClient();

    // Get current user (optional - can be guest checkout)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Validate cart is not empty
    if (!cartData.items || cartData.items.length === 0) {
      return {
        success: false,
        error: 'Cart is empty. Please add items before checking out.',
      };
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,

        // Customer info
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,

        // Shipping address
        delivery_address_line1: formData.shipping_address.address_line1,
        delivery_address_line2: formData.shipping_address.address_line2 || null,
        delivery_city: formData.shipping_address.city,
        delivery_province: formData.shipping_address.province,
        delivery_postal_code: formData.shipping_address.postal_code,

        // Order totals
        subtotal: cartData.subtotal,
        discount_amount: 0, // Coupons not implemented yet
        tax_amount: cartData.tax_amount,
        delivery_fee: cartData.delivery_fee,
        total: cartData.total,

        // Status
        status: 'pending',
        payment_method: formData.payment_method,
        payment_status: formData.payment_method === 'cod' ? 'unpaid' : 'unpaid',

        // Flags
        has_prescription_items: cartData.has_prescription_items,
        requires_prescription_verification: cartData.has_prescription_items,

        // Notes
        notes: formData.notes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return {
        success: false,
        error: 'Failed to create order. Please try again.',
      };
    }

    // Create order items
    // Note: product_id set to null because cart uses mock data string IDs
    // All product info is stored in snapshot fields (name, sku, etc.)
    const orderItems = cartData.items.map((item) => ({
      order_id: order.id,
      product_id: null, // Set to null - we have full product snapshot
      product_name: item.product_name,
      product_sku: item.product_sku,
      product_generic_name: item.product_generic_name || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_amount: item.discount_amount,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Rollback: delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      return {
        success: false,
        error: 'Failed to create order items. Please try again.',
      };
    }

    // Revalidate orders page
    revalidatePath('/orders');

    return {
      success: true,
      data: {
        order_id: order.id,
        order_number: order.order_number,
      },
      message: 'Order placed successfully!',
    };
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Get user's orders (order history)
 */
export async function getUserOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        error: 'Failed to fetch orders',
      };
    }

    return {
      success: true,
      data: orders as Order[],
    };
  } catch (error) {
    console.error('Unexpected error fetching orders:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Get single order by ID with items
 */
export async function getOrderById(
  orderId: string
): Promise<ApiResponse<Order & { items: any[] }>> {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Build query
    let query = supabase
      .from('orders')
      .select(
        `
        *,
        items:order_items(*, product:products(*))
      `
      )
      .eq('id', orderId);

    // If user is authenticated, filter by user_id
    // Otherwise, allow guest orders (no user_id filter)
    if (user) {
      query = query.eq('user_id', user.id);
    }

    const { data: order, error } = await query.single();

    if (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        error: 'Order not found',
      };
    }

    return {
      success: true,
      data: order as Order & { items: any[] },
    };
  } catch (error) {
    console.error('Unexpected error fetching order:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Get order by order number (for confirmation page)
 * Uses Admin Client to bypass RLS for guest checkout success page
 */
export async function getOrderByNumber(
  orderNumber: string
): Promise<ApiResponse<Order & { items: any[] }>> {
  try {
    const supabase = createAdminClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        items:order_items(*, product:products(*))
      `
      )
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        error: 'Order not found',
      };
    }

    return {
      success: true,
      data: order as Order & { items: any[] },
    };
  } catch (error) {
    console.error('Unexpected error fetching order:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
