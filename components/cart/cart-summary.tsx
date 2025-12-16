/**
 * Cart Summary Component
 * Displays order summary with pricing breakdown and checkout button
 * Client Component - uses cart context
 */

'use client';

import Link from 'next/link';
import { AlertCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/context/cart-context';
import { FREE_DELIVERY_THRESHOLD } from '@/types';

export function CartSummary() {
  const { subtotal, tax_amount, delivery_fee, total, has_prescription_items, item_count } = useCart();

  // Calculate how much more needed for free delivery
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;
  const qualifiesForFreeDelivery = remainingForFreeDelivery <= 0;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Line Items */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({item_count} {item_count === 1 ? 'item' : 'items'})
            </span>
            <span className="font-medium">₱{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (12% VAT)</span>
            <span className="font-medium">₱{tax_amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            {qualifiesForFreeDelivery ? (
              <span className="font-medium text-accent">FREE</span>
            ) : (
              <span className="font-medium">₱{delivery_fee.toFixed(2)}</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₱{total.toFixed(2)}</span>
        </div>

        {/* Free Delivery Progress */}
        {!qualifiesForFreeDelivery && delivery_fee > 0 && (
          <div className="rounded-lg bg-accent/10 p-3">
            <div className="flex items-start gap-2">
              <Truck className="mt-0.5 h-4 w-4 text-accent" />
              <div className="flex-1 text-xs">
                <p className="font-medium text-accent">
                  Add ₱{remainingForFreeDelivery.toFixed(2)} more for FREE delivery!
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${(subtotal / FREE_DELIVERY_THRESHOLD) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prescription Warning */}
        {has_prescription_items && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your cart contains prescription items. You'll need to upload a valid prescription
              during checkout.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
