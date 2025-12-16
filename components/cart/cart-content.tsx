/**
 * Cart Content Component
 * Main cart content wrapper - displays cart items or empty state
 * Client Component - uses cart context and manages clear cart
 */

'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { EmptyCart } from './empty-cart';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function CartContent() {
  const { items, item_count, clearCart } = useCart();

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared', {
      description: 'All items have been removed from your cart.',
    });
  };

  // Show empty state if no items
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items - Takes 2 columns on large screens */}
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Shopping Cart ({item_count} {item_count === 1 ? 'item' : 'items'})
          </h2>

          {/* Clear Cart Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear shopping cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all items from your cart. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearCart}>Clear Cart</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Cart Items List */}
        <div className="rounded-lg border bg-card p-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Order Summary - Takes 1 column on large screens */}
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
}
