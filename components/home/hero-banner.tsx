/**
 * Hero Banner Component
 * Homepage hero section with call-to-action
 * Server component - static content
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Trusted Online Pharmacy
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Health,{' '}
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Order prescription medicines, health products, and vitamins online.
              Fast, reliable delivery across the Philippines.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/products?product_type=prescription">
                  Upload Prescription
                </Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <ShieldCheck className="mb-3 h-10 w-10 text-primary" />
              <h3 className="mb-2 font-semibold">FDA Approved</h3>
              <p className="text-sm text-muted-foreground">
                All medicines verified and approved by Philippine FDA
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <Truck className="mb-3 h-10 w-10 text-accent" />
              <h3 className="mb-2 font-semibold">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Same-day delivery available in Metro Manila
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <Clock className="mb-3 h-10 w-10 text-primary" />
              <h3 className="mb-2 font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Licensed pharmacists available to assist you
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <ShieldCheck className="mb-3 h-10 w-10 text-accent" />
              <h3 className="mb-2 font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Safe and encrypted payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
