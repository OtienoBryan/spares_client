import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/product-card";
import Navigation from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import { 
  ArrowLeft,
  Filter,
  SortAsc,
  SortDesc,
  Sparkles,
  Clock,
  Star,
  ShoppingCart
} from "lucide-react";
import { useProducts } from "@/hooks/useApi";
import { formatPrice } from "@/data/products";
import { LoadingWave, LoadingNetworkError } from "@/components/ui/lottie-loader";
import { useNetworkStatus, isNetworkError } from "@/hooks/useNetworkStatus";

const Offers = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { addToCart } = useCart();
  const { isOnline } = useNetworkStatus();
  const navigate = useNavigate();

  // Fetch data from API
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();

  // Helper function to check if product has any offers (from SKUs or general price)
  const hasOffer = (product: any) => {
    // Check if product has SKUs with discounts
    if (product.skus && product.skus.length > 0) {
      return product.skus.some((sku: any) => 
        sku.originalPrice && sku.originalPrice > sku.price
      );
    }
    // Check general product price discount
    return product.originalPrice && product.originalPrice > product.price;
  };

  // Helper function to get best discount percentage
  const getBestDiscount = (product: any) => {
    let maxDiscount = 0;
    
    // Check SKU discounts
    if (product.skus && product.skus.length > 0) {
      product.skus.forEach((sku: any) => {
        if (sku.originalPrice && sku.originalPrice > sku.price) {
          const discount = ((sku.originalPrice - sku.price) / sku.originalPrice) * 100;
          if (discount > maxDiscount) {
            maxDiscount = discount;
          }
        }
      });
    }
    
    // Check general product discount
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      if (discount > maxDiscount) {
        maxDiscount = discount;
      }
    }
    
    return maxDiscount;
  };

  // Get all offer products (products with SKU discounts or general price discounts)
  const offerProducts = allProducts?.filter(product => 
    product && hasOffer(product)
  ) || [];

  // Filter products by category
  const filteredProducts = filterCategory === 'all' 
    ? offerProducts
    : offerProducts.filter(product => 
        product.category?.name.toLowerCase() === filterCategory.toLowerCase()
      );

  // Sort products by discount percentage (using best discount)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const discountA = getBestDiscount(a);
    const discountB = getBestDiscount(b);
    return sortOrder === 'desc' ? discountB - discountA : discountA - discountB;
  });

  // Get unique categories from offer products
  const categories = ['all', ...new Set(offerProducts.map(product => product.category?.name).filter(Boolean))];

  // Show loading state
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-24 px-4">
          <div className="text-center">
            <LoadingWave size="xl" className="mx-auto mb-3 sm:mb-4" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-2 sm:mb-4">Loading Offers...</h1>
            <p className="text-sm sm:text-base">Finding the best deals for you...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check for network errors
  const hasNetworkError = !isOnline || isNetworkError(productsError);

  // Show network error state
  if (hasNetworkError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-24 px-4">
          <div className="text-center">
            <LoadingNetworkError size="xl" className="mx-auto mb-3 sm:mb-4" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-3 sm:mb-4">Connection Error</h1>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">Unable to load offers</p>
            <Button onClick={() => window.location.reload()} className="text-xs sm:text-sm touch-manipulation">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-wine/10 to-primary/10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link to="/">
              <Button variant="outline" size="sm" className="w-fit touch-manipulation">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline text-xs sm:text-sm">Back to Home</span>
                <span className="sm:hidden text-xs">Back</span>
              </Button>
            </Link>
            <div className="inline-flex items-center gap-2 bg-wine text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              Limited Time Offers
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-wine mb-2 sm:mb-3">
              Special Offers
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover amazing deals on premium drinks - limited time only!
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-4 sm:py-6 md:py-8 bg-white border-b">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm font-medium">Filter by category:</span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category)}
                    className={`text-xs sm:text-sm touch-manipulation ${
                      filterCategory === category ? "bg-wine hover:bg-wine/90" : ""
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Sort Control */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-medium">Sort by discount:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="text-xs sm:text-sm touch-manipulation"
              >
                {sortOrder === 'desc' ? (
                  <>
                    <SortDesc className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Highest First</span>
                    <span className="sm:hidden">Highest</span>
                  </>
                ) : (
                  <>
                    <SortAsc className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Lowest First</span>
                    <span className="sm:hidden">Lowest</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2 md:gap-3">
              {sortedProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-wine/20 hover:border-wine/40 touch-manipulation flex flex-col">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="h-40 sm:h-44 md:h-48 lg:h-52 w-full object-contain bg-white"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Discount Badge */}
                        <div className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 bg-red-500 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold">
                          {Math.round(getBestDiscount(product))}% OFF
                        </div>
                        {/* Hot Deal Badge */}
                        <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 bg-wine text-white px-1 sm:px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold">
                          HOT
                        </div>
                        {/* Timer Badge */}
                        <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 bg-black/70 text-white px-1 sm:px-1.5 py-0.5 rounded text-[10px]">
                          <Clock className="h-2 w-2 inline mr-0.5" />
                          <span>Limited</span>
                        </div>
                      </div>
                    </Link>
                    
                    <CardContent className="p-1.5 sm:p-2">
                      <div className="space-y-0.5 sm:space-y-1">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-xs sm:text-xs line-clamp-1 group-hover:text-wine transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <span className="text-gold font-medium">Alc. {product.alcoholContent || 'N/A'}%</span>
                          </div>
                          {product.volume && (
                            <div className="flex items-center gap-0.5">
                              <span className="font-medium">{product.volume}</span>
                            </div>
                          )}
                        </div>
                        
                        
                        <div className="flex flex-col gap-1">
                          {product.skus && product.skus.length > 0 ? (
                            product.skus.map((sku, idx) => (
                              <div key={idx} className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                  <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{sku.code}:</span>
                                  <span className="text-xs sm:text-sm font-bold text-wine">
                                    {formatPrice(sku.price)}
                                  </span>
                                  {sku.originalPrice && (
                                    <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                      {formatPrice(sku.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                {sku.originalPrice && sku.originalPrice > sku.price && (
                                  <div className="text-[10px] text-green-600 font-medium">
                                    Save {formatPrice(sku.originalPrice - sku.price)}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                <span className="text-xs sm:text-sm font-bold text-wine">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              </div>
                              <div className="text-[10px] text-green-600 font-medium">
                                Save {formatPrice(product.originalPrice - product.price)}
                              </div>
                            </>
                          )}
                          
                          {product.stock > 0 ? (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // If product has SKUs, navigate to product page to select SKU
                                if (product.skus && product.skus.length > 0) {
                                  navigate(`/product/${product.id}`);
                                } else {
                                  addToCart(product);
                                }
                              }}
                              size="sm"
                              className="bg-wine hover:bg-wine/90 active:bg-wine/80 text-white text-[10px] sm:text-xs w-full touch-manipulation active:scale-95 transition-transform py-1 h-6 sm:h-7"
                            >
                              <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />
                              <span>
                                {product.skus && product.skus.length > 0 ? 'Select SKU' : 'Add'}
                              </span>
                            </Button>
                          ) : (
                            <div className="w-full bg-gray-100 text-gray-500 text-[10px] sm:text-xs py-1 h-6 sm:h-7 rounded-md text-center font-medium flex items-center justify-center">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 md:py-24">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎉</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-muted-foreground mb-3 sm:mb-4">No offers found</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                {filterCategory === 'all' 
                  ? "There are currently no products on sale. Check back soon for amazing deals!"
                  : `No offers found in the ${filterCategory} category. Try selecting a different category.`
                }
              </p>
              <Link to="/">
                <Button className="bg-wine hover:bg-wine/90 active:bg-wine/80 text-xs sm:text-sm touch-manipulation">
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Offers;
