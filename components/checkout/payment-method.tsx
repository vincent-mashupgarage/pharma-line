/**
 * Payment Method Selector Component
 *
 * Allows user to select payment method for checkout
 */

'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PaymentMethod } from '@/types';
import { Banknote, CreditCard, Smartphone } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const paymentMethods = [
  {
    id: 'cod' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay with cash when your order is delivered',
    icon: Banknote,
  },
  {
    id: 'gcash' as PaymentMethod,
    name: 'GCash',
    description: 'Pay securely with GCash',
    icon: Smartphone,
    disabled: true, // Not implemented yet
  },
  {
    id: 'credit_card' as PaymentMethod,
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, or other cards',
    icon: CreditCard,
    disabled: true, // Not implemented yet
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>

      <RadioGroup value={selectedMethod} onValueChange={(value) => onSelect(value as PaymentMethod)}>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`relative flex items-start space-x-3 rounded-lg border p-4 ${
                  method.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-accent'
                } ${selectedMethod === method.id ? 'border-primary bg-accent' : ''}`}
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  disabled={method.disabled}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={method.id}
                    className="flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Icon className="h-5 w-5" />
                    {method.name}
                    {method.disabled && (
                      <span className="text-xs text-muted-foreground">
                        (Coming Soon)
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}
