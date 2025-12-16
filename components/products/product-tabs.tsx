/**
 * Product Tabs Component
 * Displays product description, warnings, and additional info in tabs
 * Client Component - uses shadcn tabs for interactivity
 */

'use client';

import { AlertTriangle, FileText, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Product } from '@/types';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description" className="gap-2">
          <FileText className="h-4 w-4" />
          Description
        </TabsTrigger>
        <TabsTrigger value="warnings" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          Warnings
        </TabsTrigger>
        <TabsTrigger value="details" className="gap-2">
          <Info className="h-4 w-4" />
          Details
        </TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description" className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Product Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {product.short_description && (
          <div>
            <h3 className="mb-2 font-semibold">Summary</h3>
            <p className="text-sm text-muted-foreground">
              {product.short_description}
            </p>
          </div>
        )}
      </TabsContent>

      {/* Warnings Tab */}
      <TabsContent value="warnings" className="space-y-4">
        {product.warnings && product.warnings.length > 0 ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Warnings</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {product.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            No specific warnings for this product. Always consult your healthcare provider before use.
          </p>
        )}

        {product.requires_prescription && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Prescription Required</AlertTitle>
            <AlertDescription className="text-sm">
              This product requires a valid prescription from a licensed healthcare professional.
              You will need to upload your prescription during checkout.
            </AlertDescription>
          </Alert>
        )}

        {product.is_controlled_substance && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Controlled Substance - {product.schedule_type?.replace('_', ' ').toUpperCase()}</AlertTitle>
            <AlertDescription className="text-sm">
              This is a controlled substance under Philippine law. Strict prescription requirements apply.
              Misuse or unauthorized distribution is prohibited by law.
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>

      {/* Details Tab */}
      <TabsContent value="details" className="space-y-4">
        <div className="grid gap-3 text-sm">
          {product.generic_name && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Generic Name:</span>
              <span className="text-muted-foreground">{product.generic_name}</span>
            </div>
          )}

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Dosage Form:</span>
            <span className="text-muted-foreground capitalize">
              {product.dosage_form || 'N/A'}
            </span>
          </div>

          {product.strength && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Strength:</span>
              <span className="text-muted-foreground">{product.strength}</span>
            </div>
          )}

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Pack Size:</span>
            <span className="text-muted-foreground">{product.pack_size}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Product Type:</span>
            <span className="text-muted-foreground capitalize">
              {product.product_type.replace('_', ' ')}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">SKU:</span>
            <span className="text-muted-foreground">{product.sku}</span>
          </div>

          {product.requires_prescription && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Prescription:</span>
              <span className="text-destructive font-medium">Required</span>
            </div>
          )}

          {product.is_controlled_substance && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Controlled Substance:</span>
              <span className="text-destructive font-medium">
                Yes ({product.schedule_type?.replace('_', ' ')})
              </span>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
