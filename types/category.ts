/**
 * Category Types
 * Supports hierarchical category structure for the product catalog
 */

// Base category interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null; // null = top-level category
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  meta_data?: Record<string, unknown>;
  created_at: string;
}

// Category with nested children for tree structure (navigation menus)
export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// Flattened category option for filter dropdowns
export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  level: number; // 0 = top level, 1 = subcategory, etc.
  parent_name: string | null;
  product_count?: number;
}

// Helper function to build category tree from flat array
export function buildCategoryTree(flatCategories: Category[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>();
  const roots: CategoryWithChildren[] = [];

  // First pass: create all nodes with empty children arrays
  flatCategories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Second pass: build tree by linking children to parents
  flatCategories.forEach((cat) => {
    const node = categoryMap.get(cat.id)!;
    if (cat.parent_id) {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  // Sort by sort_order
  const sortByOrder = (a: CategoryWithChildren, b: CategoryWithChildren) =>
    a.sort_order - b.sort_order;

  roots.sort(sortByOrder);
  roots.forEach((root) => {
    root.children.sort(sortByOrder);
  });

  return roots;
}

// Helper function to flatten category tree for filter options
export function flattenCategories(
  categories: Category[],
  parentName: string | null = null,
  level: number = 0
): CategoryOption[] {
  const result: CategoryOption[] = [];

  const topLevel = categories.filter((c) =>
    level === 0 ? c.parent_id === null : c.parent_id === parentName
  );

  topLevel.forEach((cat) => {
    result.push({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      level,
      parent_name: parentName,
    });

    // Add children
    const children = categories.filter((c) => c.parent_id === cat.id);
    if (children.length > 0) {
      children.forEach((child) => {
        result.push({
          id: child.id,
          name: child.name,
          slug: child.slug,
          level: level + 1,
          parent_name: cat.name,
        });
      });
    }
  });

  return result;
}
