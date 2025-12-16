-- PharmaLine E-Commerce Database Functions & Triggers
-- Migration: 20240102_create_functions.sql
-- Description: Creates database functions, triggers for business logic automation

-- =====================================================
-- PART 1: UTILITY FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: update_updated_at_column
-- Description: Auto-update updated_at timestamp on row changes
-- Usage: Called by triggers on UPDATE
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 2: AUTH FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: handle_new_user
-- Description: Auto-create profile when user signs up
-- Trigger: After INSERT on auth.users
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PART 3: CART FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: recalculate_cart_totals
-- Description: Recalculate all cart totals (subtotal, tax, delivery, total)
-- Business Logic:
--   - Tax: 12% VAT (Philippine tax rate)
--   - Delivery: ₱50 flat fee, FREE if subtotal >= ₱1000
--   - Checks for prescription items
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION recalculate_cart_totals(cart_uuid UUID)
RETURNS void AS $$
DECLARE
  v_subtotal DECIMAL(10,2);
  v_tax_amount DECIMAL(10,2);
  v_delivery_fee DECIMAL(10,2);
  v_total DECIMAL(10,2);
  v_has_rx BOOLEAN;
BEGIN
  -- Sum all cart item totals
  SELECT COALESCE(SUM(total_price), 0)
  INTO v_subtotal
  FROM cart_items
  WHERE cart_id = cart_uuid;

  -- Check if cart contains prescription items
  SELECT EXISTS(
    SELECT 1
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = cart_uuid AND p.requires_prescription = true
  ) INTO v_has_rx;

  -- Calculate tax (12% VAT)
  v_tax_amount := ROUND(v_subtotal * 0.12, 2);

  -- Calculate delivery fee
  -- Free delivery if subtotal >= ₱1000, otherwise ₱50
  IF v_subtotal >= 1000 THEN
    v_delivery_fee := 0;
  ELSIF v_subtotal > 0 THEN
    v_delivery_fee := 50;
  ELSE
    v_delivery_fee := 0;
  END IF;

  -- Calculate total
  v_total := v_subtotal + v_tax_amount + v_delivery_fee;

  -- Update cart record
  UPDATE carts
  SET
    subtotal = v_subtotal,
    tax_amount = v_tax_amount,
    delivery_fee = v_delivery_fee,
    total = v_total,
    has_prescription_items = v_has_rx,
    updated_at = NOW()
  WHERE id = cart_uuid;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: trigger_recalculate_cart
