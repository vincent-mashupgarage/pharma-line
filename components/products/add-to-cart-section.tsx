/**
 * Add to Cart Section
 * Quantity selector and add to cart button
 * Client Component - manages quantity state and cart actions
 */

'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';

interface AddToCartSectionProps {
  product: Product;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addItem, getItemQuantity, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const currentCartQuantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);
  const isOutOfStock = product.stock_quantity === 0;

  // Calculate max quantity user can add
  const maxQuantity = Math.min(
    product.stock_quantity - currentCartQuantity,
    product.max_order_quantity || product.stock_quantity
  );

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (product.requires_prescription) {
      toast.warning('Prescription Required', {
        description: 'This product requires a valid prescription. Add to cart and upload prescription at checkout.',
      });
    }

    addItem(product, quantity);
    toast.success('Added to cart', {
      description: `${quantity} x ${product.name} added to your cart.`,
    });

    // Reset quantity to 1 after adding
    setQuantity(1);
  };

  return (
    <div className="space-y-4">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Out of Stock
          </Badge>
        ) : product.stock_quantity < 10 ? (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Only {product.stock_quantity} left in stock
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Check className="h-3 w-3" />
            In Stock
          </Badge>
        )}

        {inCart && (
          <Badge variant="outline">
            {currentCartQuantity} in cart
          </Badge>
        )}
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {maxQuantity} available
            </span>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock || maxQuantity === 0}
        size="lg"
        className="w-full gap-2"
      >
        <ShoppingCart className="h-5 w-5" />
        {isOutOfStock ? 'Out of Stock' : inCart ? 'Add More to Cart' : 'Add to Cart'}
      </Button>

      {/* Max Order Quantity Warning */}
      {product.max_order_quantity && (
        <p className="text-xs text-muted-foreground">
          Maximum order quantity: {product.max_order_quantity} per transaction
        </p>
      )}
    </div>
  );
}
