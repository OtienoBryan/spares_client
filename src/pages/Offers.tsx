import { useState } from "react";
import { Link } from "react-router-dom";
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

  // Fetch data from API
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();

  // Get all offer products (products with original price higher than current price)
  const offerProducts = allProducts?.filter(product => 
    product && 
    product.originalPrice && 
    product.originalPrice > product.price
  ) || [];

  // Filter products by category
  const filteredProducts = filterCategory === 'all' 
    ? offerProducts
    : offerProducts.filter(product => 
        product.category?.name.toLowerCase() === filterCategory.toLowerCase()
      );

  // Sort products by discount percentage
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
    const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {sortedProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-2 border-wine/20 hover:border-wine/40 touch-manipulation flex flex-col">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="h-40 sm:h-48 md:h-56 lg:h-64 w-full object-contain bg-white"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Discount Badge */}
                        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                        {/* Hot Deal Badge */}
                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-wine text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                          HOT DEAL
                        </div>
                        {/* Timer Badge */}
                        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-black/70 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                          <Clock className="h-2 w-2 sm:h-3 sm:w-3 inline mr-1" />
                          <span className="hidden sm:inline">Limited Time</span>
                          <span className="sm:hidden">Limited</span>
                        </div>
                      </div>
                    </Link>
                    
                    <CardContent className="p-2 sm:p-3">
                      <div className="space-y-1 sm:space-y-2">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-wine transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-gold font-medium">Alc. {product.alcoholContent || 'N/A'}%</span>
                          </div>
                          {product.volume && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{product.volume}</span>
                            </div>
                          )}
                        </div>
                        
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="text-lg sm:text-xl font-bold text-wine">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            You save {formatPrice(product.originalPrice - product.price)}
                          </div>
                          
                          {product.stock > 0 ? (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              size="sm"
                              className="bg-wine hover:bg-wine/90 active:bg-wine/80 text-white text-xs sm:text-sm w-full touch-manipulation active:scale-95 transition-transform"
                            >
                              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Add to Cart</span>
                              <span className="sm:hidden">Add</span>
                            </Button>
                          ) : (
                            <div className="w-full bg-gray-100 text-gray-500 text-xs sm:text-sm py-2 rounded-md text-center font-medium">
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
