/**
 * Mock Category Data
 * Hierarchical categories for the pharmacy product catalog
 */

import { Category } from '@/types';

export const categories: Category[] = [
  // Top-level categories
  {
    id: 'cat-medicines',
    name: 'Medicines',
    slug: 'medicines',
    description: 'Prescription and over-the-counter medications for various health conditions',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-vitamins',
    name: 'Vitamins & Supplements',
    slug: 'vitamins-supplements',
    description: 'Health supplements, vitamins, and minerals for daily wellness',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Personal hygiene, skincare, and grooming products',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 3,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-medical-devices',
    name: 'Medical Devices',
    slug: 'medical-devices',
    description: 'Home medical equipment, monitors, and diagnostic devices',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 4,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-baby-child',
    name: 'Baby & Child',
    slug: 'baby-child',
    description: 'Baby care essentials, child health products, and infant nutrition',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 5,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-first-aid',
    name: 'First Aid',
    slug: 'first-aid',
    description: 'First aid supplies, wound care, and emergency medical supplies',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 6,
    created_at: '2024-01-01T00:00:00Z',
  },

  // Subcategories under Medicines
  {
    id: 'cat-pain-relief',
    name: 'Pain Relief',
    slug: 'pain-relief',
    description: 'Pain relievers, anti-inflammatory, and fever reducers',
    parent_id: 'cat-medicines',
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-cough-cold',
    name: 'Cough & Cold',
    slug: 'cough-cold',
    description: 'Cold medicines, cough syrups, and decongestants',
    parent_id: 'cat-medicines',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-antibiotics',
    name: 'Antibiotics',
    slug: 'antibiotics',
    description: 'Prescription antibiotics for bacterial infections',
    parent_id: 'cat-medicines',
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 3,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-digestive',
    name: 'Digestive Health',
    slug: 'digestive-health',
    description: 'Antacids, laxatives, and digestive aids',
    parent_id: 'cat-medicines',
    image_url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 4,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-allergy',
    name: 'Allergy & Sinus',
    slug: 'allergy-sinus',
    description: 'Antihistamines and sinus relief medications',
    parent_id: 'cat-medicines',
    image_url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 5,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-diabetes',
    name: 'Diabetes Care',
    slug: 'diabetes-care',
    description: 'Diabetes medications and blood sugar management',
    parent_id: 'cat-medicines',
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 6,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-heart',
    name: 'Heart & Blood Pressure',
    slug: 'heart-blood-pressure',
    description: 'Cardiovascular medications and blood pressure control',
    parent_id: 'cat-medicines',
    image_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 7,
    created_at: '2024-01-01T00:00:00Z',
  },

  // Subcategories under Vitamins & Supplements
  {
    id: 'cat-multivitamins',
    name: 'Multivitamins',
    slug: 'multivitamins',
    description: 'Complete daily multivitamin supplements',
    parent_id: 'cat-vitamins',
    image_url: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-immunity',
    name: 'Immunity Boosters',
    slug: 'immunity-boosters',
    description: 'Immune system support supplements',
    parent_id: 'cat-vitamins',
    image_url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
  },

  // Subcategories under Personal Care
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Skin care products and dermatological solutions',
    parent_id: 'cat-personal-care',
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-oral-care',
    name: 'Oral Care',
    slug: 'oral-care',
    description: 'Dental hygiene and oral health products',
    parent_id: 'cat-personal-care',
    image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&h=400&fit=crop&auto=format',
    is_active: true,
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Helper function to get category by ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// Helper function to get top-level categories
export function getTopLevelCategories(): Category[] {
  return categories
    .filter((c) => c.parent_id === null && c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

// Helper function to get subcategories
export function getSubcategories(parentId: string): Category[] {
  return categories
    .filter((c) => c.parent_id === parentId && c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}
