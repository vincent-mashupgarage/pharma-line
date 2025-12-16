/**
 * Database Seed Script
 *
 * Populates Supabase database with mock data from lib/mock-data/
 * Run with: npx tsx scripts/seed-database.ts
 *
 * Note: Uses service role key to bypass RLS policies
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createAdminClient } from '../lib/supabase/admin';
import { manufacturers } from '../lib/mock-data/manufacturers';
import { categories } from '../lib/mock-data/categories';
import { products } from '../lib/mock-data/products';
import { randomUUID } from 'crypto';

const supabase = createAdminClient();

// ID mapping from mock data string IDs to database UUIDs
const idMap = new Map<string, string>();

// Generate or get UUID for a given mock ID
function getOrCreateUUID(mockId: string): string {
  if (!idMap.has(mockId)) {
    idMap.set(mockId, randomUUID());
  }
  return idMap.get(mockId)!;
}

async function seedManufacturers() {
  console.log('\n📦 Seeding manufacturers...');

  const { data, error} = await supabase
    .from('manufacturers')
    .upsert(
      manufacturers.map(m => ({
        id: getOrCreateUUID(m.id),
        name: m.name,
        code: m.code,
        license_number: m.license_number,
        address: m.address,
        contact_email: m.contact_email,
        contact_phone: m.contact_phone,
        logo_url: m.logo_url,
        description: m.description,
        is_verified: m.is_verified,
        is_active: m.is_active,
      })),
      { onConflict: 'id' }
    )
    .select();

  if (error) {
    console.error('❌ Error seeding manufacturers:', error.message);
    throw error;
  }

  console.log(`✅ Seeded ${manufacturers.length} manufacturers`);
}

async function seedCategories() {
  console.log('\n📂 Seeding categories...');

  const { data, error } = await supabase
    .from('categories')
    .upsert(
      categories.map(c => ({
        id: getOrCreateUUID(c.id),
        name: c.name,
        slug: c.slug,
        description: c.description,
        parent_id: c.parent_id ? getOrCreateUUID(c.parent_id) : null,
        image_url: c.image_url,
        is_active: c.is_active,
        sort_order: c.sort_order,
      })),
      { onConflict: 'id' }
    )
    .select();

  if (error) {
    console.error('❌ Error seeding categories:', error.message);
    throw error;
  }

  console.log(`✅ Seeded ${categories.length} categories`);
}

async function seedProducts() {
  console.log('\n💊 Seeding products...');

  const { data: insertedProducts, error: productsError } = await supabase
    .from('products')
    .upsert(
      products.map(p => ({
        id: getOrCreateUUID(p.id),
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        generic_name: p.generic_name,
        description: p.description,
        short_description: p.short_description,
        category_id: getOrCreateUUID(p.category_id),
        manufacturer_id: getOrCreateUUID(p.manufacturer_id),
        product_type: p.product_type,
        dosage_form: p.dosage_form,
        strength: p.strength,
        pack_size: p.pack_size,
        unit_of_measure: p.unit_of_measure,
        base_price: p.base_price,
        discount_percentage: p.discount_percentage,
        tax_rate: 0.12, // 12% VAT
        requires_prescription: p.requires_prescription,
        is_controlled_substance: p.is_controlled_substance,
        schedule_type: p.schedule_type,
        storage_conditions: p.storage_conditions || null,
        is_refrigerated: p.is_refrigerated || false,
        warnings: p.warnings,
        ingredients: p.ingredients || null,
        stock_quantity: p.stock_quantity,
        max_order_quantity: p.max_order_quantity,
        min_order_quantity: 1,
        is_active: p.is_active,
        is_featured: p.is_featured,
        created_at: p.created_at,
        updated_at: p.updated_at,
      })),
      { onConflict: 'id' }
    )
    .select();

  if (productsError) {
    console.error('❌ Error seeding products:', productsError.message);
    throw productsError;
  }

  console.log(`✅ Seeded ${products.length} products`);

  // Now seed product images
  console.log('\n🖼️  Seeding product images...');

  const imageInserts = products.flatMap(p =>
    p.images.map(img => ({
      id: getOrCreateUUID(img.id),
      product_id: getOrCreateUUID(p.id),
      url: img.url,
      alt: img.alt,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
    }))
  );

  const { data: insertedImages, error: imagesError } = await supabase
    .from('product_images')
    .upsert(imageInserts, { onConflict: 'id' })
    .select();

  if (imagesError) {
    console.error('❌ Error seeding product images:', imagesError.message);
    throw imagesError;
  }

  console.log(`✅ Seeded ${imageInserts.length} product images`);
}

async function main() {
  console.log('🚀 Starting database seed...');
  console.log('============================');

  try {
    await seedManufacturers();
    await seedCategories();
    await seedProducts();

    console.log('\n============================');
    console.log('✅ Database seeded successfully!');
    console.log('============================\n');

    console.log('📊 Summary:');
    console.log(`   - ${manufacturers.length} manufacturers`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${products.length} products`);
    console.log(`   - ${products.reduce((acc, p) => acc + p.images.length, 0)} product images`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seed script
main();
