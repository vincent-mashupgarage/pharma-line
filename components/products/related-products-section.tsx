/**
 * Related Products Section
 * Displays products from the same category
 * Server Component - can be static
 */

import { Product } from '@/types';
import { ProductCard } from './product-card';

interface RelatedProductsSectionProps {
  products: Product[];
  title?: string;
}

export function RelatedProductsSection({
  products,
  title = 'Related Products'
}: RelatedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
