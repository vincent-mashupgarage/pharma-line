/**
 * Address Form Component
 *
 * Shipping address input fields
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ShippingAddress } from '@/types';

interface AddressFormProps {
  address: ShippingAddress;
  onUpdate: (field: string, value: string) => void;
}

export function AddressForm({ address, onUpdate }: AddressFormProps) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-xl font-semibold">Shipping Address</h2>

      <div className="space-y-2">
        <Label htmlFor="address_line1">Street Address *</Label>
        <Input
          id="address_line1"
          value={address.address_line1}
          onChange={(e) => onUpdate('address_line1', e.target.value)}
          placeholder="House No., Street Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line2">
          Apartment, Suite, Building (Optional)
        </Label>
        <Input
          id="address_line2"
          value={address.address_line2 || ''}
          onChange={(e) => onUpdate('address_line2', e.target.value)}
          placeholder="Unit, Floor, Building Name"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={address.city}
            onChange={(e) => onUpdate('city', e.target.value)}
            placeholder="e.g., Manila"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province *</Label>
          <Input
            id="province"
            value={address.province}
            onChange={(e) => onUpdate('province', e.target.value)}
            placeholder="e.g., Metro Manila"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postal_code">Postal Code *</Label>
        <Input
          id="postal_code"
          value={address.postal_code}
          onChange={(e) => onUpdate('postal_code', e.target.value)}
          placeholder="e.g., 1000"
          required
        />
      </div>
    </div>
  );
}
