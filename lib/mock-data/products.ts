/**
 * Mock Product Data
 * 30 realistic pharmaceutical products covering various categories
 */

import { Product, ProductFilters, calculatePriceInfo } from '@/types';

export const products: Product[] = [
  // OTC Pain Relief
  {
    id: 'prod-biogesic-500',
    sku: 'BIO-500-30',
    name: 'Biogesic Paracetamol 500mg',
    slug: 'biogesic-paracetamol-500mg',
    generic_name: 'Paracetamol',
    description:
      'Biogesic provides effective relief from mild to moderate pain including headache, backache, toothache, and minor body aches. It also reduces fever. Safe for adults and children over 12 years old.',
    short_description: 'Effective pain relief and fever reducer',
    category_id: 'cat-pain-relief',
    manufacturer_id: 'mfr-unilab',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '500mg',
    pack_size: '30 tablets',
    unit_of_measure: 'tablet',
    base_price: 85.0,
    discount_percentage: 10,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-bio-1',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&auto=format',
        alt: 'Biogesic Paracetamol 500mg box',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'Do not exceed recommended dose',
      'Consult doctor if symptoms persist for more than 3 days',
      'May cause liver damage if taken in large amounts',
    ],
    stock_quantity: 250,
    is_active: true,
    is_featured: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-neozep-forte',
    sku: 'NEO-FOR-10',
    name: 'Neozep Forte',
    slug: 'neozep-forte',
    generic_name: 'Paracetamol + Phenylephrine HCl + Chlorphenamine Maleate',
    description:
      'Neozep Forte provides fast relief from cold and flu symptoms including fever, body aches, headache, clogged nose, and runny nose.',
    short_description: 'Fast relief from cold and flu symptoms',
    category_id: 'cat-cough-cold',
    manufacturer_id: 'mfr-unilab',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '500mg/10mg/2mg',
    pack_size: '10 tablets',
    base_price: 42.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-neo-1',
        url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&auto=format',
        alt: 'Neozep Forte tablet pack',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['May cause drowsiness', 'Do not drive or operate machinery after taking'],
    stock_quantity: 180,
    is_active: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Prescription Antibiotics
  {
    id: 'prod-amoxicillin-500',
    sku: 'AMX-500-21',
    name: 'Amoxicillin 500mg Capsule',
    slug: 'amoxicillin-500mg',
    generic_name: 'Amoxicillin',
    description:
      'Broad-spectrum antibiotic used to treat various bacterial infections including respiratory tract infections, ear infections, skin infections, and urinary tract infections. Requires valid prescription.',
    short_description: 'Broad-spectrum antibiotic for bacterial infections',
    category_id: 'cat-antibiotics',
    manufacturer_id: 'mfr-generika',
    product_type: 'prescription',
    dosage_form: 'capsule',
    strength: '500mg',
    pack_size: '21 capsules',
    base_price: 245.0,
    discount_percentage: 5,
    requires_prescription: true,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-amox-1',
        url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop&auto=format',
        alt: 'Amoxicillin 500mg capsules',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'Complete the full course of treatment',
      'May cause allergic reactions - stop use if rash appears',
      'Take with food to reduce stomach upset',
    ],
    stock_quantity: 120,
    max_order_quantity: 3,
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-ciprofloxacin-500',
    sku: 'CIP-500-10',
    name: 'Ciprofloxacin 500mg',
    slug: 'ciprofloxacin-500mg',
    generic_name: 'Ciprofloxacin',
    description:
      'Fluoroquinolone antibiotic for treating bacterial infections. Effective against urinary tract infections, respiratory infections, and gastrointestinal infections.',
    short_description: 'Fluoroquinolone antibiotic',
    category_id: 'cat-antibiotics',
    manufacturer_id: 'mfr-pfizer',
    product_type: 'prescription',
    dosage_form: 'tablet',
    strength: '500mg',
    pack_size: '10 tablets',
    base_price: 380.0,
    discount_percentage: 0,
    requires_prescription: true,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-cipro-1',
        url: 'https://images.unsplash.com/photo-1550572017-4870c1e3f1e7?w=800&h=800&fit=crop&auto=format',
        alt: 'Ciprofloxacin 500mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'May cause tendon damage',
      'Avoid dairy products 2 hours before/after taking',
      'Stay hydrated during treatment',
    ],
    stock_quantity: 85,
    max_order_quantity: 2,
    is_active: true,
    created_at: '2024-02-05T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Controlled Substance
  {
    id: 'prod-tramadol-50',
    sku: 'TRM-50-10',
    name: 'Tramadol 50mg',
    slug: 'tramadol-50mg',
    generic_name: 'Tramadol Hydrochloride',
    description:
      'Pain reliever for moderate to moderately severe pain. Strictly controlled medication requiring prescription. Acts on the central nervous system to relieve pain.',
    short_description: 'Prescription pain reliever for moderate to severe pain',
    category_id: 'cat-pain-relief',
    manufacturer_id: 'mfr-pfizer',
    product_type: 'prescription',
    dosage_form: 'tablet',
    strength: '50mg',
    pack_size: '10 tablets',
    base_price: 420.0,
    discount_percentage: 0,
    requires_prescription: true,
    is_controlled_substance: true,
    schedule_type: 'schedule_4',
    images: [
      {
        id: 'img-tram-1',
        url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=800&fit=crop&auto=format',
        alt: 'Tramadol 50mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'May cause drowsiness and dizziness',
      'Do not operate machinery or drive',
      'Risk of dependency - use only as prescribed',
      'May be habit-forming',
    ],
    stock_quantity: 45,
    max_order_quantity: 1,
    is_active: true,
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Vitamins & Supplements
  {
    id: 'prod-vitamin-c-zinc',
    sku: 'VIT-C-ZN-60',
    name: 'Vitamin C 500mg with Zinc',
    slug: 'vitamin-c-500mg-zinc',
    generic_name: 'Ascorbic Acid + Zinc',
    description:
      'Immune system booster combining Vitamin C and Zinc. Helps protect against infections, promotes wound healing, and supports overall health. Ideal daily supplement for maintaining wellness.',
    short_description: 'Immune booster with Vitamin C and Zinc',
    category_id: 'cat-immunity',
    manufacturer_id: 'mfr-unilab',
    product_type: 'health_product',
    dosage_form: 'capsule',
    strength: '500mg + 10mg',
    pack_size: '60 capsules',
    base_price: 450.0,
    discount_percentage: 15,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-vitc-1',
        url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop&auto=format',
        alt: 'Vitamin C with Zinc bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Take with food for better absorption', 'Do not exceed recommended daily dose'],
    stock_quantity: 300,
    is_active: true,
    is_featured: true,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-centrum-multivitamin',
    sku: 'CEN-MULT-30',
    name: 'Centrum Multivitamins',
    slug: 'centrum-multivitamins',
    generic_name: 'Multivitamin and Multimineral Supplement',
    description:
      'Complete multivitamin with essential vitamins and minerals for daily health support. Contains Vitamins A, C, D, E, B-Complex, Iron, Calcium, and more.',
    short_description: 'Complete daily multivitamin supplement',
    category_id: 'cat-multivitamins',
    manufacturer_id: 'mfr-gsk',
    product_type: 'health_product',
    dosage_form: 'tablet',
    strength: 'Standard',
    pack_size: '30 tablets',
    base_price: 580.0,
    discount_percentage: 10,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-cent-1',
        url: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&h=800&fit=crop&auto=format',
        alt: 'Centrum Multivitamins bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Take once daily with food', 'Keep out of reach of children'],
    stock_quantity: 220,
    is_active: true,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Digestive Health
  {
    id: 'prod-kremil-s',
    sku: 'KRE-TAB-10',
    name: 'Kremil-S Antacid Tablet',
    slug: 'kremil-s-antacid',
    generic_name: 'Aluminum Hydroxide + Magnesium Hydroxide + Simethicone',
    description:
      'Fast-acting antacid for relief of heartburn, acid indigestion, sour stomach, and gas. Provides quick comfort from stomach discomfort.',
    short_description: 'Fast relief from heartburn and acid indigestion',
    category_id: 'cat-digestive',
    manufacturer_id: 'mfr-unilab',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '178mg/233mg/30mg',
    pack_size: '10 tablets',
    base_price: 38.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-krem-1',
        url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=800&fit=crop&auto=format',
        alt: 'Kremil-S Antacid tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Chew thoroughly before swallowing', 'Do not use for more than 2 weeks'],
    stock_quantity: 195,
    is_active: true,
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Allergy
  {
    id: 'prod-cetirizine-10',
    sku: 'CET-10-10',
    name: 'Cetirizine 10mg',
    slug: 'cetirizine-10mg',
    generic_name: 'Cetirizine',
    description:
      'Antihistamine for relief of allergy symptoms including sneezing, runny nose, itchy eyes, and skin rashes. Non-drowsy formula.',
    short_description: 'Non-drowsy allergy relief',
    category_id: 'cat-allergy',
    manufacturer_id: 'mfr-generika',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '10mg',
    pack_size: '10 tablets',
    base_price: 95.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-cet-1',
        url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop&auto=format',
        alt: 'Cetirizine 10mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['May cause mild drowsiness in some people', 'Take once daily'],
    stock_quantity: 210,
    is_active: true,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Diabetes Care
  {
    id: 'prod-metformin-500',
    sku: 'MET-500-100',
    name: 'Metformin 500mg',
    slug: 'metformin-500mg',
    generic_name: 'Metformin Hydrochloride',
    description:
      'First-line medication for type 2 diabetes. Helps control blood sugar levels by improving insulin sensitivity. Prescription required.',
    short_description: 'Type 2 diabetes management',
    category_id: 'cat-diabetes',
    manufacturer_id: 'mfr-generika',
    product_type: 'prescription',
    dosage_form: 'tablet',
    strength: '500mg',
    pack_size: '100 tablets',
    base_price: 280.0,
    discount_percentage: 10,
    requires_prescription: true,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-met-1',
        url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&h=800&fit=crop&auto=format',
        alt: 'Metformin 500mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'Take with meals to reduce stomach upset',
      'Monitor blood sugar regularly',
      'May cause lactic acidosis in rare cases',
    ],
    stock_quantity: 150,
    is_active: true,
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Heart & Blood Pressure
  {
    id: 'prod-losartan-50',
    sku: 'LOS-50-30',
    name: 'Losartan 50mg',
    slug: 'losartan-50mg',
    generic_name: 'Losartan Potassium',
    description:
      'Blood pressure medication (ARB) used to treat hypertension and protect kidneys in diabetic patients. Prescription required.',
    short_description: 'Blood pressure control medication',
    category_id: 'cat-heart',
    manufacturer_id: 'mfr-astrazeneca',
    product_type: 'prescription',
    dosage_form: 'tablet',
    strength: '50mg',
    pack_size: '30 tablets',
    base_price: 520.0,
    discount_percentage: 0,
    requires_prescription: true,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-los-1',
        url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=800&fit=crop&auto=format',
        alt: 'Losartan 50mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'Monitor blood pressure regularly',
      'May cause dizziness - rise slowly from sitting',
      'Stay hydrated',
    ],
    stock_quantity: 95,
    is_active: true,
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-amlodipine-5',
    sku: 'AML-5-30',
    name: 'Amlodipine 5mg',
    slug: 'amlodipine-5mg',
    generic_name: 'Amlodipine Besylate',
    description:
      'Calcium channel blocker for treating high blood pressure and angina. Helps relax blood vessels for better blood flow.',
    short_description: 'Calcium channel blocker for hypertension',
    category_id: 'cat-heart',
    manufacturer_id: 'mfr-pfizer',
    product_type: 'prescription',
    dosage_form: 'tablet',
    strength: '5mg',
    pack_size: '30 tablets',
    base_price: 340.0,
    discount_percentage: 5,
    requires_prescription: true,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-aml-1',
        url: 'https://images.unsplash.com/photo-1603217039863-aa57cd937b86?w=800&h=800&fit=crop&auto=format',
        alt: 'Amlodipine 5mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['May cause swelling in ankles', 'Take at the same time each day'],
    stock_quantity: 110,
    is_active: true,
    created_at: '2024-03-12T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Personal Care - Skincare
  {
    id: 'prod-cetaphil-cleanser',
    sku: 'CET-CLE-250',
    name: 'Cetaphil Gentle Skin Cleanser',
    slug: 'cetaphil-gentle-cleanser',
    generic_name: null,
    description:
      'Gentle, soap-free cleanser for all skin types including sensitive skin. Removes dirt, makeup, and impurities without stripping natural oils.',
    short_description: 'Gentle cleanser for all skin types',
    category_id: 'cat-skincare',
    manufacturer_id: 'mfr-gsk',
    product_type: 'health_product',
    dosage_form: 'solution',
    strength: null,
    pack_size: '250ml',
    base_price: 485.0,
    discount_percentage: 12,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-ceta-1',
        url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop&auto=format',
        alt: 'Cetaphil Gentle Skin Cleanser bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['For external use only', 'Avoid contact with eyes'],
    stock_quantity: 140,
    is_active: true,
    is_featured: true,
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Oral Care
  {
    id: 'prod-sensodyne-toothpaste',
    sku: 'SEN-TP-100',
    name: 'Sensodyne Sensitivity Relief Toothpaste',
    slug: 'sensodyne-sensitivity-relief',
    generic_name: null,
    description:
      'Specialized toothpaste for sensitive teeth. Provides long-lasting relief from tooth sensitivity while protecting against cavities.',
    short_description: 'Toothpaste for sensitive teeth',
    category_id: 'cat-oral-care',
    manufacturer_id: 'mfr-gsk',
    product_type: 'health_product',
    dosage_form: 'gel',
    strength: null,
    pack_size: '100g',
    base_price: 195.0,
    discount_percentage: 8,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-sens-1',
        url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&h=800&fit=crop&auto=format',
        alt: 'Sensodyne toothpaste tube',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Do not swallow', 'Keep out of reach of children'],
    stock_quantity: 280,
    is_active: true,
    created_at: '2024-03-18T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Medical Devices
  {
    id: 'prod-thermometer-digital',
    sku: 'THERM-DIG-01',
    name: 'Digital Thermometer',
    slug: 'digital-thermometer',
    generic_name: null,
    description:
      'Accurate digital thermometer for oral, rectal, or underarm temperature measurement. Fast 60-second reading with memory recall feature.',
    short_description: 'Digital thermometer with fast reading',
    category_id: 'cat-medical-devices',
    manufacturer_id: 'mfr-mercurydrug',
    product_type: 'health_product',
    dosage_form: null,
    strength: null,
    pack_size: '1 unit',
    base_price: 250.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-therm-1',
        url: 'https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?w=800&h=800&fit=crop&auto=format',
        alt: 'Digital thermometer',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'Clean with alcohol before and after use',
      'Replace battery when low battery indicator shows',
    ],
    stock_quantity: 160,
    is_active: true,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-bp-monitor',
    sku: 'BP-MON-AUTO',
    name: 'Automatic Blood Pressure Monitor',
    slug: 'automatic-bp-monitor',
    generic_name: null,
    description:
      'Easy-to-use automatic blood pressure monitor for home use. Features large LCD display, irregular heartbeat detection, and memory for 60 readings.',
    short_description: 'Automatic BP monitor for home use',
    category_id: 'cat-medical-devices',
    manufacturer_id: 'mfr-mercurydrug',
    product_type: 'health_product',
    dosage_form: null,
    strength: null,
    pack_size: '1 unit',
    base_price: 1850.0,
    discount_percentage: 15,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-bp-1',
        url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800&h=800&fit=crop&auto=format',
        alt: 'Automatic Blood Pressure Monitor',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Read instruction manual before use', 'Calibrate regularly'],
    stock_quantity: 45,
    is_active: true,
    created_at: '2024-03-22T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // First Aid
  {
    id: 'prod-bandaid-assorted',
    sku: 'BND-ASS-50',
    name: 'Band-Aid Assorted Sizes',
    slug: 'band-aid-assorted',
    generic_name: null,
    description:
      'Sterile adhesive bandages in assorted sizes for minor cuts, scrapes, and wounds. Breathable material promotes healing.',
    short_description: 'Sterile bandages in assorted sizes',
    category_id: 'cat-first-aid',
    manufacturer_id: 'mfr-mercurydrug',
    product_type: 'health_product',
    dosage_form: null,
    strength: null,
    pack_size: '50 pieces',
    base_price: 120.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-band-1',
        url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&h=800&fit=crop&auto=format',
        alt: 'Band-Aid assorted pack',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Change daily or when soiled', 'Clean wound before applying'],
    stock_quantity: 320,
    is_active: true,
    created_at: '2024-03-25T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-betadine-solution',
    sku: 'BET-SOL-60',
    name: 'Betadine Antiseptic Solution',
    slug: 'betadine-antiseptic',
    generic_name: 'Povidone-Iodine',
    description:
      'Antiseptic solution for disinfecting wounds, cuts, and abrasions. Kills bacteria, viruses, and fungi on contact.',
    short_description: 'Antiseptic for wound disinfection',
    category_id: 'cat-first-aid',
    manufacturer_id: 'mfr-pascual',
    product_type: 'health_product',
    dosage_form: 'solution',
    strength: '10%',
    pack_size: '60ml',
    base_price: 135.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-beta-1',
        url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&auto=format',
        alt: 'Betadine solution bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'For external use only',
      'May stain clothing',
      'Discontinue if irritation occurs',
    ],
    stock_quantity: 190,
    is_active: true,
    created_at: '2024-03-28T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Baby & Child
  {
    id: 'prod-tempra-syrup',
    sku: 'TEM-SYR-60',
    name: 'Tempra Paracetamol Syrup for Kids',
    slug: 'tempra-kids-syrup',
    generic_name: 'Paracetamol',
    description:
      'Cherry-flavored paracetamol syrup for children. Provides effective relief from fever and pain in children aged 2-12 years.',
    short_description: 'Fever and pain relief for children',
    category_id: 'cat-baby-child',
    manufacturer_id: 'mfr-unilab',
    product_type: 'otc',
    dosage_form: 'syrup',
    strength: '250mg/5ml',
    pack_size: '60ml',
    base_price: 95.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-temp-1',
        url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=800&fit=crop&auto=format',
        alt: 'Tempra syrup bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'Shake well before use',
      'Use measuring cup provided',
      'Consult doctor for children under 2',
    ],
    stock_quantity: 175,
    is_active: true,
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  // Additional OTC Products
  {
    id: 'prod-mefenamic-500',
    sku: 'MEF-500-10',
    name: 'Mefenamic Acid 500mg',
    slug: 'mefenamic-acid-500mg',
    generic_name: 'Mefenamic Acid',
    description:
      'NSAID for relief of mild to moderate pain including menstrual cramps, headache, toothache, and muscle pain.',
    short_description: 'Pain relief especially for menstrual cramps',
    category_id: 'cat-pain-relief',
    manufacturer_id: 'mfr-generika',
    product_type: 'otc',
    dosage_form: 'capsule',
    strength: '500mg',
    pack_size: '10 capsules',
    base_price: 68.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-mef-1',
        url: 'https://images.unsplash.com/photo-1550572017-4870c1e3f1e7?w=800&h=800&fit=crop&auto=format',
        alt: 'Mefenamic Acid capsules',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: [
      'Take with food or milk',
      'Do not use for more than 7 days without consulting doctor',
    ],
    stock_quantity: 235,
    is_active: true,
    created_at: '2024-04-05T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-lagundi-syrup',
    sku: 'LAG-SYR-60',
    name: 'Lagundi Cough Syrup',
    slug: 'lagundi-cough-syrup',
    generic_name: 'Vitex Negundo',
    description:
      'Herbal cough syrup made from Lagundi leaves. Natural remedy for cough and asthma. Safe for adults and children.',
    short_description: 'Herbal cough remedy',
    category_id: 'cat-cough-cold',
    manufacturer_id: 'mfr-pascual',
    product_type: 'otc',
    dosage_form: 'syrup',
    strength: '600mg/5ml',
    pack_size: '60ml',
    base_price: 85.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-lag-1',
        url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=800&fit=crop&auto=format',
        alt: 'Lagundi syrup bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Shake well before use', 'Consult doctor if cough persists'],
    stock_quantity: 145,
    is_active: true,
    created_at: '2024-04-08T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-ibuprofen-400',
    sku: 'IBU-400-10',
    name: 'Ibuprofen 400mg',
    slug: 'ibuprofen-400mg',
    generic_name: 'Ibuprofen',
    description:
      'NSAID for relief of pain, inflammation, and fever. Effective for headaches, dental pain, menstrual cramps, and arthritis.',
    short_description: 'Anti-inflammatory pain reliever',
    category_id: 'cat-pain-relief',
    manufacturer_id: 'mfr-generika',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '400mg',
    pack_size: '10 tablets',
    base_price: 72.0,
    discount_percentage: 5,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-ibu-1',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&auto=format',
        alt: 'Ibuprofen 400mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Take with food', 'May cause stomach upset', 'Avoid if allergic to aspirin'],
    stock_quantity: 265,
    is_active: true,
    is_featured: true,
    created_at: '2024-04-10T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-ascof-lagundi',
    sku: 'ASC-LAG-60',
    name: 'Ascof Lagundi Tablet',
    slug: 'ascof-lagundi-tablet',
    generic_name: 'Vitex Negundo',
    description:
      'Herbal medicine for relief of cough due to common cold, flu, and mild to moderate acute bronchitis. Clinically proven effective.',
    short_description: 'Herbal cough relief tablet',
    category_id: 'cat-cough-cold',
    manufacturer_id: 'mfr-pascual',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '600mg',
    pack_size: '10 tablets',
    base_price: 95.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-asc-1',
        url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=800&fit=crop&auto=format',
        alt: 'Ascof Lagundi tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Not recommended for pregnant women', 'Consult doctor if cough persists'],
    stock_quantity: 185,
    is_active: true,
    created_at: '2024-04-12T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-diatabs',
    sku: 'DIA-TAB-12',
    name: 'Diatabs Anti-Diarrhea',
    slug: 'diatabs-anti-diarrhea',
    generic_name: 'Loperamide HCl + Attapulgite',
    description:
      'Fast relief from diarrhea. Reduces bowel movement frequency and normalizes stool consistency.',
    short_description: 'Anti-diarrhea medication',
    category_id: 'cat-digestive',
    manufacturer_id: 'mfr-unilab',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '2mg/750mg',
    pack_size: '12 tablets',
    base_price: 48.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-dia-1',
        url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=800&fit=crop&auto=format',
        alt: 'Diatabs tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Stay hydrated', 'Consult doctor if diarrhea persists more than 2 days'],
    stock_quantity: 215,
    is_active: true,
    created_at: '2024-04-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-omega-3-fish-oil',
    sku: 'OMG-3-100',
    name: 'Omega-3 Fish Oil 1000mg',
    slug: 'omega-3-fish-oil',
    generic_name: 'Omega-3 Fatty Acids',
    description:
      'Heart-healthy fish oil supplement rich in EPA and DHA. Supports cardiovascular health, brain function, and reduces inflammation.',
    short_description: 'Fish oil for heart and brain health',
    category_id: 'cat-vitamins',
    manufacturer_id: 'mfr-pascual',
    product_type: 'health_product',
    dosage_form: 'capsule',
    strength: '1000mg',
    pack_size: '100 capsules',
    base_price: 680.0,
    discount_percentage: 10,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-omg-1',
        url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=800&fit=crop&auto=format',
        alt: 'Omega-3 Fish Oil bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Take with meals', 'Consult doctor if on blood thinners'],
    stock_quantity: 125,
    is_active: true,
    created_at: '2024-04-18T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-calcium-vitamin-d',
    sku: 'CAL-VD-60',
    name: 'Calcium + Vitamin D',
    slug: 'calcium-vitamin-d',
    generic_name: 'Calcium Carbonate + Cholecalciferol',
    description:
      'Bone health supplement combining calcium and vitamin D for strong bones and teeth. Helps prevent osteoporosis.',
    short_description: 'Bone health supplement',
    category_id: 'cat-vitamins',
    manufacturer_id: 'mfr-unilab',
    product_type: 'health_product',
    dosage_form: 'tablet',
    strength: '600mg + 400IU',
    pack_size: '60 tablets',
    base_price: 395.0,
    discount_percentage: 8,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-cal-1',
        url: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&h=800&fit=crop&auto=format',
        alt: 'Calcium + Vitamin D bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Take with food', 'Consult doctor if you have kidney problems'],
    stock_quantity: 155,
    is_active: true,
    created_at: '2024-04-20T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-alcohol-70-percent',
    sku: 'ALC-70-500',
    name: 'Isopropyl Alcohol 70%',
    slug: 'isopropyl-alcohol-70',
    generic_name: 'Isopropyl Alcohol',
    description:
      'Antiseptic solution for disinfecting skin and surfaces. Effective against bacteria and viruses.',
    short_description: 'Disinfectant alcohol 70%',
    category_id: 'cat-first-aid',
    manufacturer_id: 'mfr-mercurydrug',
    product_type: 'health_product',
    dosage_form: 'solution',
    strength: '70%',
    pack_size: '500ml',
    base_price: 85.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-alc-1',
        url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=800&fit=crop&auto=format',
        alt: 'Isopropyl Alcohol bottle',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['For external use only', 'Flammable - keep away from heat', 'Keep out of reach of children'],
    stock_quantity: 385,
    is_active: true,
    created_at: '2024-04-22T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-hydrite-ors',
    sku: 'HYD-ORS-10',
    name: 'Hydrite Oral Rehydration Salts',
    slug: 'hydrite-ors',
    generic_name: 'Oral Rehydration Salts',
    description:
      'ORS for rehydration during diarrhea, vomiting, or excessive sweating. Replaces lost fluids and electrolytes.',
    short_description: 'Oral rehydration solution',
    category_id: 'cat-digestive',
    manufacturer_id: 'mfr-unilab',
    product_type: 'otc',
    dosage_form: 'powder',
    strength: null,
    pack_size: '10 sachets',
    base_price: 95.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-hyd-1',
        url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&h=800&fit=crop&auto=format',
        alt: 'Hydrite ORS sachets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Mix with clean water only', 'Consume within 24 hours of preparation'],
    stock_quantity: 245,
    is_active: true,
    created_at: '2024-04-25T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },

  {
    id: 'prod-loratadine-10',
    sku: 'LOR-10-10',
    name: 'Loratadine 10mg',
    slug: 'loratadine-10mg',
    generic_name: 'Loratadine',
    description:
      'Non-drowsy antihistamine for seasonal allergies, hay fever, and hives. 24-hour relief from allergy symptoms.',
    short_description: '24-hour allergy relief',
    category_id: 'cat-allergy',
    manufacturer_id: 'mfr-generika',
    product_type: 'otc',
    dosage_form: 'tablet',
    strength: '10mg',
    pack_size: '10 tablets',
    base_price: 88.0,
    discount_percentage: 0,
    requires_prescription: false,
    is_controlled_substance: false,
    schedule_type: null,
    images: [
      {
        id: 'img-lor-1',
        url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=800&fit=crop&auto=format',
        alt: 'Loratadine 10mg tablets',
        is_primary: true,
        sort_order: 1,
      },
    ],
    warnings: ['Take once daily', 'Non-drowsy for most people'],
    stock_quantity: 198,
    is_active: true,
    created_at: '2024-04-28T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
];

