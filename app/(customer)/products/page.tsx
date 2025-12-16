/**
 * Products Page
 * Product catalog with search, filters, and pagination
 * Server component for SEO, with client components for interactivity
 */

import { ProductGrid } from '@/components/products/product-grid';
import { SearchBar } from '@/components/products/search-bar';
import { ProductFilters } from '@/components/products/product-filters';
import { SortSelect } from '@/components/products/sort-select';
import { Pagination } from '@/components/products/pagination';
import { filterProducts, sortProducts } from '@/lib/mock-data/products';
import { ProductFilters as ProductFiltersType } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products - PharmaLine',
  description: 'Browse our complete selection of medicines, vitamins, and health products.',
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ITEMS_PER_PAGE = 12;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // Build filters from URL params
  const filters: Partial<ProductFiltersType> = {
    search: typeof params.search === 'string' ? params.search : '',
    category: typeof params.category === 'string' ? params.category : null,
    product_type: typeof params.product_type === 'string' ? params.product_type as any : null,
    manufacturer: typeof params.manufacturer === 'string' ? params.manufacturer : null,
    price_min: params.price_min ? Number(params.price_min) : null,
    price_max: params.price_max ? Number(params.price_max) : null,
    in_stock_only: params.in_stock_only === 'true',
    requires_prescription: params.requires_prescription === 'true'
      ? true
      : params.requires_prescription === 'false'
      ? false
      : null,
    sort_by: (params.sort_by as ProductFiltersType['sort_by']) || 'relevance',
  };

  const currentPage = params.page ? Number(params.page) : 1;

  // Apply filters and sorting
  const filteredProducts = filterProducts(filters);
  const sortedProducts = sortProducts(filteredProducts, filters.sort_by || 'relevance');

  // Pagination
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Search */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground">
            Browse our complete selection of medicines, vitamins, and health products
          </p>
        </div>
        <SearchBar />
      </div>

      {/* Two-column layout: Filters + Products */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar - Filters */}
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <div className="rounded-lg border bg-card p-6">
            <ProductFilters />
          </div>
        </aside>

        {/* Main content - Products */}
        <main className="flex-1 space-y-6">
          {/* Toolbar: Sort and Results count */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'product' : 'products'} found
            </p>
            <SortSelect />
          </div>

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
