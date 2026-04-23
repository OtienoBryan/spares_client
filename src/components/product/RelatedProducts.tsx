import { Suspense, lazy } from "react";

const LazyProductCard = lazy(() => import("@/components/ui/product-card").then(module => ({ default: module.ProductCard })));

interface RelatedProductsProps {
  products: any[];
  addToCart: (product: any) => void;
}

export const RelatedProducts = ({ products, addToCart }: RelatedProductsProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 md:mt-24 border-t pt-10 sm:pt-12 md:pt-16">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Recommended Components</h2>
        <div className="h-1 flex-1 bg-muted/30 ml-4 hidden sm:block"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 4).map((product) => (
          <Suspense key={product.id} fallback={<div className="h-64 sm:h-72 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazyProductCard
              product={product}
              onAddToCart={addToCart}
            />
          </Suspense>
        ))}
      </div>
    </section>
  );
};
