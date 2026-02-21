import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, 
  SlidersHorizontal, 
  ArrowLeft,
  Star,
  Percent,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useProducts, useProductsByCategoryName, useProductsByCategory, useCategories, useSubCategories } from "@/hooks/useApi";
import { Product } from "@/services/api";
import { LoadingWave, LoadingWine } from "@/components/ui/lottie-loader";

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [alcoholRange, setAlcoholRange] = useState([0, 50]);
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { addToCart } = useCart();

  // Fetch categories first (needed to find category ID)
  const { data: categories, loading: categoriesLoading } = useCategories();
  
  // Get current category to fetch its subcategories and products
  const currentCategory = useMemo(() => {
    if (!categories || !category) return null;
    return (categories as any[]).find(cat => cat.name.toLowerCase() === category.toLowerCase());
  }, [categories, category]);

  // Optimize: Use category ID directly when available to avoid extra API call in getProductsByCategoryName
  // This avoids fetching all categories again inside getProductsByCategoryName
  // Only fetch by ID if we have a valid category ID, otherwise use name-based lookup
  const hasValidCategoryId = currentCategory?.id && currentCategory.id > 0;
  const { data: categoryProductsById, loading: categoryLoadingById, error: categoryErrorById } = useProductsByCategory(
    currentCategory?.id || 0, 
    hasValidCategoryId
  );
  // Only fetch by name if we don't have a valid category ID yet (categories still loading)
  const { data: categoryProductsByName, loading: categoryLoadingByName, error: categoryErrorByName } = useProductsByCategoryName(
    category || "",
    !hasValidCategoryId && !!category // Only fetch if we don't have ID and have category name
  );
  
  // Use the optimized version (by ID) if we have category ID, otherwise fall back to name-based lookup
  const categoryProducts = hasValidCategoryId ? categoryProductsById : categoryProductsByName;
  const categoryLoading = hasValidCategoryId ? categoryLoadingById : categoryLoadingByName;
  const categoryError = hasValidCategoryId ? categoryErrorById : categoryErrorByName;
  
  // Only fetch all products if no category is specified
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();
  
  // Only fetch subcategories if we have a category ID
  const { data: subcategories, loading: subcategoriesLoading } = useSubCategories(currentCategory?.id);

  // Use category-specific products if available, otherwise use all products
  const baseProducts = useMemo(() => {
    if (category && categoryProducts) {
      return (categoryProducts as any[]) || [];
    }
    if (!category && allProducts) {
      return (allProducts as any[]) || [];
    }
    return [];
  }, [category, categoryProducts, allProducts]);

  // Memoize unique values for filters to avoid recalculating on every render
  const uniqueSizes = useMemo(() => {
    return [...new Set(baseProducts.map(p => p.volume).filter(Boolean))].sort();
  }, [baseProducts]);

  const uniqueSubCategories = useMemo(() => {
    return (subcategories as any[])?.map(sc => sc.name) || [];
  }, [subcategories]);

  const uniqueCountries = useMemo(() => {
    return [...new Set(baseProducts.map(p => p.origin).filter(Boolean))].sort();
  }, [baseProducts]);

  // Get category display name
  const categoryDisplayName = useMemo(() => {
    return currentCategory?.name || category || "All Drinks";
  }, [currentCategory, category]);

  // Memoize filtered products to avoid recalculating on every render
  const filteredProducts = useMemo(() => {
    return baseProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Extract alcohol percentage from alcoholContent string
      const alcoholMatch = product.alcoholContent?.match(/(\d+(?:\.\d+)?)/);
      const alcoholValue = alcoholMatch ? parseFloat(alcoholMatch[1]) : 0;
      const matchesAlcohol = alcoholValue >= alcoholRange[0] && alcoholValue <= alcoholRange[1];
      
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStock || product.stock > 0;
      const matchesSize = selectedSize === "all" || product.volume === selectedSize;
      const matchesSubCategory = selectedSubCategory === "all" || product.subcategory?.name === selectedSubCategory;
      const matchesCountry = selectedCountry === "all" || product.origin === selectedCountry;
      
      return matchesSearch && matchesPrice && matchesAlcohol && matchesRating && matchesStock && matchesSize && matchesSubCategory && matchesCountry;
    });
  }, [baseProducts, searchQuery, priceRange, alcoholRange, minRating, inStock, selectedSize, selectedSubCategory, selectedCountry]);

  // Memoize sorted products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredProducts, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, startIndex, endIndex]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, priceRange, alcoholRange, minRating, inStock, selectedSize, selectedSubCategory, selectedCountry, category]);


  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("name");
    setPriceRange([0, 100000]);
    setAlcoholRange([0, 50]);
    setMinRating(0);
    setInStock(false);
    setSelectedSize("all");
    setSelectedSubCategory("all");
    setSelectedCountry("all");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoize structured data for SEO (must be before early returns to follow Rules of Hooks)
  const categoryStructuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${categoryDisplayName} - Drinks Avenue`,
      "description": `Browse our collection of ${categoryDisplayName.toLowerCase()} products. Premium quality drinks with fast delivery.`,
      "url": `${window.location.origin}/category/${category?.toLowerCase()}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": `${categoryDisplayName} Products`,
        "description": `Collection of ${categoryDisplayName.toLowerCase()} products`,
        "numberOfItems": sortedProducts.length,
        "itemListElement": sortedProducts.slice(0, 10).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.image,
            "brand": {
              "@type": "Brand",
              "name": product.brand
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "KES",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          }
        }))
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": categoryDisplayName,
            "item": `${window.location.origin}/category/${category?.toLowerCase()}`
          }
        ]
      }
    };
  }, [categoryDisplayName, sortedProducts, category]);

  // Determine loading state - only show loading if critical data is missing
  // Categories can load in background, subcategories are optional
  const isLoadingCriticalData = (category && categoryLoading) || (!category && productsLoading);
  const hasError = (category && categoryError) || (!category && productsError);
  
  // Show loading state only for critical data (after all hooks)
  if (isLoadingCriticalData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-24 px-4">
          <div className="text-center">
            <LoadingWave size="xl" className="mx-auto mb-3 sm:mb-4" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-2 sm:mb-4">Loading Category...</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Discovering products for you...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (after all hooks)
  if (hasError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-24 px-4">
          <div className="text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-2 sm:mb-4">Connection Error</h1>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">Unable to load products</p>
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
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{`${categoryDisplayName} - Premium Drinks & Spirits | Drinks Avenue`}</title>
        <meta name="description" content={`Browse our collection of ${categoryDisplayName.toLowerCase()} products. Premium quality drinks with fast delivery in Kenya. ${sortedProducts.length} products available.`} />
        <meta name="keywords" content={`${categoryDisplayName.toLowerCase()}, alcohol delivery, premium drinks, ${categoryDisplayName.toLowerCase()} delivery, Kenya, Nairobi, spirits, wine, beer`} />
        <meta name="author" content="Drinks Avenue" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${window.location.origin}/category/${category?.toLowerCase()}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${categoryDisplayName} - Premium Drinks & Spirits | Drinks Avenue`} />
        <meta property="og:description" content={`Browse our collection of ${categoryDisplayName.toLowerCase()} products. Premium quality drinks with fast delivery in Kenya.`} />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:url" content={`${window.location.origin}/category/${category?.toLowerCase()}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Drinks Avenue" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${categoryDisplayName} - Premium Drinks & Spirits`} />
        <meta name="twitter:description" content={`Browse our collection of ${categoryDisplayName.toLowerCase()} products. Premium quality drinks with fast delivery.`} />
        <meta name="twitter:image" content={`${window.location.origin}/logo.png`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(categoryStructuredData)}
        </script>
      </Helmet>

      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-8 lg:py-6">
        {/* Breadcrumb Navigation */}
        <nav className="mb-3 sm:mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-wine transition-colors">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-wine font-semibold">
              {categoryDisplayName}
            </li>
          </ol>
        </nav>

        {/* Header Section - Redesigned */}
        <header className="mb-4 sm:mb-5 lg:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-wine mb-1.5">
                {categoryDisplayName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover {sortedProducts.length} premium {categoryDisplayName.toLowerCase()} products with fast delivery
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-wine">{sortedProducts.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Products</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Filter Toggle - Redesigned */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between h-12 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters & Sort
            </span>
            {showMobileFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Filters Sidebar - Redesigned */}
          <aside className={`lg:col-span-3 ${showMobileFilters ? 'block' : 'hidden lg:block'}`} aria-label="Product Filters">
            <Card className="lg:sticky lg:top-24 shadow-md border-2">
              <CardHeader className="border-b bg-gradient-to-r from-wine/5 to-wine/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <SlidersHorizontal className="h-5 w-5 text-wine" />
                  Filters & Sort
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {/* Search - Redesigned */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search drinks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>

                {/* Subcategory Filter - Redesigned */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Subcategory</label>
                  <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="All Subcategories" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {uniqueSubCategories.map((subcategory: string) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By - Redesigned */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="rating">Rating (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range - Redesigned */}
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <label className="text-sm font-semibold flex items-center justify-between">
                    <span>Price Range</span>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      KES {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                    </Badge>
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Alcohol Content - Redesigned */}
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <label className="text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Alcohol Content
                    </span>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {alcoholRange[0]}% - {alcoholRange[1]}%
                    </Badge>
                  </label>
                  <Slider
                    value={alcoholRange}
                    onValueChange={setAlcoholRange}
                    max={50}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Minimum Rating - Redesigned */}
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <label className="text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      Minimum Rating
                    </span>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {minRating.toFixed(1)}+ stars
                    </Badge>
                  </label>
                  <Slider
                    value={[minRating]}
                    onValueChange={([value]) => setMinRating(value)}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* In Stock Only - Redesigned */}
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded border-input h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium cursor-pointer">
                    In stock only
                  </label>
                </div>

                {/* Volume Filter - Redesigned */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Volume</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="All Volumes" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      <SelectItem value="all">All Volumes</SelectItem>
                      {uniqueSizes.map((size: string) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Origin Filter - Redesigned */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Origin</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="All Origins" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      <SelectItem value="all">All Origins</SelectItem>
                      {uniqueCountries.map((origin: string) => (
                        <SelectItem key={origin} value={origin}>
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters - Redesigned */}
                <Button 
                  variant="outline" 
                  onClick={resetFilters} 
                  className="w-full h-11 text-sm font-semibold border-2 hover:bg-wine hover:text-white hover:border-wine transition-colors"
                >
                  Reset All Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid - Redesigned */}
          <main className="lg:col-span-9" aria-label="Product List">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-6xl sm:text-7xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">No products found</h3>
                <p className="text-muted-foreground text-base mb-6 max-w-md mx-auto">
                  No products found matching your criteria. Try adjusting your filters.
                </p>
                <Button variant="outline" onClick={resetFilters} className="h-11 px-6">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <section 
                  aria-label={`${categoryDisplayName} Products`}
                  className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-wine/5 to-primary/5 rounded-lg"
                >
                  <div className="px-3 sm:px-4">
                    {/* Results count - Redesigned */}
                    <div className="mb-4 sm:mb-6 flex items-center justify-between pb-3 sm:pb-4 border-b border-border/50">
                      <div className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{startIndex + 1}-{Math.min(endIndex, sortedProducts.length)}</span> of <span className="font-semibold text-foreground">{sortedProducts.length}</span> products
                      </div>
                      <div className="hidden sm:block text-xs text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>
                    
                    {/* Products Grid - Matching offers section design */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {paginatedProducts.map((product) => (
                        <article key={product.id} className="relative group">
                          <ProductCard
                            product={product}
                            onAddToCart={addToCart}
                            compact
                            hideAddToCart={true}
                          />
                        </article>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Pagination - Redesigned */}
                {totalPages > 1 && (
                  <div className="mt-10 sm:mt-12 pt-6 border-t">
                    <Pagination>
                      <PaginationContent className="gap-2">
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer h-10 px-4'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page);
                                  }}
                                  isActive={currentPage === page}
                                  className="cursor-pointer h-10 w-10"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis className="h-10 w-10" />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer h-10 px-4'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Category;