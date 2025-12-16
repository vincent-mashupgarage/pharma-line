/**
 * Order Confirmation / Success Page
 *
 * Displays order confirmation after successful checkout
 * Shows order details and next steps
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByNumber } from '@/lib/actions/order-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Package, MapPin, CreditCard, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmed - PharmaLine',
  description: 'Your order has been successfully placed.',
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order;

  // Redirect if no order number
  if (!orderNumber) {
    notFound();
  }

  // Fetch order details
  const result = await getOrderByNumber(orderNumber);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
            <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Number */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-mono font-bold">{order.order_number}</p>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="secondary" className="mt-1">
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">
                  {order.payment_method?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.product_generic_name && `${item.product_generic_name} • `}
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">₱{item.total_price.toFixed(2)}</p>
              </div>
            ))}

            <Separator />

            {/* Order Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₱{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (12% VAT)</span>
                <span>₱{order.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>
                  {order.delivery_fee === 0 ? (
                    <span className="text-accent font-medium">FREE</span>
                  ) : (
                    `₱${order.delivery_fee.toFixed(2)}`
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₱{order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Deliver to</p>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                {order.delivery_address_line1}
                {order.delivery_address_line2 && `, ${order.delivery_address_line2}`}
              </p>
              <p className="font-medium">
                {order.delivery_city}, {order.delivery_province} {order.delivery_postal_code}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </p>
                <p className="font-medium">{order.customer_phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescription Items Warning */}
        {order.has_prescription_items && (
          <Card className="mb-6 border-accent">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <CreditCard className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Prescription Required</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your order contains prescription items. Please upload your valid
                    prescription within 24 hours. We'll verify it before processing
                    your order.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/orders">View My Orders</Link>
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-8 bg-muted">
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>You'll receive an order confirmation email</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>
                  {order.has_prescription_items
                    ? 'Upload your prescription for verification'
                    : "We'll process and pack your order"}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Your order will be shipped to your address</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Track your delivery status in your orders page</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
