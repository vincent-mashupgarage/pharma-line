/**
 * Product Not Found Page
 * Displays when product slug is not found
 */

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-6">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Product Not Found</h1>
        <p className="mb-6 max-w-md text-muted-foreground">
          The product you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
