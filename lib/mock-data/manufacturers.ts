/**
 * Mock Manufacturer Data
 * Pharmaceutical manufacturers and suppliers
 */

import { Manufacturer } from '@/types';

export const manufacturers: Manufacturer[] = [
  {
    id: 'mfr-unilab',
    name: 'Unilab',
    code: 'UNI',
    license_number: 'PH-MFR-2001-001',
    address: 'Pasig City, Metro Manila, Philippines',
    contact_email: 'info@unilab.com.ph',
    contact_phone: '+63-2-8634-8000',
    logo_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop&auto=format',
    description: 'Leading Philippine pharmaceutical company providing quality medicines since 1945',
    is_verified: true,
    is_active: true,
  },
  {
    id: 'mfr-pfizer',
    name: 'Pfizer',
    code: 'PFZ',
    license_number: 'PH-MFR-2002-002',
    address: 'Makati City, Metro Manila, Philippines',
    contact_email: 'contact@pfizer.com.ph',
    contact_phone: '+63-2-8858-8000',
    logo_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&auto=format',
    description: 'Global pharmaceutical corporation dedicated to improving health worldwide',
    is_verified: true,
    is_active: true,
  },
  {
    id: 'mfr-gsk',
    name: 'GlaxoSmithKline',
    code: 'GSK',
    license_number: 'PH-MFR-2003-003',
    address: 'Taguig City, Metro Manila, Philippines',
    contact_email: 'info@gsk.com.ph',
    contact_phone: '+63-2-8403-3000',
    logo_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop&auto=format',
    description: 'British pharmaceutical company focused on vaccines, specialty, and general medicines',
    is_verified: true,
    is_active: true,
  },
  {
    id: 'mfr-generika',
    name: 'Generika Drugstore',
    code: 'GEN',
    license_number: 'PH-MFR-2004-004',
    address: 'Quezon City, Metro Manila, Philippines',
    contact_email: 'support@generika.com.ph',
    contact_phone: '+63-2-8332-7000',
    logo_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop&auto=format',
    description: 'Leading affordable generic medicine provider in the Philippines',
    is_verified: true,
    is_active: true,
  },
  {
    id: 'mfr-mercurydrug',
    name: 'Mercury Drug',
    code: 'MER',
    license_number: 'PH-MFR-2005-005',
    address: 'Quezon City, Metro Manila, Philippines',
    contact_email: 'customercare@mercurydrug.com.ph',
    contact_phone: '+63-2-8911-5071',
    logo_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop&auto=format',
    description: "Philippines' most trusted pharmacy chain and pharmaceutical distributor",
    is_verified: true,
    is_active: true,
  },
  {
    id: 'mfr-pascual',
    name: 'Pascual Laboratories',
    code: 'PAS',
    license_number: 'PH-MFR-2006-006',
    address: 'Pasig City, Metro Manila, Philippines',
    contact_email: 'info@pascuallab.com',
    contact_phone: '+63-2-8671-5000',
    logo_url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop&auto=format',
    description: 'Local pharmaceutical manufacturer specializing in quality generic medicines',
    is_verified: true,
    is_active: true,
  },
  {
    id: 'mfr-astrazeneca',
    name: 'AstraZeneca',
    code: 'AZ',
    license_number: 'PH-MFR-2007-007',
    address: 'Makati City, Metro Manila, Philippines',
    contact_email: 'info@astrazeneca.com.ph',
    contact_phone: '+63-2-8817-7700',
    logo_url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=200&h=200&fit=crop&auto=format',
    description: 'British-Swedish multinational pharmaceutical and biotechnology company',
    is_verified: true,
    is_active: true,
  },
];

// Helper functions
export function getManufacturerById(id: string): Manufacturer | undefined {
  return manufacturers.find((m) => m.id === id);
}

export function getManufacturerByCode(code: string): Manufacturer | undefined {
  return manufacturers.find((m) => m.code === code);
}

export function getActiveManufacturers(): Manufacturer[] {
  return manufacturers.filter((m) => m.is_active);
}
