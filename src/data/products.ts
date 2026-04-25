import wineImage from "@/assets/wine-bottle.jpg";
import beerImage from "@/assets/beer-bottles.jpg";
import whiskeyImage from "@/assets/whiskey-bottle.jpg";

// Legacy Product interface for backward compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  alcohol: string;
  alcoholValue: number;
  description: string;
  longDescription: string;
  inStock: boolean;
  stockCount: number;
  brand: string;
  origin: string;
  year?: number;
  volume: string;
  tastingNotes: string[];
  foodPairings: string[];
  servingTemperature: string;
  storageInstructions: string;
  ingredients: string[];
  allergens: string[];
  reviewsList: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }[];
  relatedProducts: string[];
  isPopular?: boolean;
  isDeal?: boolean;
  dealType?: 'discount' | 'bundle' | 'limited';
  size?: string;
  subCategory?: string;
  country: string;
}

// Re-export the API Product interface
export type Product = import('@/services/api').Product;

// Legacy static products for fallback
export const legacyProducts: LegacyProduct[] = [
  // ... (keeping the static data as fallback)
];

// Helper functions for working with API data
export const getBrandsByCategory = (products: Product[]): { [category: string]: string[] } => {
  const brandsByCategory: { [category: string]: string[] } = {};
  
  products.forEach(product => {
    const categoryName = product.category?.name?.toLowerCase() || 'other';
    if (!brandsByCategory[categoryName]) {
      brandsByCategory[categoryName] = [];
    }
    if (product.brand && !brandsByCategory[categoryName].includes(product.brand)) {
      brandsByCategory[categoryName].push(product.brand);
    }
  });
  
  return brandsByCategory;
};

// Helper function to check if product is in stock
export const isProductInStock = (product: Product): boolean => {
  return product.stock > 0;
};

export function coerceNumber(value: unknown): number {
  if (value === null || value === undefined) return NaN;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value === 'string') {
    const n = parseFloat(value.replace(/,/g, ''));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

/**
 * Unit price for grids/cards: uses product.price when > 0, otherwise the lowest SKU price.
 * Handles string decimals from APIs/ORM.
 */
export function getProductListPrice(product: Product): { amount: number; fromMultipleSkus: boolean } {
  const base = coerceNumber(product.price);
  const skuAmounts =
    product.skus?.map((s) => coerceNumber(s.price)).filter((n) => Number.isFinite(n) && n >= 0) ?? [];

  if (Number.isFinite(base) && base > 0) {
    return { amount: base, fromMultipleSkus: false };
  }
  if (skuAmounts.length > 0) {
    const min = Math.min(...skuAmounts);
    const max = Math.max(...skuAmounts);
    return { amount: min, fromMultipleSkus: min < max };
  }
  if (Number.isFinite(base)) {
    return { amount: base, fromMultipleSkus: false };
  }
  return { amount: 0, fromMultipleSkus: false };
}

// Helper function to get discount percentage
export const getDiscountPercentage = (product: Product): number | null => {
  let maxDiscount = 0;
  
  // Check SKU discounts first
  if (product.skus && product.skus.length > 0) {
    product.skus.forEach((sku) => {
      const op = coerceNumber(sku.originalPrice);
      const p = coerceNumber(sku.price);
      if (Number.isFinite(op) && Number.isFinite(p) && op > p) {
        const discount = ((op - p) / op) * 100;
        if (discount > maxDiscount) {
          maxDiscount = discount;
        }
      }
    });
  }
  
  // Check general product discount
  const listP = coerceNumber(product.price);
  const listOp = coerceNumber(product.originalPrice);
  if (Number.isFinite(listOp) && Number.isFinite(listP) && listOp > listP) {
    const discount = ((listOp - listP) / listOp) * 100;
    if (discount > maxDiscount) {
      maxDiscount = discount;
    }
  }
  
  return maxDiscount > 0 ? Math.round(maxDiscount) : null;
};

// Helper function to format price
export const formatPrice = (price: number | string | null | undefined): string => {
  const n = coerceNumber(price);
  if (!Number.isFinite(n)) {
    return '0.00';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};
