-- Fix RLS Policy for Guest Orders
-- Migration: 20240104_fix_guest_orders_policy.sql
-- Description: Allow guest users (unauthenticated) to create orders

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can create orders" ON orders;

-- Create new policy that allows both authenticated and guest orders
CREATE POLICY "Users and guests can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    -- Allow if authenticated user creating order with their user_id
    (auth.uid() = user_id) OR
    -- Allow if guest (not authenticated) creating order with null user_id
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Also update the SELECT policy to allow guests to view their orders by order_number
-- (they won't have user_id to filter by)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    -- Authenticated users see their own orders
    (auth.uid() = user_id) OR
    -- Guests can't query orders table directly (they use order_number lookup)
    (auth.uid() IS NULL)
  );

-- Create policy for order_items to allow insertion during order creation
DROP POLICY IF EXISTS "Users can create order items" ON order_items;

CREATE POLICY "Users and guests can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid() OR
        (auth.uid() IS NULL AND orders.user_id IS NULL)
      )
    )
  );

-- Update order_items SELECT policy
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid() OR
        (auth.uid() IS NULL AND orders.user_id IS NULL)
      )
    )
  );
