/**
 * Checkout Page
 *
 * Main checkout page where users complete their purchase
 * Server Component for SEO, renders client form component
 */

import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'Checkout - PharmaLine',
  description: 'Complete your order securely at PharmaLine. Fast delivery across the Philippines.',
};

export default function CheckoutPage() {
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
            <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Checkout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">
          Complete your order information below
        </p>
      </div>

      {/* Checkout Form */}
      <CheckoutForm />
    </div>
  );
}
