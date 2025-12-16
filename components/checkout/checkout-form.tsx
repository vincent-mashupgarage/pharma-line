/**
 * Checkout Form Component
 *
 * Main checkout form with multi-step flow:
 * 1. Customer information
 * 2. Shipping address
 * 3. Payment method
 * 4. Review & submit
 *
 * Client Component - handles form state and submission
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { createOrder } from '@/lib/actions/order-actions';
import type { CheckoutFormData, PaymentMethod } from '@/types';
import { AddressForm } from './address-form';
import { PaymentMethodSelector } from './payment-method';
import { CheckoutSummary } from './checkout-summary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      postal_code: '',
    },
    payment_method: 'cod',
    notes: '',
  });

  // Update form field
  const updateField = (field: keyof CheckoutFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Update address field
  const updateAddress = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shipping_address: {
        ...prev.shipping_address,
        [field]: value,
      },
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.customer_name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.customer_email.trim() || !formData.customer_email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.customer_phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!formData.shipping_address.address_line1.trim()) {
      setError('Please enter your street address');
      return false;
    }
    if (!formData.shipping_address.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!formData.shipping_address.province.trim()) {
      setError('Please enter your province');
      return false;
    }
    if (!formData.shipping_address.postal_code.trim()) {
      setError('Please enter your postal code');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check cart is not empty
    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare cart data for order creation
      const cartData = {
        items: cart.items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          product_generic_name: item.product.generic_name || undefined,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount,
          total_price: item.total_price,
          requires_prescription: item.product.requires_prescription,
        })),
        subtotal: cart.subtotal,
        tax_amount: cart.tax_amount,
        delivery_fee: cart.delivery_fee,
        total: cart.total,
        has_prescription_items: cart.has_prescription_items,
      };

      // Create order
      const result = await createOrder(formData, cartData);

      if (!result.success) {
        setError(result.error || 'Failed to create order');
        toast.error(result.error || 'Failed to create order');
        return;
      }

      // Clear cart on success
      cart.clearCart();

      // Show success message
      toast.success('Order placed successfully!');

      // Redirect to order confirmation page
      router.push(`/checkout/success?order=${result.data?.order_number}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Customer Information */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Customer Information</h2>

            <div className="space-y-2">
              <Label htmlFor="customer_name">Full Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
                placeholder="Juan Dela Cruz"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">Email Address *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => updateField('customer_email', e.target.value)}
                placeholder="juan@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_phone">Phone Number *</Label>
              <Input
                id="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => updateField('customer_phone', e.target.value)}
                placeholder="09171234567"
                required
              />
            </div>
          </div>

          {/* Shipping Address */}
          <AddressForm
            address={formData.shipping_address}
            onUpdate={updateAddress}
          />

          {/* Payment Method */}
          <PaymentMethodSelector
            selectedMethod={formData.payment_method}
            onSelect={(method) => updateField('payment_method', method)}
          />

          {/* Order Notes */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Order Notes (Optional)</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">
                Special instructions or delivery preferences
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="e.g., Leave package with security guard, Ring doorbell, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Prescription Warning */}
          {cart.has_prescription_items && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your order contains prescription items. You will need to upload a
                valid prescription after placing your order. Your order will be
                verified before shipping.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            cart={cart}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}
