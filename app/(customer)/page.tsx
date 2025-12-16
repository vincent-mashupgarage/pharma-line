/**
 * Homepage
 * Main landing page for PharmaLine pharmacy e-commerce
 * Server component - SEO optimized
 */

import { HeroBanner } from '@/components/home/hero-banner';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { FeaturedProducts } from '@/components/home/featured-products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PharmaLine - Your Trusted Online Pharmacy in the Philippines',
  description:
    'Order prescription medicines, vitamins, and health products online. FDA-approved medicines with fast delivery across Metro Manila and the Philippines.',
  keywords:
    'online pharmacy Philippines, buy medicines online, prescription drugs, vitamins, health products, pharmacy delivery',
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedProducts />
    </div>
  );
}
