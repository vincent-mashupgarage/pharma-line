/**
 * Product Card Component
 * Displays a product in grid view with add to cart button
 * Client component - contains interactive add to cart button
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product, calculatePriceInfo } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/hooks/use-cart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const priceInfo = calculatePriceInfo(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (product.requires_prescription) {
      toast.warning('Prescription Required', {
        description: 'This product requires a valid prescription. Add to cart and upload prescription at checkout.',
      });
    }

    addItem(product, 1);
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="h-full block">
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/50 flex flex-col">
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Product Image */}
          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[0]?.url || '/images/unavailable.svg'}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/unavailable.svg';
                target.srcset = '/images/unavailable.svg';
              }}
            />

            {/* Prescription Badge */}
            {product.requires_prescription && (
              <Badge
                variant="destructive"
                className="absolute left-2 top-2 gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Rx
              </Badge>
            )}

            {/* Discount Badge */}
            {product.discount_percentage > 0 && (
              <Badge className="absolute right-2 top-2 bg-accent">
                {product.discount_percentage}% OFF
              </Badge>
            )}

            {/* Out of Stock Overlay */}
            {product.stock_quantity === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2 flex flex-col flex-1">
            <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary">
              {product.name}
            </h3>

            {product.generic_name && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {product.generic_name}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              {product.discount_percentage > 0 ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    ₱{priceInfo.final_price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ₱{priceInfo.original_price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">
                  ₱{product.base_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Pack Size */}
            <p className="text-xs text-muted-foreground">{product.pack_size}</p>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              size="sm"
              className="w-full gap-2 mt-auto"
              variant={isInCart(product.id) ? 'secondary' : 'default'}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