-- Description: Trigger wrapper to recalculate cart on item changes
-- Trigger: After INSERT/UPDATE/DELETE on cart_items
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_recalculate_cart()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM recalculate_cart_totals(OLD.cart_id);
  ELSE
    PERFORM recalculate_cart_totals(NEW.cart_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on cart_items
CREATE TRIGGER cart_item_changed
  AFTER INSERT OR UPDATE OR DELETE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION trigger_recalculate_cart();

-- -----------------------------------------------------
-- Function: add_to_cart
-- Description: Add product to cart with automatic pricing calculation
-- Parameters:
--   - p_cart_id: Cart UUID
--   - p_product_id: Product UUID
--   - p_quantity: Quantity to add
-- Business Logic:
--   - Fetches current product price and discount
--   - If item exists, increases quantity
--   - If new item, inserts with calculated prices
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION add_to_cart(
  p_cart_id UUID,
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS void AS $$
DECLARE
  v_product products%ROWTYPE;
  v_unit_price DECIMAL(10,2);
  v_discount_amount DECIMAL(10,2);
  v_final_price DECIMAL(10,2);
BEGIN
  -- Get product details
  SELECT * INTO v_product
  FROM products
  WHERE id = p_product_id AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found or inactive';
  END IF;

  -- Check stock availability
  IF v_product.stock_quantity < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %', v_product.stock_quantity;
  END IF;

  -- Calculate pricing
  v_unit_price := v_product.base_price;
  v_discount_amount := ROUND(v_product.base_price * (v_product.discount_percentage / 100), 2);
  v_final_price := v_unit_price - v_discount_amount;

  -- Insert or update cart item
  INSERT INTO cart_items (
    cart_id,
    product_id,
    quantity,
    unit_price,
    discount_amount,
    total_price
  )
  VALUES (
    p_cart_id,
    p_product_id,
    p_quantity,
    v_unit_price,
    v_discount_amount * p_quantity,
    v_final_price * p_quantity
  )
  ON CONFLICT (cart_id, product_id)
  DO UPDATE SET
    quantity = cart_items.quantity + EXCLUDED.quantity,
    discount_amount = cart_items.unit_price * (cart_items.quantity + EXCLUDED.quantity) * (v_product.discount_percentage / 100),
    total_price = (cart_items.unit_price - (cart_items.unit_price * (v_product.discount_percentage / 100))) * (cart_items.quantity + EXCLUDED.quantity),
    updated_at = NOW();

  -- Cart totals will be recalculated automatically by trigger
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: update_cart_item_quantity
-- Description: Update quantity of existing cart item
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION update_cart_item_quantity(
  p_cart_id UUID,
  p_product_id UUID,
  p_new_quantity INTEGER
)
RETURNS void AS $$
DECLARE
  v_product products%ROWTYPE;
  v_unit_price DECIMAL(10,2);
  v_discount_percentage DECIMAL(5,2);
  v_discount_amount DECIMAL(10,2);
  v_final_price DECIMAL(10,2);
BEGIN
  -- Get product
  SELECT * INTO v_product
  FROM products
  WHERE id = p_product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- Check stock
  IF v_product.stock_quantity < p_new_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %', v_product.stock_quantity;
  END IF;

  -- Get current unit price from cart item (frozen price)
  SELECT unit_price INTO v_unit_price
  FROM cart_items
  WHERE cart_id = p_cart_id AND product_id = p_product_id;

  -- Calculate with current discount
  v_discount_percentage := v_product.discount_percentage;
  v_discount_amount := ROUND(v_unit_price * (v_discount_percentage / 100), 2);
  v_final_price := v_unit_price - v_discount_amount;

  -- Update cart item
  UPDATE cart_items
  SET
    quantity = p_new_quantity,
    discount_amount = v_discount_amount * p_new_quantity,
    total_price = v_final_price * p_new_quantity,
    updated_at = NOW()
  WHERE cart_id = p_cart_id AND product_id = p_product_id;

  -- Cart totals recalculated by trigger
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- Function: merge_cart_item
-- Description: Merge guest cart item into user cart (on login)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION merge_cart_item(
  p_cart_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_unit_price DECIMAL
)
RETURNS void AS $$
DECLARE
  v_product products%ROWTYPE;
  v_discount_amount DECIMAL(10,2);
  v_final_price DECIMAL(10,2);
BEGIN
  -- Get product for discount calculation
  SELECT * INTO v_product
  FROM products
  WHERE id = p_product_id;

  IF FOUND THEN
    v_discount_amount := ROUND(p_unit_price * (v_product.discount_percentage / 100), 2);
    v_final_price := p_unit_price - v_discount_amount;
  ELSE
    v_discount_amount := 0;
    v_final_price := p_unit_price;
  END IF;

  -- Insert or merge
  INSERT INTO cart_items (
    cart_id,
    product_id,
    quantity,
    unit_price,
    discount_amount,
    total_price
  )
  VALUES (
    p_cart_id,
    p_product_id,
    p_quantity,
    p_unit_price,
    v_discount_amount * p_quantity,
    v_final_price * p_quantity
  )
  ON CONFLICT (cart_id, product_id)
  DO UPDATE SET
    quantity = cart_items.quantity + EXCLUDED.quantity,
    total_price = cart_items.total_price + EXCLUDED.total_price,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 4: INVENTORY FUNCTIONS
-- =====================================================

-- -----------------------------------------------------
-- Function: decrement_inventory_on_order
-- Description: Automatically decrement stock when order confirmed
-- Trigger: After UPDATE on orders (status change to 'confirmed')
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION decrement_inventory_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_order_item RECORD;
BEGIN
  -- Only run when order moves from 'pending' to 'confirmed'
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN

    -- Decrement stock for each order item
    FOR v_order_item IN
      SELECT product_id, quantity
      FROM order_items
      WHERE order_id = NEW.id
    LOOP
      -- Update product stock
      UPDATE products
      SET stock_quantity = stock_quantity - v_order_item.quantity
      WHERE id = v_order_item.product_id;

      -- Log inventory change
      INSERT INTO inventory_logs (
        product_id,
        change_type,
        quantity_change,
        previous_quantity,
        new_quantity,
        order_id
      )
      SELECT
        v_order_item.product_id,
        'sale',
        -v_order_item.quantity,
        stock_quantity + v_order_item.quantity, -- previous
        stock_quantity, -- new (after update)
        NEW.id
      FROM products
      WHERE id = v_order_item.product_id;
    END LOOP;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on orders
CREATE TRIGGER on_order_confirmed
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION decrement_inventory_on_order();

-- =====================================================
-- PART 5: APPLY UPDATED_AT TRIGGERS TO ALL TABLES
-- =====================================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturers_updated_at
  BEFORE UPDATE ON manufacturers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMPLETED
-- =====================================================

-- Functions and triggers created successfully
-- Next: Run 20240103_create_policies.sql for Row Level Security policies
