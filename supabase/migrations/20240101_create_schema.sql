-- PharmaLine E-Commerce Database Schema
-- Migration: 20240101_create_schema.sql
-- Description: Creates all tables, ENUMs, indexes for pharmacy e-commerce platform

-- =====================================================
-- PART 1: CREATE CUSTOM TYPES (ENUMs)
-- =====================================================

-- Product classification types
CREATE TYPE product_type AS ENUM ('prescription', 'otc', 'health_product');

-- Philippine FDA drug schedules (controlled substances)
CREATE TYPE schedule_type AS ENUM ('schedule_2', 'schedule_3', 'schedule_4', 'schedule_5');

-- Pharmaceutical dosage forms
CREATE TYPE dosage_form AS ENUM (
  'tablet',
  'capsule',
  'syrup',
  'injection',
  'cream',
  'ointment',
  'drops',
  'inhaler',
  'patch',
  'powder',
  'solution',
  'gel',
  'suppository'
);

-- Order status workflow
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded'
);

-- Payment status
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');

-- Prescription verification status
CREATE TYPE prescription_status AS ENUM ('pending', 'approved', 'rejected');

-- Inventory change types
CREATE TYPE inventory_change_type AS ENUM ('restock', 'sale', 'adjustment', 'return');

-- =====================================================
-- PART 2: CREATE TABLES
-- =====================================================

-- -----------------------------------------------------
-- Table: profiles
-- Description: Extended user data (complements auth.users)
-- -----------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,

  -- Default shipping address
  default_address_line1 TEXT,
  default_address_line2 TEXT,
  default_city TEXT,
  default_province TEXT,
  default_postal_code TEXT,

  -- Preferences
  newsletter_subscribed BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: manufacturers
-- Description: Pharmaceutical manufacturers/suppliers
-- -----------------------------------------------------
CREATE TABLE manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  license_number TEXT,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: categories
-- Description: Hierarchical product categories
-- -----------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: products
-- Description: Main pharmaceutical products catalog
-- -----------------------------------------------------
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  generic_name TEXT,
  description TEXT NOT NULL,
  short_description TEXT,

  -- Relationships
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE RESTRICT,

  -- Classification
  product_type product_type NOT NULL,
  dosage_form dosage_form,
  strength TEXT,
  pack_size TEXT NOT NULL,
  unit_of_measure TEXT,

  -- Pricing
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  tax_rate DECIMAL(5,4) DEFAULT 0.12, -- 12% VAT (Philippine tax)

  -- Regulatory Compliance (Philippine FDA)
  requires_prescription BOOLEAN DEFAULT false,
  is_controlled_substance BOOLEAN DEFAULT false,
  schedule_type schedule_type,

  -- Storage & Handling
  storage_conditions TEXT,
  is_refrigerated BOOLEAN DEFAULT false,

  -- Safety Information
  warnings TEXT[] DEFAULT '{}',
  ingredients TEXT,

  -- Inventory
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  max_order_quantity INTEGER,
  min_order_quantity INTEGER DEFAULT 1,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: Controlled substances must have schedule type
  CONSTRAINT controlled_substance_schedule_check
    CHECK (
      (is_controlled_substance = false) OR
      (is_controlled_substance = true AND schedule_type IS NOT NULL)
    )
);

-- -----------------------------------------------------
-- Table: product_images
-- Description: Product image gallery
-- -----------------------------------------------------
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: carts
-- Description: Shopping carts (supports guests and authenticated users)
-- -----------------------------------------------------
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id TEXT, -- For anonymous users

  -- Cart summary (denormalized for performance)
  subtotal DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,

  -- Flags
  has_prescription_items BOOLEAN DEFAULT false,

  -- Coupon
  coupon_code TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure either user_id or guest_id exists (not both, not neither)
  CONSTRAINT cart_owner_check CHECK (
    (user_id IS NOT NULL AND guest_id IS NULL) OR
    (user_id IS NULL AND guest_id IS NOT NULL)
  )
);

-- -----------------------------------------------------
-- Table: cart_items
-- Description: Items in shopping cart
-- -----------------------------------------------------
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  quantity INTEGER NOT NULL CHECK (quantity > 0),

  -- Snapshot pricing (frozen at time of adding to cart)
  unit_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,

  -- Prescription tracking (if Rx item)
  prescription_item_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One product per cart (prevent duplicates)
  UNIQUE(cart_id, product_id)
);

