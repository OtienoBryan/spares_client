import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGridCardActions } from "@/components/ProductGridCardActions";
import { productSlug } from "@/lib/utils";
import { formatPrice } from "@/data/products";
import { useCallback } from "react";

interface FeaturedSectionProps {
  products: any[];
  addToCart: (product: any) => void;
  loading: boolean;
  error: any;
  isBrandSearch: boolean;
  brandName: string | null;
  searchQuery: string;
  onClearSearch: () => void;
}

export const FeaturedSection = ({
  products,
  addToCart,
  loading,
  error,
  isBrandSearch,
  brandName,
  searchQuery,
  onClearSearch
}: FeaturedSectionProps) => {
  // Helper function to get best discount percentage from SKUs only
  const getBestDiscountFromSKU = useCallback((product: any) => {
    let maxDiscount = 0;
    if (product.skus && product.skus.length > 0) {
      product.skus.forEach((sku: any) => {
        if (sku.originalPrice && sku.originalPrice > sku.price) {
          const discount = ((sku.originalPrice - sku.price) / sku.originalPrice) * 100;
          if (discount > maxDiscount) maxDiscount = discount;
        }
      });
    }
    return maxDiscount;
  }, []);

  if (loading) {
    return (
      <section className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-Component/5 to-primary/5">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-56 sm:h-64 md:h-72 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-3 sm:py-4 md:py-6">
        <div className="container mx-auto px-3 sm:px-4 text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
          <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2 sm:mb-3">Unable to load products</h3>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="featured-products"
      className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-Component/5 to-primary/5" 
      aria-label="Featured Spares"
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary mb-0.5 sm:mb-1 md:mb-2">
              {isBrandSearch 
                ? `${brandName} Products` 
                : searchQuery 
                  ? `Results: "${searchQuery}"` 
                  : 'Featured Spares'}
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
              {isBrandSearch 
                ? `All parts from ${brandName}`
                : searchQuery 
                  ? `Products matching your search`
                  : 'Handpicked quality spare parts'}
            </p>
          </div>
          {!searchQuery && (
            <Link to="/featured" className="shrink-0">
              <Button size="sm" className="bg-primary hover:bg-primary/90 active:bg-primary/80 text-white px-3 py-2 sm:px-4 md:px-6 text-xs sm:text-sm touch-manipulation">
                View All
                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 flex flex-col h-full">
                  <Link to={`/product/${productSlug(product)}`} className="block flex-1 min-w-0 touch-manipulation cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 w-full object-contain bg-white"
                        loading="lazy"
                        decoding="async"
                      />
                      {getBestDiscountFromSKU(product) > 0 && (
                        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                          {Math.round(getBestDiscountFromSKU(product))}% OFF
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
                                {formatPrice(product.price || 0)}
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
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2 sm:mb-3">
              {isBrandSearch ? `No parts found for ${brandName}` : searchQuery ? "No parts found matching your search." : "No featured parts available"}
            </h3>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={onClearSearch}
                className="text-xs sm:text-sm touch-manipulation"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
