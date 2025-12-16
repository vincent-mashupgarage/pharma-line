/**
 * Product Detail Page
 * Displays full product information, images, and related products
 * Server Component for SEO and data fetching
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight, AlertCircle } from 'lucide-react';
import {
  getProductBySlug,
  getRelatedProducts,
  getProductSubstitutes,
} from '@/lib/mock-data/products';
import { getCategoryById } from '@/lib/mock-data/categories';
import { getManufacturerById } from '@/lib/mock-data/manufacturers';
import { calculatePriceInfo } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ProductImages } from '@/components/products/product-images';
import { AddToCartSection } from '@/components/products/add-to-cart-section';
import { ProductTabs } from '@/components/products/product-tabs';
import { RelatedProductsSection } from '@/components/products/related-products-section';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - PharmaLine`,
    description: product.short_description || product.description,
    keywords: [
      product.name,
      product.generic_name,
      product.product_type,
      'pharmacy',
      'medicine',
    ].filter(Boolean).join(', '),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Return 404 if product not found
  if (!product) {
    notFound();
  }

  // Get related data
  const category = getCategoryById(product.category_id);
  const manufacturer = getManufacturerById(product.manufacturer_id);
  const relatedProducts = getRelatedProducts(product.id, 4);
  const substitutes = getProductSubstitutes(product.id, 4);

  // Calculate pricing
  const priceInfo = calculatePriceInfo(product);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/products?category=${category.slug}`}>
                  {category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Details Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Images */}
        <div>
          <ProductImages product={product} />
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Product Title */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.generic_name && (
              <p className="mt-1 text-lg text-muted-foreground">
                {product.generic_name}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.requires_prescription && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Prescription Required
              </Badge>
            )}
            {product.is_controlled_substance && (
              <Badge variant="destructive">
                Controlled Substance - {product.schedule_type?.replace('_', ' ')}
              </Badge>
            )}
            {product.discount_percentage > 0 && (
              <Badge className="bg-accent">
                {product.discount_percentage}% OFF
              </Badge>
            )}
            {product.is_featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ₱{priceInfo.final_price.toFixed(2)}
              </span>
              {priceInfo.savings > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  ₱{priceInfo.original_price.toFixed(2)}
                </span>
              )}
            </div>
            {priceInfo.savings > 0 && (
              <p className="text-sm text-accent">
                You save ₱{priceInfo.savings.toFixed(2)} ({product.discount_percentage}%)
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {product.pack_size}
            </p>
          </div>

          {/* Manufacturer */}
          {manufacturer && (
            <div className="text-sm">
              <span className="text-muted-foreground">Manufacturer: </span>
              <span className="font-medium">{manufacturer.name}</span>
            </div>
          )}

          {/* Add to Cart Section */}
          <AddToCartSection product={product} />

          {/* Short Description */}
          {product.short_description && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">{product.short_description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <ProductTabs product={product} />
      </div>

      {/* Generic Substitutes */}
      {substitutes.length > 0 && (
        <div className="mt-12">
          <RelatedProductsSection
            products={substitutes}
            title="Generic Alternatives"
          />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <RelatedProductsSection
            products={relatedProducts}
            title="You May Also Like"
          />
        </div>
      )}
    </div>
  );
}
