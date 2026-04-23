import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Suspense, lazy } from "react";
import { Product } from "@/services/api";

import engineIcon from "@/assets/engine.svg";
import suspensionIcon from "@/assets/suspension.svg";
import electricalIcon from "@/assets/electrical.svg";
import brakeIcon from "@/assets/brake.svg";

const LazyProductCard = lazy(() => import("@/components/ui/product-card").then(module => ({ default: module.ProductCard })));

interface CategoryCtaProps {
  allProducts: Product[];
  addToCart: (product: Product) => void;
}

export const CategoryCta = ({ allProducts, addToCart }: CategoryCtaProps) => {
  // Helper function to safely filter products by category (legacy fallback)
  const filterProductsByCategory = (products: Product[], categoryName: string) => {
    if (!products || !Array.isArray(products)) return [];
    return products.filter(p => 
      p && 
      p.category && 
      (typeof p.category === 'string' 
        ? (p.category as string).toLowerCase().includes(categoryName.toLowerCase())
        : p.category.name?.toLowerCase().includes(categoryName.toLowerCase()))
    );
  };

  const categories = [
    { name: "Engine Parts", icon: engineIcon, slug: "engine" },
    { name: "Suspension", icon: suspensionIcon, slug: "suspension" },
    { name: "Electrical", icon: electricalIcon, slug: "electrical" },
    { name: "Braking", icon: brakeIcon, slug: "braking" }
  ];

  // Try to find products for the first category as the "Best Selling" section
  const recommendedProducts = filterProductsByCategory(allProducts, 'engine').slice(0, 8);
  const displayProducts = recommendedProducts.length > 0 ? recommendedProducts : allProducts.slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-background" aria-label="Shop Spares by Category">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Complete range of components for every major vehicle system.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-12">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${category.slug}`}
              className="group"
            >
              <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 hover:border-primary/20 cursor-pointer">
                <div className="mb-3 h-12 sm:h-16 flex items-center justify-center">
                  <div 
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/60 group-hover:bg-primary transition-colors"
                    style={{
                      maskImage: `url(${category.icon})`,
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      maskSize: 'contain',
                      WebkitMaskImage: `url(${category.icon})`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskSize: 'contain',
                    }}
                  />
                </div>
                <h3 className="font-semibold text-primary text-sm sm:text-base">{category.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <Suspense key={product.id} fallback={<div className="h-64 sm:h-72 bg-gray-100 animate-pulse rounded-lg" />}>
              <LazyProductCard
                product={product}
                onAddToCart={addToCart}
              />
            </Suspense>
          ))}
        </div>
      </div>
    </section>
  );
};