-- -----------------------------------------------------
-- Table: prescriptions
-- Description: Prescription uploads and verification
-- -----------------------------------------------------
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Prescription details
  prescription_number TEXT UNIQUE NOT NULL,
  prescribing_doctor TEXT NOT NULL,
  doctor_license_number TEXT,

  -- Upload
  prescription_image_url TEXT NOT NULL,

  -- Verification status
  status prescription_status DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Validity
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Expiry must be after issue
  CONSTRAINT prescription_date_check CHECK (expiry_date > issue_date)
);

-- -----------------------------------------------------
-- Table: orders
-- Description: Order headers
-- -----------------------------------------------------
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Customer info (snapshot at time of order)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Delivery address
  delivery_address_line1 TEXT NOT NULL,
  delivery_address_line2 TEXT,
  delivery_city TEXT NOT NULL,
  delivery_province TEXT NOT NULL,
  delivery_postal_code TEXT NOT NULL,

  -- Order totals
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,

  -- Status
  status order_status DEFAULT 'pending',

  -- Payment
  payment_method TEXT,
  payment_status payment_status DEFAULT 'unpaid',

  -- Special flags
  has_prescription_items BOOLEAN DEFAULT false,
  requires_prescription_verification BOOLEAN DEFAULT false,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: order_items
-- Description: Line items in orders
-- -----------------------------------------------------
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Product snapshot (in case product deleted)
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_generic_name TEXT,

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,

  -- Prescription link (if applicable)
  prescription_id UUID REFERENCES prescriptions(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- Table: inventory_logs
-- Description: Audit trail for stock movements
-- -----------------------------------------------------
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  change_type inventory_change_type NOT NULL,
  quantity_change INTEGER NOT NULL, -- Negative for decrements
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,

  -- Reference
  order_id UUID REFERENCES orders(id),
  performed_by UUID REFERENCES profiles(id),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 3: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);

-- Manufacturers indexes
CREATE INDEX idx_manufacturers_active ON manufacturers(is_active) WHERE is_active = true;
CREATE INDEX idx_manufacturers_code ON manufacturers(code);

-- Categories indexes
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- Products indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active_featured ON products(is_active, is_featured) WHERE is_active = true;
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_price ON products(base_price);
CREATE INDEX idx_products_stock ON products(stock_quantity) WHERE stock_quantity > 0;

-- Full-text search index for products
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('english',
    coalesce(name, '') || ' ' ||
    coalesce(generic_name, '') || ' ' ||
    coalesce(description, '')
  )
);

-- Product images indexes
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort_order);
-- Ensure only one primary image per product
CREATE UNIQUE INDEX idx_one_primary_per_product ON product_images(product_id)
  WHERE is_primary = true;

-- Carts indexes
CREATE UNIQUE INDEX idx_cart_user ON carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_cart_guest ON carts(guest_id) WHERE guest_id IS NOT NULL;
CREATE INDEX idx_cart_updated ON carts(updated_at);

-- Cart items indexes
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- Prescriptions indexes
CREATE INDEX idx_prescriptions_user ON prescriptions(user_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_number ON prescriptions(prescription_number);

-- Orders indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Order items indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_prescription ON order_items(prescription_id);

-- Inventory logs indexes
CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id, created_at DESC);
CREATE INDEX idx_inventory_logs_order ON inventory_logs(order_id);
CREATE INDEX idx_inventory_logs_type ON inventory_logs(change_type);

-- =====================================================
-- PART 4: CREATE VIEWS
-- =====================================================

-- Recursive CTE view for category tree (useful for navigation)
CREATE OR REPLACE VIEW category_tree AS
WITH RECURSIVE tree AS (
  SELECT
    id,
    name,
    slug,
    parent_id,
    0 as level,
    ARRAY[id] as path,
    ARRAY[sort_order] as sort_path,
    is_active
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  SELECT
    c.id,
    c.name,
    c.slug,
    c.parent_id,
    t.level + 1,
    t.path || c.id,
    t.sort_path || c.sort_order,
    c.is_active
  FROM categories c
  JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree
ORDER BY sort_path;

-- =====================================================
-- COMPLETED
-- =====================================================

-- Schema migration completed successfully
-- Next: Run 20240102_create_functions.sql for database functions and triggers