// Helper functions for product operations
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category_id === categoryId && p.is_active);
}

export function getProductsByManufacturer(manufacturerId: string): Product[] {
  return products.filter((p) => p.manufacturer_id === manufacturerId && p.is_active);
}

export function getFeaturedProducts(limit: number = 8): Product[] {
  return products
    .filter((p) => p.is_featured && p.is_active)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.is_active &&
      (p.name.toLowerCase().includes(lowercaseQuery) ||
        p.generic_name?.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery))
  );
}

export function filterProducts(filters: Partial<ProductFilters>): Product[] {
  return products.filter((p) => {
    if (!p.is_active) return false;
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.generic_name?.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    if (filters.category && p.category_id !== filters.category) return false;
    if (filters.product_type && p.product_type !== filters.product_type) return false;
    if (filters.manufacturer && p.manufacturer_id !== filters.manufacturer) return false;
    if (filters.price_min && p.base_price < filters.price_min) return false;
    if (filters.price_max && p.base_price > filters.price_max) return false;
    if (filters.in_stock_only && p.stock_quantity === 0) return false;
    if (
      filters.requires_prescription !== null &&
      filters.requires_prescription !== undefined &&
      p.requires_prescription !== filters.requires_prescription
    )
      return false;
    return true;
  });
}

export function sortProducts(
  products: Product[],
  sortBy: ProductFilters['sort_by']
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.base_price - b.base_price);
    case 'price_desc':
      return sorted.sort((a, b) => b.base_price - a.base_price);
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'popularity':
      // For now, sort by featured then by stock quantity
      return sorted.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.stock_quantity - a.stock_quantity;
      });
    case 'relevance':
    default:
      // Featured products first, then by update date
      return sorted.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }
}

// Get related products (same category, excluding current product)
export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];

  return products
    .filter(
      (p) =>
        p.id !== productId &&
        p.category_id === product.category_id &&
        p.is_active
    )
    .slice(0, limit);
}

// Get product substitutes (generic alternatives)
export function getProductSubstitutes(productId: string, limit: number = 3): Product[] {
  const product = getProductById(productId);
  if (!product || !product.generic_name) return [];

  return products
    .filter(
      (p) =>
        p.id !== productId &&
        p.generic_name === product.generic_name &&
        p.is_active
    )
    .slice(0, limit);
}
