/**
 * Shopping Cart Page
 * Displays cart items, order summary, and checkout options
 * Server Component for SEO, with client components for interactivity
 */

import type { Metadata } from 'next';
import { CartContent } from '@/components/cart/cart-content';

export const metadata: Metadata = {
  title: 'Shopping Cart - PharmaLine',
  description: 'Review your shopping cart and proceed to checkout for fast delivery of medicines and health products.',
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground">
          Review your items and proceed to checkout
        </p>
      </div>

      {/* Cart Content */}
      <CartContent />
    </div>
  );
}
