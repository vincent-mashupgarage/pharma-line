/**
 * Use Filters Hook
 * Manages product filter state via URL search params
 * Allows shareable filtered product URLs
 */

'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ProductFilters, DEFAULT_FILTERS } from '@/types';

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current filters from URL
  const filters: ProductFilters = useMemo(
    () => ({
      search: searchParams.get('search') || DEFAULT_FILTERS.search,
      category: searchParams.get('category') || DEFAULT_FILTERS.category,
      product_type: (searchParams.get('product_type') as ProductFilters['product_type']) || DEFAULT_FILTERS.product_type,
      manufacturer: searchParams.get('manufacturer') || DEFAULT_FILTERS.manufacturer,
      price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : DEFAULT_FILTERS.price_min,
      price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : DEFAULT_FILTERS.price_max,
      in_stock_only: searchParams.get('in_stock_only') === 'true',
      requires_prescription: searchParams.get('requires_prescription') === 'true'
        ? true
        : searchParams.get('requires_prescription') === 'false'
        ? false
        : DEFAULT_FILTERS.requires_prescription,
      sort_by: (searchParams.get('sort_by') as ProductFilters['sort_by']) || DEFAULT_FILTERS.sort_by,
      page: Number(searchParams.get('page')) || DEFAULT_FILTERS.page,
      per_page: Number(searchParams.get('per_page')) || DEFAULT_FILTERS.per_page,
    }),
    [searchParams]
  );

  // Update filters in URL
  const setFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset to page 1 when filters change (except when changing page itself)
      if (!('page' in newFilters)) {
        params.set('page', '1');
      }

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === null || value === '' || value === false || value === DEFAULT_FILTERS[key as keyof ProductFilters]) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== DEFAULT_FILTERS.search ||
      filters.category !== DEFAULT_FILTERS.category ||
      filters.product_type !== DEFAULT_FILTERS.product_type ||
      filters.manufacturer !== DEFAULT_FILTERS.manufacturer ||
      filters.price_min !== DEFAULT_FILTERS.price_min ||
      filters.price_max !== DEFAULT_FILTERS.price_max ||
      filters.in_stock_only !== DEFAULT_FILTERS.in_stock_only ||
      filters.requires_prescription !== DEFAULT_FILTERS.requires_prescription
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
  };
}
