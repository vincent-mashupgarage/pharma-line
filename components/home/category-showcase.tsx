/**
 * Category Showcase Component
 * Display main product categories on homepage
 * Server component - fetches category data
 */

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getTopLevelCategories } from '@/lib/mock-data/categories';
import { Pill, Heart, Baby, Stethoscope, Bandage, Sparkles } from 'lucide-react';

// Map category slugs to icons
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'medicines': Pill,
  'vitamins-supplements': Heart,
  'personal-care': Sparkles,
  'medical-devices': Stethoscope,
  'baby-child': Baby,
  'first-aid': Bandage,
};

export function CategoryShowcase() {
  const categories = getTopLevelCategories();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Browse our wide selection of health products and medicines
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || Pill;
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group"
              >
                <Card className="transition-all hover:shadow-md hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-sm font-medium group-hover:text-primary">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
