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

// Helper function to get discount percentage
export const getDiscountPercentage = (product: Product): number | null => {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return null;
  }
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
