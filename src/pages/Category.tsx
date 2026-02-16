import { useState, useEffect } from "react";
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
  Search, 
  SlidersHorizontal, 
  ArrowLeft,
  Star,
  Percent,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useProducts, useProductsByCategoryName, useCategories, useSubCategories } from "@/hooks/useApi";
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
  const { addToCart } = useCart();

  // Fetch data from API
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();
  const { data: categoryProducts, loading: categoryLoading, error: categoryError } = useProductsByCategoryName(category || "");
  const { data: categories, loading: categoriesLoading } = useCategories();
  
  // Get current category to fetch its subcategories
  const currentCategory = (categories as any[])?.find(cat => cat.name.toLowerCase() === category?.toLowerCase());
  const { data: subcategories, loading: subcategoriesLoading } = useSubCategories(currentCategory?.id);

  // Use category-specific products if available, otherwise use all products
  const baseProducts = (categoryProducts as any[]) || (allProducts as any[]) || [];

  // Get unique values for filters
  const uniqueSizes = [...new Set(baseProducts.map(p => p.volume).filter(Boolean))].sort();
  const uniqueSubCategories = (subcategories as any[])?.map(sc => sc.name) || [];
  const uniqueCountries = [...new Set(baseProducts.map(p => p.origin).filter(Boolean))].sort();

  // Get category display name
  const categoryDisplayName = currentCategory?.name || category || "All Drinks";

  // Filter products based on filters
  const filteredProducts = baseProducts.filter(product => {
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

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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


  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("name");
    setPriceRange([0, 100000]);
    setAlcoholRange([0, 50]);
    setMinRating(0);
    setInStock(false);
    setSelectedSize("all");
    setSelectedSubCategory("all");
    setSelectedCountry("all");
  };

  // Show loading state
  if (productsLoading || categoryLoading || categoriesLoading || subcategoriesLoading) {
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

  // Show error state
  if (productsError || categoryError) {
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

  // Generate structured data for the category
  const categoryStructuredData = {
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

      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-3 sm:mb-4 md:mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-wine transition-colors">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-wine font-medium">
              {categoryDisplayName}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold text-wine mb-2">
            {categoryDisplayName}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            {sortedProducts.length} premium {categoryDisplayName.toLowerCase()} products available with fast delivery
          </p>
        </header>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-3 sm:mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between touch-manipulation text-xs sm:text-sm active:scale-95 transition-transform"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              Filters
            </span>
            {showMobileFilters ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`} aria-label="Product Filters">
            <Card className="lg:sticky lg:top-20">
              <CardHeader className="pb-1 sm:pb-2 md:pb-3">
                <CardTitle className="flex items-center gap-2 text-xs sm:text-sm md:text-base">
                  <SlidersHorizontal className="h-3 w-3" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 md:space-y-4 p-3">
                {/* Search */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                    <Input
                      placeholder="Search drinks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-7 text-xs h-8"
                    />
                  </div>
                </div>

                {/* Subcategory Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Subcategory</label>
                  <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                  <SelectTrigger className="text-xs h-8 py-1">
                      <SelectValue placeholder="All Subcategories" />
                    </SelectTrigger>
                  <SelectContent className="max-h-56 text-xs">
                    <SelectItem value="all">All Subcategories</SelectItem>
                      {uniqueSubCategories.map((subcategory: string) => (
                      <SelectItem key={subcategory} value={subcategory} className="text-xs">
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="text-xs h-8 py-1">
                      <SelectValue />
                    </SelectTrigger>
                  <SelectContent className="max-h-56 text-xs">
                    <SelectItem value="name" className="text-xs">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low" className="text-xs">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high" className="text-xs">Price (High to Low)</SelectItem>
                    <SelectItem value="rating" className="text-xs">Rating (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <span>Price Range</span>
                    <Badge variant="outline" className="text-[10px]">{priceRange[0]} - {priceRange[1]}</Badge>
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    step={100}
                    className="w-full h-1"
                  />
                </div>

                {/* Alcohol Content */}
                <div className="space-y-2">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    <span>Alcohol Content</span>
                    <Badge variant="outline" className="text-[10px]">{alcoholRange[0]}% - {alcoholRange[1]}%</Badge>
                  </label>
                  <Slider
                    value={alcoholRange}
                    onValueChange={setAlcoholRange}
                    max={50}
                    step={0.5}
                    className="w-full h-1"
                  />
                </div>

                {/* Minimum Rating */}
                <div className="space-y-2">
                  <label className="text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>Minimum Rating</span>
                    <Badge variant="outline" className="text-[10px]">{minRating}+ stars</Badge>
                  </label>
                  <Slider
                    value={[minRating]}
                    onValueChange={([value]) => setMinRating(value)}
                    max={5}
                    step={0.1}
                    className="w-full h-1"
                  />
                </div>

                {/* In Stock Only */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded border-input h-3 w-3"
                  />
                  <label htmlFor="inStock" className="text-xs font-medium">
                    In stock only
                  </label>
                </div>

                {/* Volume Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Volume</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="text-xs h-8 py-1">
                      <SelectValue placeholder="All Volumes" />
                    </SelectTrigger>
                  <SelectContent className="max-h-56 text-xs">
                    <SelectItem value="all" className="text-xs">All Volumes</SelectItem>
                      {uniqueSizes.map((size: string) => (
                      <SelectItem key={size} value={size} className="text-xs">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Origin Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Origin</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="text-xs h-8 py-1">
                      <SelectValue placeholder="All Origins" />
                    </SelectTrigger>
                  <SelectContent className="max-h-56 text-xs">
                    <SelectItem value="all" className="text-xs">All Origins</SelectItem>
                      {uniqueCountries.map((origin: string) => (
                      <SelectItem key={origin} value={origin} className="text-xs">
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  onClick={resetFilters} 
                  className="w-full text-xs h-8 touch-manipulation active:scale-95 transition-transform"
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3" aria-label="Product List">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2 sm:mb-3">No products found</h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">No products found matching your criteria.</p>
                <Button variant="outline" onClick={resetFilters} className="text-xs sm:text-sm touch-manipulation">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <section aria-label={`${categoryDisplayName} Products`}>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                  {sortedProducts.map((product) => (
                    <article key={product.id} className="group">
                      <ProductCard
                        product={product}
                        onAddToCart={addToCart}
                        compact
                      />
                    </article>
                  ))}
                </div>
              </section>
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