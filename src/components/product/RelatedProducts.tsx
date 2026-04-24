import { Suspense, lazy } from "react";

const LazyProductCard = lazy(() => import("@/components/ui/product-card").then(module => ({ default: module.ProductCard })));

interface RelatedProductsProps {
  products: any[];
  addToCart: (product: any) => void;
}

export const RelatedProducts = ({ products, addToCart }: RelatedProductsProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-12 md:mt-16 border-t pt-6 sm:pt-8 md:pt-10">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary">Recommended Components</h2>
        <div className="h-1 flex-1 bg-muted/30 ml-4 hidden sm:block"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {products.slice(0, 4).map((product) => (
          <Suspense key={product.id} fallback={<div className="h-44 sm:h-48 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazyProductCard
              product={product}
              onAddToCart={addToCart}
              compact
              related
            />
          </Suspense>
        ))}
      </div>
    </section>
  );
};
