import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGridCardActions } from "@/components/ProductGridCardActions";
import { productSlug } from "@/lib/utils";
import { formatPrice } from "@/data/products";

interface RelatedProductsProps {
  products: any[];
  addToCart: (product: any) => void;
}

export const RelatedProducts = ({ products, addToCart }: RelatedProductsProps) => {
  if (!products || products.length === 0) return null;
  const visible = products.slice(0, 6);

  return (
    <section className="mt-10 sm:mt-14 border-t border-gray-100 pt-8">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-primary">You May Also Need</h2>
          <p className="text-xs text-muted-foreground mt-0.5">More parts from the same category</p>
        </div>
        {products.length > 6 && (
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {visible.map(product => (
          <div key={product.id} className="group relative">
            <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
              <Link to={`/product/${productSlug(product)}`} className="block">
                <div className="relative overflow-hidden bg-white">
                  <img
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="h-36 sm:h-40 w-full object-contain p-3"
                    loading="lazy"
                    decoding="async"
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <CardContent className="p-2.5 space-y-1">
                  <p className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {product.name}
                  </p>
                  {product.brand && (
                    <p className="text-[10px] text-muted-foreground truncate">{product.brand}</p>
                  )}
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                </CardContent>
              </Link>
              <div className="px-2.5 pb-2.5 pt-0">
                <ProductGridCardActions product={product} onAddToCart={addToCart} />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
