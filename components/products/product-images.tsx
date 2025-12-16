/**
 * Product Images Gallery
 * Interactive image gallery with main image and thumbnails
 * Client Component - manages selected image state
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductImagesProps {
  product: Product;
}

export function ProductImages({ product }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : [];

  // Fallback if no images
  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src="/images/unavailable.svg"
          alt="Product image unavailable"
          fill
          className="object-cover opacity-50"
        />
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/unavailable.svg';
            target.srcset = '/images/unavailable.svg';
          }}
        />
      </div>

      {/* Thumbnails - Only show if multiple images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-md border-2 bg-muted transition-all hover:border-primary',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-transparent'
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="150px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/unavailable.svg';
                  target.srcset = '/images/unavailable.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
