import type { Category } from "@/services/api";

/**
 * Admin-controlled “Shop by parts” tiles via Category rows.
 *
 * Backend: add optional columns and expose them on GET /categories, e.g.
 * - shopByPartsSort (number, 1-based order) — or snake_case shop_by_parts_sort
 * - shopByPartsLabel (string, optional display override) — or shop_by_parts_label
 *
 * Categories with isActive === true and a numeric sort value appear on the home grid * in ascending order. Others are omitted.
 */
export function getShopByPartsSort(cat: Category): number | undefined {
  const row = cat as Category & {
    shopByPartsSort?: unknown;
    shop_by_parts_sort?: unknown;
  };
  const v = row.shopByPartsSort ?? row.shop_by_parts_sort;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

export function getShopByPartsLabel(cat: Category): string | undefined {
  const row = cat as Category & {
    shopByPartsLabel?: unknown;
    shop_by_parts_label?: unknown;
  };
  const v = row.shopByPartsLabel ?? row.shop_by_parts_label;
  if (typeof v === "string" && v.trim() !== "") return v.trim();
  return undefined;
}

/** Categories to show on home “Shop by parts”, sorted for display. */
export function selectShopByPartsCategories(categories: Category[] | null | undefined): Category[] {
  if (!categories?.length) return [];
  return categories
    .filter((c) => c.isActive && getShopByPartsSort(c) !== undefined)
    .sort((a, b) => (getShopByPartsSort(a)! as number) - (getShopByPartsSort(b)! as number));
}

/** Route slug for /category/:category — matches Category.tsx resolution. */
export function categoryPathSegment(cat: Category): string {
  return cat.name.toLowerCase().replace(/\s+/g, "-");
}
