/**
 * Cart Icon Component
 * Displays shopping cart icon with item count badge in header
 * Client component - uses cart context for live updates
 */

'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CartIcon() {
  const { item_count } = useCart();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative" aria-label="Shopping cart">
        <ShoppingCart className="h-5 w-5" />
        {item_count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {item_count > 99 ? '99+' : item_count}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
