/**
 * Central Types Export
 * Re-exports all types for convenient imports: import { Product, Cart } from '@/types'
 */

// Product types
export * from './product';

// Category types
export * from './category';

// Manufacturer types
export * from './manufacturer';

// Cart types
export * from './cart';

// Order types
export * from './order';

// Common utility types

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Pagination information
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Sort options for product listing
export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'newest'
  | 'popularity';

// Filter state for URL params (product catalog)
export interface ProductFilters {
  search: string;
  category: string | null;
  product_type: import('./product').ProductType | null;
  manufacturer: string | null;
  price_min: number | null;
  price_max: number | null;
  in_stock_only: boolean;
  requires_prescription: boolean | null;
  sort_by: SortOption;
  page: number;
  per_page: number;
}

// Default filter values
export const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: null,
  product_type: null,
  manufacturer: null,
  price_min: null,
  price_max: null,
  in_stock_only: false,
  requires_prescription: null,
  sort_by: 'relevance',
  page: 1,
  per_page: 12,
};

// Search suggestion for autocomplete
export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  type: 'product' | 'category' | 'manufacturer';
  image_url?: string;
}

// Breadcrumb item for navigation
export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}
