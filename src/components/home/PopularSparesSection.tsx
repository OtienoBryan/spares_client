import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGridCardActions } from "@/components/ProductGridCardActions";
import { productSlug } from "@/lib/utils";
import { formatPrice } from "@/data/products";

interface PopularSparesSectionProps {
  products: any[];
  addToCart: (product: any) => void;
  loading: boolean;
  error: any;
}

export const PopularSparesSection = ({
  products,
  addToCart,
  loading,
  error
}: PopularSparesSectionProps) => {
  if (loading) {
    return (
      <section className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-Component/5 to-primary/5">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse flex flex-col h-full bg-white rounded-lg p-2">
                <div className="h-44 sm:h-48 w-full bg-muted mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !products || products.length === 0) {
    return null; // Don't show the section if it's empty/erroring for now
  }

  return (
    <section className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-Component/5 to-primary/5" aria-label="Fast-Moving Spares">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-primary mb-0.5 sm:mb-1">
              Fast-Moving Spares
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
              Most requested genuine automotive spare parts.
            </p>
          </div>
          <Link to="/category/spares" className="shrink-0">
            <Button size="sm" className="bg-primary hover:bg-primary/90 active:bg-primary/80 text-white px-3 py-2 sm:px-4 md:px-6 text-xs sm:text-sm touch-manipulation">
              View All
              <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {products.slice(0, 12).map((product) => (
            <div key={product.id} className="relative group">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 flex flex-col h-full">
                <Link to={`/product/${productSlug(product)}`} className="block flex-1 min-w-0 touch-manipulation cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="h-44 sm:h-48 md:h-52 lg:h-56 w-full object-contain bg-white"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Fast Mover Badge */}
                    <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-purple-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                      TOP SELLING
                    </div>
                    {/* Discount Badge */}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <CardContent className="p-2 sm:p-2 md:p-3 lg:p-3">
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {product.skus && product.skus.length > 0 ? (
                          <>
                            {product.skus.map((sku: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-1 sm:gap-2">
                                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{sku.code}:</span>
                                <span className="text-xs sm:text-xs md:text-sm font-bold text-primary">
                                  {formatPrice(sku.price)}
                                </span>
                                {sku.originalPrice && (
                                  <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                    {formatPrice(sku.originalPrice)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-xs sm:text-xs md:text-sm lg:text-base font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {product.brand && (
                          <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                            {product.brand}
                          </div>
                        )}
                        {product.origin && (
                          <div className="text-[10px] sm:text-xs text-muted-foreground">
                            {product.origin}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <div className="px-2 sm:px-2 md:px-3 lg:px-3 pb-2 pt-0 shrink-0">
                  <ProductGridCardActions product={product} onAddToCart={addToCart} />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
