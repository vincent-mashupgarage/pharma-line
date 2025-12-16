/**
 * Cart Item Component
 * Displays individual cart item with quantity controls and remove button
 * Client Component - manages quantity updates
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, unit_price, discount_amount, total_price } = item;

  const handleIncrement = () => {
    // Check max order quantity if set
    if (product.max_order_quantity && quantity >= product.max_order_quantity) {
      toast.error('Maximum quantity reached', {
        description: `You can only order up to ${product.max_order_quantity} units of this product.`,
      });
      return;
    }

    // Check stock availability
    if (quantity >= product.stock_quantity) {
      toast.error('Not enough stock', {
        description: 'You have reached the maximum available quantity.',
      });
      return;
    }

    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
    toast.success('Item removed', {
      description: `${product.name} has been removed from your cart.`,
    });
  };

  const finalPrice = total_price / quantity;
  const hasDiscount = product.discount_percentage > 0;

  return (
    <div className="flex gap-4 border-b py-4 last:border-b-0">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link
              href={`/products/${product.slug}`}
              className="font-medium hover:text-primary"
            >
              {product.name}
            </Link>
            {product.generic_name && (
              <p className="text-sm text-muted-foreground">{product.generic_name}</p>
            )}
            <p className="text-xs text-muted-foreground">{product.pack_size}</p>

            {/* Prescription Badge */}
            {product.requires_prescription && (
              <Badge variant="destructive" className="mt-2 gap-1">
                <AlertCircle className="h-3 w-3" />
                Prescription Required
              </Badge>
            )}
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>

        {/* Price and Quantity Controls */}
        <div className="mt-auto flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={quantity >= product.stock_quantity}
              className="h-8 w-8"
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            {hasDiscount ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold">₱{total_price.toFixed(2)}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="line-through">₱{(unit_price * quantity).toFixed(2)}</span>
                  <Badge variant="secondary" className="h-5 px-1 text-xs">
                    {product.discount_percentage}% OFF
                  </Badge>
                </div>
              </div>
            ) : (
              <span className="text-sm font-bold">₱{total_price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
