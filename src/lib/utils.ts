import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a product name into a URL-friendly slug.
 * e.g. "Johnnie Walker Black Label" → "johnnie-walker-black-label"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove non-alphanumeric chars (except spaces/hyphens)
    .replace(/\s+/g, "-")            // replace spaces with hyphens
    .replace(/-+/g, "-");            // collapse multiple hyphens
}

/**
 * Builds the URL slug for a product: "{slugified-name}-{id}"
 * e.g. { id: 42, name: "Johnnie Walker" } → "johnnie-walker-42"
 */
export function productSlug(product: { id: number; name: string }): string {
  return `${slugify(product.name)}-${product.id}`;
}

/**
 * Extracts the numeric product ID from a product slug.
 * e.g. "johnnie-walker-42" → 42
 */
export function slugToProductId(slug: string): number {
  const parts = slug.split("-");
  const id = parseInt(parts[parts.length - 1], 10);
  return isNaN(id) ? 0 : id;
}