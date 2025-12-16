/**
 * Price Display Component
 * Shows product price with discount strikethrough if applicable
 * Server component - no interactivity
 */

import { calculatePriceInfo, Product } from '@/types';

interface PriceDisplayProps {
  product: Product;
  className?: string;
}

export function PriceDisplay({ product, className = '' }: PriceDisplayProps) {
  const priceInfo = calculatePriceInfo(product);

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-2xl font-bold text-primary">
        ₱{priceInfo.final_price.toFixed(2)}
      </span>
      {product.discount_percentage > 0 && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            ₱{priceInfo.original_price.toFixed(2)}
          </span>
          <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
            {product.discount_percentage}% OFF
          </span>
        </>
      )}
    </div>
  );
}
