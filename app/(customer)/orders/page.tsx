/**
 * Orders History Page
 *
 * Displays user's order history
 * Server Component - fetches orders from Supabase
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserOrders } from '@/lib/actions/order-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  ShoppingBag,
  ChevronRight,
  Calendar,
  MapPin,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'My Orders - PharmaLine',
  description: 'View your order history and track your deliveries.',
};

// Force dynamic rendering (requires authentication)
export const dynamic = 'force-dynamic';

// Helper to get status color and icon
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

// Helper to get status icon
function getStatusIcon(status: string) {
  switch (status) {
    case 'delivered':
      return CheckCircle2;
    case 'confirmed':
    case 'processing':
      return Clock;
    case 'out_for_delivery':
      return Truck;
    case 'cancelled':
    case 'refunded':
      return XCircle;
    default:
      return Package;
  }
}

// Helper to get payment method icon
function getPaymentIcon(method: string | undefined) {
  if (!method) return CreditCard;

  switch (method) {
    case 'cod':
      return Wallet;
    case 'gcash':
    case 'credit_card':
    case 'debit_card':
      return CreditCard;
    default:
      return CreditCard;
  }
}

// Helper to format status label
function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function OrdersPage() {
  // Fetch user orders
  const result = await getUserOrders();

  // Check if user is not authenticated
  const isNotAuthenticated = !result.success && result.error === 'Authentication required';

  const orders = result.data || [];

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
            <BreadcrumbPage>My Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8" />
          My Orders
        </h1>
        <p className="text-muted-foreground mt-2">
          View and track your order history
        </p>
      </div>

      {/* Login Required State */}
      {isNotAuthenticated ? (
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              You need to be logged in to view your order history. Please sign in or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link href="/login?redirect=/orders">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6 max-w-md text-center">
              💡 <strong>Tip:</strong> After placing an order, you can track it using the order number from your confirmation email.
            </p>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        // Empty State (logged in but no orders)
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Orders List - Improved Design
        <div className="space-y-6">
          {orders.map((order) => {
            // const StatusIcon = getStatusIcon(order.status); // Unused in new design
            const PaymentIcon = getPaymentIcon(order.payment_method);
            const items = order.items || [];
            const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

            // Determine status badge style
            let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
            let badgeClass = "";

            switch (order.status) {
              case 'pending':
                badgeVariant = "secondary";
                badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
                break;
              case 'delivered':
                badgeVariant = "default";
                badgeClass = "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400";
                break;
              case 'cancelled':
              case 'refunded':
                badgeVariant = "destructive";
                break;
              default:
                badgeVariant = "secondary";
            }

            return (
              <Card
                key={order.id}
                className="group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-muted/30 px-6 py-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">Order #{order.order_number}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={badgeVariant}
                    className={`px-3 py-1 text-xs font-medium border-0 ${badgeClass}`}
                  >
                    {formatStatus(order.status)}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Left Column: Order Items */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            {/* Product Placeholder Image */}
                            <div className="h-12 w-12 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                <span className="font-bold mr-1">{item.quantity}x</span>
                                {item.product_name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {item.product_generic_name}
                              </p>
                            </div>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-sm text-muted-foreground pl-16">
                            + {items.length - 3} more items
                          </p>
                        )}
                        {items.length === 0 && (
                          <p className="text-sm text-muted-foreground italic">No items details available</p>
                        )}
                      </div>

                      {items.length > 0 && (
                        <div className="mt-4 pt-2">
                          <p className="text-sm text-muted-foreground">
                            Total Items: <span className="font-medium text-foreground">{itemCount}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Order Details */}
                    <div className="flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        {/* Total Amount */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <span className="font-bold text-green-700 dark:text-green-400">$</span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-green-700 dark:text-green-400">
                              ₱{order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment</p>
                            <p className="text-sm font-medium capitalize">
                              {order.payment_method?.replace('_', ' ') || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Deliver to</p>
                            <p className="text-sm font-medium">
                              {order.delivery_city}, {order.delivery_province}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-4 pt-4 mt-auto">
                        {order.status === 'pending' && (
                          <Button variant="link" className="text-muted-foreground hover:text-destructive h-auto p-0" asChild>
                            <Link href={`/orders/${order.id}?action=cancel`}>
                              Cancel Order
                            </Link>
                          </Button>
                        )}

                        <Button
                          asChild
                          className="rounded-full bg-green-700 hover:bg-green-800 text-white px-6"
                        >
                          <Link href={`/orders/${order.id}`}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
