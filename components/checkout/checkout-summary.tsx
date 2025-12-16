/**
 * Checkout Summary Component
 *
 * Displays order summary with totals and place order button
 * Shown in sidebar during checkout
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CartState } from '@/types';
import { Loader2, ShoppingBag } from 'lucide-react';

interface CheckoutSummaryProps {
  cart: CartState;
  isSubmitting: boolean;
}

export function CheckoutSummary({ cart, isSubmitting }: CheckoutSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-muted-foreground">
                  Qty: {item.quantity} × ₱{item.unit_price.toFixed(2)}
                </p>
              </div>
              <p className="font-medium">₱{item.total_price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₱{cart.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (12% VAT)</span>
            <span>₱{cart.tax_amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>
              {cart.delivery_fee === 0 ? (
                <span className="text-accent font-medium">FREE</span>
              ) : (
                `₱${cart.delivery_fee.toFixed(2)}`
              )}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">₱{cart.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Item Count */}
        <div className="text-xs text-muted-foreground text-center">
          {cart.item_count} {cart.item_count === 1 ? 'item' : 'items'} in cart
        </div>
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || cart.items.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing Order...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
