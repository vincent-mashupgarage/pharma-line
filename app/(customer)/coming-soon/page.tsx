/**
 * Coming Soon Page
 *
 * Displays a friendly message for pages that are under development
 * Shows which page the user was trying to access via query params
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Construction, Home, Mail } from 'lucide-react';
import { BackButton } from '@/components/back-button';

export const metadata: Metadata = {
  title: 'Coming Soon - PharmaLine',
  description: 'This page is currently under development.',
};

export default function ComingSoonPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Get the page name from query params
  const pageName = searchParams.page
    ? searchParams.page.charAt(0).toUpperCase() + searchParams.page.slice(1)
    : 'This Page';

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-dashed border-primary/30">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            {/* Icon */}
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Construction className="h-12 w-12 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4 text-center">
              {pageName} Coming Soon!
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
              We're working hard to bring you this feature. Check back soon for updates!
            </p>

            {/* Info Box */}
            <div className="w-full bg-muted/50 rounded-lg p-6 mb-8 border border-border/50">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Want to be notified?</h3>
                  <p className="text-sm text-muted-foreground">
                    Stay tuned for updates on this feature. We'll announce when it's ready!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="gap-2"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>

              <BackButton />
            </div>

            {/* Additional Links */}
            <div className="mt-8 pt-8 border-t border-border/50 w-full">
              <p className="text-sm text-muted-foreground text-center mb-4">
                In the meantime, check out:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="link" size="sm">
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button asChild variant="link" size="sm">
                  <Link href="/orders">My Orders</Link>
                </Button>
                <Button asChild variant="link" size="sm">
                  <Link href="/cart">Shopping Cart</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          This page is currently under development. We appreciate your patience!
        </p>
      </div>
    </div>
  );
}
