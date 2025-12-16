/**
 * Order Detail Page
 *
 * Displays detailed information about a specific order
 * Server Component - fetches order from Supabase
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getOrderById } from '@/lib/actions/order-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, CreditCard, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'Order Details - PharmaLine',
  description: 'View your order details and track your delivery.',
};

// Force dynamic rendering (requires authentication)
export const dynamic = 'force-dynamic';

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

// Helper to get status color
function getStatusColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'delivered':
      return 'default';
    case 'confirmed':
    case 'processing':
    case 'out_for_delivery':
      return 'secondary';
    case 'cancelled':
    case 'refunded':
      return 'destructive';
    default:
      return 'outline';
  }
}

// Helper to format status label
function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;

  // Fetch order details
  const result = await getOrderById(orderId);

  // Check if user is not authenticated
  const isNotAuthenticated = !result.success && result.error === 'Authentication required';

  // If order not found, show 404
  if (!isNotAuthenticated && (!result.success || !result.data)) {
    notFound();
  }

  const order = result.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{order?.order_number || 'Order Details'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/orders">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      {/* Login Required State */}
      {isNotAuthenticated ? (
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              You need to be logged in to view order details. Please sign in or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link href="/login?redirect=/orders">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/orders">Back to Orders</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6 max-w-md text-center">
              💡 <strong>Tip:</strong> Guest orders can be viewed using the confirmation link sent to your email.
            </p>
          </CardContent>
        </Card>
      ) : order ? (
        <>
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-mono">{order.order_number}</h1>
              <p className="text-muted-foreground mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <Badge variant={getStatusColor(order.status)} className="text-base px-4 py-2">
              {formatStatus(order.status)}
            </Badge>
          </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Items and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-2">
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.product_generic_name && `${item.product_generic_name} • `}
                        SKU: {item.product_sku}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ₱{item.unit_price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">₱{item.total_price.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No items found</p>
              )}

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

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Shipping and Payment Info */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
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
                <p className="font-medium text-sm">
                  {order.delivery_address_line1}
                  {order.delivery_address_line2 && `, ${order.delivery_address_line2}`}
                </p>
                <p className="font-medium text-sm">
                  {order.delivery_city}, {order.delivery_province} {order.delivery_postal_code}
                </p>
              </div>
              <Separator />
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{order.customer_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{order.customer_phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">
                  {order.payment_method?.replace('_', ' ') || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                  {order.payment_status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Warning */}
          {order.has_prescription_items && (
            <Card className="border-accent">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Package className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Prescription Required</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.requires_prescription_verification
                        ? 'Your prescription is being verified.'
                        : 'Prescription verified and approved.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
        </>
      ) : null}
    </div>
  );
}
