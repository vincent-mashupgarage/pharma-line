-- PharmaLine E-Commerce Row Level Security Policies
-- Migration: 20240103_create_policies.sql
-- Description: Creates RLS policies to secure database access

-- =====================================================
-- PART 1: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 2: PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role has full access to profiles"
  ON profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 3: MANUFACTURERS POLICIES
-- =====================================================

-- Anyone can view active manufacturers (public data)
CREATE POLICY "Anyone can view active manufacturers"
  ON manufacturers FOR SELECT
  USING (is_active = true);

-- Only authenticated users can view all manufacturers
CREATE POLICY "Authenticated users can view all manufacturers"
  ON manufacturers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role can manage manufacturers
CREATE POLICY "Service role can manage manufacturers"
  ON manufacturers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 4: CATEGORIES POLICIES
-- =====================================================

-- Anyone can view active categories (public data)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Service role can manage categories
CREATE POLICY "Service role can manage categories"
  ON categories FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 5: PRODUCTS POLICIES
-- =====================================================

-- Anyone can view active products (public catalog)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Service role can manage products
CREATE POLICY "Service role can manage products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 6: PRODUCT IMAGES POLICIES
-- =====================================================

-- Anyone can view product images (public)
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
      AND products.is_active = true
    )
  );

-- Service role can manage product images
CREATE POLICY "Service role can manage product images"
  ON product_images FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 7: CARTS POLICIES
-- =====================================================

-- Users can view their own cart
CREATE POLICY "Users can view own cart"
  ON carts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cart (first time)
CREATE POLICY "Users can create own cart"
  ON carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart
CREATE POLICY "Users can update own cart"
  ON carts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own cart
CREATE POLICY "Users can delete own cart"
  ON carts FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can manage all carts (for admin & migrations)
CREATE POLICY "Service role can manage all carts"
  ON carts FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 8: CART ITEMS POLICIES
-- =====================================================

-- Users can view items in their own cart
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Users can add items to their own cart
CREATE POLICY "Users can add to own cart"
  ON cart_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Users can update items in their own cart
CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Users can delete items from their own cart
CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- Service role can manage all cart items
CREATE POLICY "Service role can manage all cart items"
  ON cart_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 9: PRESCRIPTIONS POLICIES
-- =====================================================

-- Users can view their own prescriptions
CREATE POLICY "Users can view own prescriptions"
  ON prescriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can upload prescriptions
CREATE POLICY "Users can upload prescriptions"
  ON prescriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending prescriptions
CREATE POLICY "Users can update own pending prescriptions"
  ON prescriptions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Service role can manage all prescriptions (for verification)
CREATE POLICY "Service role can manage all prescriptions"
  ON prescriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 10: ORDERS POLICIES
-- =====================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all orders
CREATE POLICY "Service role can manage all orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 11: ORDER ITEMS POLICIES
-- =====================================================

-- Users can view items in their own orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can create order items (during checkout)
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Service role can manage all order items
CREATE POLICY "Service role can manage all order items"
  ON order_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PART 12: INVENTORY LOGS POLICIES
-- =====================================================

-- Only service role can view inventory logs (admin only)
CREATE POLICY "Service role can view inventory logs"
  ON inventory_logs FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Only service role can manage inventory logs
CREATE POLICY "Service role can manage inventory logs"
  ON inventory_logs FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- COMPLETED
-- =====================================================

-- Row Level Security policies created successfully
-- All tables are now protected with appropriate access controls
--
-- Security Summary:
-- - Public: Products, Categories, Manufacturers (read-only)
-- - User-specific: Carts, Orders, Prescriptions (own data only)
-- - Admin: Service role has full access to all tables
