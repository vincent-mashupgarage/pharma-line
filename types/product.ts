/**
 * Product Types
 * Matches the backend Product model for the pharmacy e-commerce platform
 */

// Product classification - distinguishes prescription, OTC, and health products
export type ProductType = 'prescription' | 'otc' | 'health_product';

// Philippine FDA drug schedule classification for controlled substances
export type ScheduleType = 'schedule_2' | 'schedule_3' | 'schedule_4' | 'schedule_5' | null;

// Available dosage forms for pharmaceutical products
export type DosageForm =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'injection'
  | 'cream'
  | 'ointment'
  | 'drops'
  | 'inhaler'
  | 'patch'
  | 'powder'
  | 'solution'
  | 'gel'
  | 'suppository';

// Product image structure for gallery display
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  sort_order: number;
}

// Main Product interface - matches backend model
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  generic_name: string | null;
  description: string;
  short_description?: string;
  category_id: string;
  manufacturer_id: string;
  product_type: ProductType;
  dosage_form: DosageForm | null;
  strength: string | null;
  pack_size: string;
  unit_of_measure?: string;
  base_price: number;
  discount_percentage: number;
  tax_rate?: number;
  requires_prescription: boolean;
  is_controlled_substance: boolean;
  schedule_type: ScheduleType;
  storage_conditions?: string;
  is_refrigerated?: boolean;
  images: ProductImage[];
  warnings: string[];
  ingredients?: string;
  stock_quantity: number;
  max_order_quantity?: number;
  min_order_quantity?: number;
  is_active: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Product with resolved category and manufacturer (for display)
export interface ProductWithDetails extends Product {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  manufacturer: {
    id: string;
    name: string;
    code: string;
    logo_url: string | null;
  };
}

// Calculated price info helper
export interface PriceInfo {
  original_price: number;
  discount_percentage: number;
  final_price: number;
  savings: number;
}

// Helper function to calculate price info
export function calculatePriceInfo(product: Product): PriceInfo {
  const original_price = product.base_price;
  const discount_percentage = product.discount_percentage;
  const savings = (original_price * discount_percentage) / 100;
  const final_price = original_price - savings;

  return {
    original_price,
    discount_percentage,
    final_price,
    savings,
  };
}

// Product substitute for generic alternatives
export interface ProductSubstitute {
  id: string;
  product_id: string;
  substitute_product_id: string;
  substitution_type: 'generic' | 'therapeutic';
  notes?: string;
}
