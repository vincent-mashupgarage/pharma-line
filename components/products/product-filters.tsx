/**
 * Product Filters Component
 * Sidebar with comprehensive filtering options
 * Client component - manages filter state via URL params
 */

'use client';

import { useState } from 'react';
import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useFilters } from '@/lib/hooks/use-filters';
import { getTopLevelCategories, getSubcategories } from '@/lib/mock-data/categories';
import { getActiveManufacturers } from '@/lib/mock-data/manufacturers';
import { ScrollArea } from '@/components/ui/scroll-area';

const productTypes = [
  { value: 'otc', label: 'Over-the-Counter (OTC)' },
  { value: 'prescription', label: 'Prescription Required' },
  { value: 'health_product', label: 'Health Products' },
] as const;

export function ProductFilters() {
  const { filters, setFilters, clearFilters } = useFilters();
  const topCategories = getTopLevelCategories();
  const manufacturers = getActiveManufacturers();

  // Local state for price range (updates on release)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.price_min ?? 0,
    filters.price_max ?? 5000,
  ]);

  const hasActiveFilters =
    filters.category ||
    filters.product_type ||
    filters.manufacturer ||
    filters.requires_prescription !== null ||
    filters.in_stock_only ||
    filters.price_min !== null ||
    filters.price_max !== null;

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceCommit = (value: number[]) => {
    setFilters({
      price_min: value[0] > 0 ? value[0] : null,
      price_max: value[1] < 5000 ? value[1] : null,
    });
  };

  const toggleCategory = (categorySlug: string) => {
    setFilters({ category: filters.category === categorySlug ? null : categorySlug });
  };

  const toggleProductType = (type: string) => {
    setFilters({ product_type: filters.product_type === type ? null : type as any });
  };

  const toggleManufacturer = (manufacturerId: string) => {
    setFilters({
      manufacturer: filters.manufacturer === manufacturerId ? null : manufacturerId
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <FilterX className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6 pr-4">
          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-medium">Categories</h3>
            <div className="space-y-2">
              {topCategories.map((category) => {
                const subcategories = getSubcategories(category.id);
                const isSelected = filters.category === category.slug;

                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category.id}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleCategory(category.slug)}
                      />
                      <Label
                        htmlFor={`cat-${category.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>

                    {/* Subcategories */}
                    {subcategories.length > 0 && (
                      <div className="ml-6 space-y-2">
                        {subcategories.map((subcat) => {
                          const isSubSelected = filters.category === subcat.slug;
                          return (
                            <div key={subcat.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`cat-${subcat.id}`}
                                checked={isSubSelected}
                                onCheckedChange={() => toggleCategory(subcat.slug)}
                              />
                              <Label
                                htmlFor={`cat-${subcat.id}`}
                                className="text-sm font-normal text-muted-foreground cursor-pointer"
                              >
                                {subcat.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Price Range</h3>
              <span className="text-sm text-muted-foreground">
                ₱{priceRange[0]} - ₱{priceRange[1]}
              </span>
            </div>
            <Slider
              min={0}
              max={5000}
              step={50}
              value={priceRange}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceCommit}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Product Type */}
          <div className="space-y-3">
            <h3 className="font-medium">Product Type</h3>
            <div className="space-y-2">
              {productTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.product_type === type.value}
                    onCheckedChange={() => toggleProductType(type.value)}
                  />
                  <Label
                    htmlFor={`type-${type.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Prescription Requirement */}
          <div className="space-y-3">
            <h3 className="font-medium">Prescription</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requires-rx"
                  checked={filters.requires_prescription === true}
                  onCheckedChange={(checked) =>
                    setFilters({ requires_prescription: checked ? true : null })
                  }
                />
                <Label
                  htmlFor="requires-rx"
                  className="text-sm font-normal cursor-pointer"
                >
                  Requires Prescription
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="no-rx"
                  checked={filters.requires_prescription === false}
                  onCheckedChange={(checked) =>
                    setFilters({ requires_prescription: checked ? false : null })
                  }
                />
                <Label
                  htmlFor="no-rx"
                  className="text-sm font-normal cursor-pointer"
                >
                  No Prescription Needed
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div className="space-y-3">
            <h3 className="font-medium">Availability</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.in_stock_only}
                onCheckedChange={(checked) =>
                  setFilters({ in_stock_only: checked ? true : false })
                }
              />
              <Label
                htmlFor="in-stock"
                className="text-sm font-normal cursor-pointer"
              >
                In Stock Only
              </Label>
            </div>
          </div>

          <Separator />

          {/* Manufacturers */}
          <div className="space-y-3">
            <h3 className="font-medium">Manufacturer</h3>
            <div className="space-y-2">
              {manufacturers.map((manufacturer) => (
                <div key={manufacturer.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mfr-${manufacturer.id}`}
                    checked={filters.manufacturer === manufacturer.id}
                    onCheckedChange={() => toggleManufacturer(manufacturer.id)}
                  />
                  <Label
                    htmlFor={`mfr-${manufacturer.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {manufacturer.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
