/**
 * Manufacturer Types
 * Represents pharmaceutical manufacturers and suppliers
 */

export interface Manufacturer {
  id: string;
  name: string;
  code: string; // Short code for display (e.g., "UNI", "PFZ")
  license_number?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url: string | null;
  description: string | null;
  is_verified?: boolean;
  is_active: boolean;
}

// Simplified manufacturer for product display
export interface ManufacturerSummary {
  id: string;
  name: string;
  code: string;
  logo_url: string | null;
}
