/**
 * Empty Cart Component
 * Displays when shopping cart is empty
 * Server Component - no interactivity needed
 */

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyCart() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-6">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">Your cart is empty</h2>
      <p className="mb-6 text-muted-foreground">
        Add some products to your cart to get started
      </p>
      <Button asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
}
