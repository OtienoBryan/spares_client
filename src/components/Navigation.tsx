import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartSidebar } from "@/components/ui/cart-sidebar";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useCategories, useSearchProductsDebounced, useSubCategories } from "@/hooks/useApi";
import { LoadingWine } from "@/components/ui/lottie-loader";
import { formatPrice } from "@/data/products";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";
import { 
  MapPin, 
  Search,
  Menu,
  X,
  ShoppingCart,
  Phone,
  User,
  LogOut,
  Package,
  Star
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { cartItems, updateQuantity, removeItem } = useCart();
  
  console.log('Navigation component rendering, attempting to use useUser hook');
  const { user, isAuthenticated, logout, getLoyaltyPoints } = useUser();
  console.log('Navigation useUser result:', { user, isAuthenticated });
  
  const { data: apiCategories = [], loading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Fetch all subcategories
  const { data: allSubcategories = [] } = useSubCategories();
  
  // Get search suggestions
  const { data: searchSuggestions = [], loading: suggestionsLoading } = useSearchProductsDebounced(searchQuery, 200);

  // Helper function to get subcategories for a category
  const getSubcategoriesForCategory = (categoryName: string, categoryId?: number) => {
    // First check if it's a hardcoded category with static subcategories
    const staticSubcategories: Record<string, Array<{ name: string; path: string }>> = {
      "Wine": [
        { name: "Red Wine", path: "/category/red-wine" },
        { name: "Champagne", path: "/category/champagne" },
        { name: "White Wine", path: "/category/white-wine" },
        { name: "Rose", path: "/category/rose" },
        { name: "Sparkling", path: "/category/sparkling" }
      ],
      "More": [
        { name: "Mixers", path: "/category/mixers" },
        { name: "Convenience Store", path: "/category/convenience" }
      ]
    };

    if (staticSubcategories[categoryName]) {
      return staticSubcategories[categoryName];
    }

    // For API categories, get subcategories from API
    if (categoryId && allSubcategories) {
      const apiSubcategories = allSubcategories
        .filter((sub: any) => sub.categoryId === categoryId && sub.isActive)
        .map((sub: any) => ({
          name: sub.name,
          path: `/category/${sub.name.toLowerCase().replace(/\s+/g, '-')}`
        }));
      
      if (apiSubcategories.length > 0) {
        return apiSubcategories;
      }
    }

    return null;
  };

  // Create categories array with API data and fallback to static data - Chupa Chap Style
  const categories = useMemo(() => {
    const baseCategories = [
      { name: "Home", path: "/", icon: "🏠", id: undefined },
      { name: "Beer", path: "/category/beer", icon: "🍺", id: undefined },
      { 
        name: "Wine", 
        path: "/category/wine", 
        icon: "🍷",
        id: undefined,
        subcategories: getSubcategoriesForCategory("Wine")
      },
      { 
        name: "More", 
        path: "/category/more", 
        icon: "🍹",
        id: undefined,
        subcategories: getSubcategoriesForCategory("More")
      }
    ];

    // Add API categories with their subcategories
    const apiCategoriesList = apiCategories
      ?.filter(cat => !['beer', 'wine', 'spirits', 'more'].includes(cat.name.toLowerCase()))
      .map(category => {
        const subcategories = getSubcategoriesForCategory(category.name, category.id);
        return {
          name: category.name,
          path: `/category/${category.name.toLowerCase()}`,
          icon: getCategoryIcon(category.name),
          id: category.id,
          subcategories: subcategories || undefined
        };
      }) || [];

    return [...baseCategories, ...apiCategoriesList];
  }, [apiCategories, allSubcategories]);

  // Helper function to get appropriate icon for category
  function getCategoryIcon(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes('wine')) return "🍷";
    if (name.includes('beer')) return "🍺";
    if (name.includes('spirit') || name.includes('whiskey') || name.includes('vodka') || name.includes('gin')) return "🥃";
    if (name.includes('champagne') || name.includes('sparkling')) return "🥂";
    if (name.includes('cocktail')) return "🍹";
    if (name.includes('liqueur')) return "🍸";
    return "🍷"; // Default icon
  }

  const isActiveCategory = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (product: any) => {
    navigate(`/product/${product.id}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/brands/${encodeURIComponent(brand)}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Extract unique brands from search suggestions
  const uniqueBrands = useMemo(() => {
    if (!searchSuggestions || searchSuggestions.length === 0 || !searchQuery) return [];
    const brands = new Set<string>();
    const lowerQuery = searchQuery.toLowerCase();
    searchSuggestions.forEach((product: any) => {
      if (product.brand) {
        // Include brand if it matches the search query or if any product with this brand matches
        const brandMatches = product.brand.toLowerCase().includes(lowerQuery);
        if (brandMatches) {
          brands.add(product.brand);
        }
      }
    });
    return Array.from(brands).slice(0, 5); // Limit to 5 brands
  }, [searchSuggestions, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) {
          handleSuggestionClick(searchSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Bar with Phone Number - Chupa Chap Style
      <div className="bg-wine text-white py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="tel:+254717215155" className="flex items-center gap-2 hover:text-wine-light transition-colors">
                <Phone className="h-4 w-4" />
                <span>Call Us +254 717 215 155</span>
              </a>
              <div className="hidden md:flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Unga house, Westlands Nairobi</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs">
              <span>Free delivery on orders over KShs 5,000</span>
            </div>
          </div>
        </div>
      </div> */}
      

      {/* Top Bar with Phone Number */}
      <div className="bg-wine text-white py-1 text-xs">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-center">
            <a href="tel:+254712345678" className="flex items-center gap-1 hover:text-wine-light transition-colors">
              <Phone className="h-3 w-3" />
              <span className="font-medium"> +254 712 345 678</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-primary border-b border-primary/20 shadow-lg sticky top-0 z-50">
        <div className="w-full px-3 sm:px-6 py-1">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            {/* Logo - Far Left */}
            <Link to="/" className="flex items-center gap-1 sm:gap-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl overflow-hidden">
                <img 
                  src={`/logo3.png?t=${Date.now()}`} 
                  alt="Drinks Avenue" 
                  className="h-full w-full object-contain block" 
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => console.log('Logo loaded successfully')}
                />
              </div>
              <span className="text-xs sm:text-sm md:text-lg font-extrabold tracking-tight text-white drop-shadow-sm">
                Drinks Avenue
              </span>
              {/* Fallback text if logo fails to load */}
              {/* <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Dalali v2</span> */}
            </Link>
            
            {/* Categories - Center */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {categoriesLoading ? (
                <div className="flex items-center gap-2 px-3 py-1 text-xs text-white/80">
                  <LoadingWine size="sm" />
                  Loading categories...
                </div>
              ) : categoriesError ? (
                <div className="flex items-center gap-2 px-3 py-1 text-xs text-white/80">
                  Error loading categories
                </div>
              ) : (
                categories.map((category, index) => (
                  <div key={category.path} className="relative group flex items-center">
                    <Link
                      to={category.path}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActiveCategory(category.path)
                          ? "bg-white text-primary shadow-md"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {category.name}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <svg className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                    
                    {/* Divider after each category (except the last one) */}
                    {index < categories.length - 1 && (
                      <div className="w-0.5 h-4 bg-white/30 mx-1"></div>
                    )}
                    
                    {/* Dropdown for subcategories */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50 pointer-events-none group-hover:pointer-events-auto">
                        <div className="py-2">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.path}
                              to={subcategory.path}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors duration-150"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Vertical Divider Line */}
            <div className="hidden md:block w-0.5 h-6 bg-white mx-3"></div>
            
            {/* User Actions - Right */}
            <div className="hidden md:flex items-center gap-3">
              {/* Contact Details */}
              {/* <div className="flex items-center gap-3 lg:gap-4 text-white/90">
                <a 
                  href="tel:+254712345678" 
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm lg:text-base font-medium">+254 712 345 678</span>
                </a>
              </div> */}
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1 px-2 py-1 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                  >
                    <User className="h-4 w-4" />
                    {user?.firstName}
                    <Star className="h-4 w-4 text-yellow-500" />
                    {getLoyaltyPoints()}
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                      <div className="p-2">
                        <Link
                          to="/account"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-8 w-8" />
                        
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <Link
                          to="/account?tab=loyalty"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Star className="h-4 w-4" />
                          Loyalty Points
                        </Link>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg w-full text-left transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-black/90 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors text-sm"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                   
                </div>
              )}
              
              <Link to="/cart" className="relative">
                <Button 
                  variant="outline"
                  className="px-1 py-1 border-white text-black hover:bg-white hover:text-primary rounded-lg transition-colors text-sm font-semibold shadow-lg hover:shadow-xl"
                  aria-label={`Shopping cart with ${cartItems.length} items`}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                </Button>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              
              {/* <div className="hidden md:block">
                <CartSidebar 
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              </div> */}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Phone Number for Mobile */}
              {/* <a 
                href="tel:+254712345678" 
                className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">Call</span>
              </a> */}
              
              <div className="block md:hidden">
                <CartSidebar 
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 hover:text-white min-h-[40px] min-w-[40px]"
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search Bar - Centered */}
          <div className="border-t border-white/20 pt-3 sm:pt-4">
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for drinks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 sm:pl-12 pr-4 py-1 sm:py-2 border border-gray-200 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-xs sm:text-sm"
                  />
                </form>
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchQuery.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                  >
                    {suggestionsLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <LoadingWine size="sm" />
                        <span className="ml-2">Searching...</span>
                      </div>
                    ) : (uniqueBrands.length > 0 || searchSuggestions.length > 0) ? (
                      <div className="py-2">
                        {/* Brands Section - Upper */}
                        {uniqueBrands.length > 0 && (
                          <>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                              Brands
                            </div>
                            {uniqueBrands.map((brand, index) => (
                              <button
                                key={brand}
                                onClick={() => handleBrandClick(brand)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center">
                                  <span className="text-wine font-semibold text-sm">
                                    {brand.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">
                                    {brand}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    View all {brand} products
                                  </div>
                                </div>
                              </button>
                            ))}
                            <div className="border-t my-1"></div>
                          </>
                        )}
                        
                        {/* Products Section - Lower */}
                        {searchSuggestions.length > 0 && (
                          <>
                            {uniqueBrands.length > 0 && (
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Products
                              </div>
                            )}
                            {searchSuggestions.slice(0, 8).map((product, index) => (
                              <button
                                key={product.id}
                                onClick={() => handleSuggestionClick(product)}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                  index === selectedSuggestionIndex ? 'bg-gray-100' : ''
                                }`}
                              >
                                <img
                                  src={product.image || '/placeholder-product.jpg'}
                                  alt={product.name}
                                  className="w-10 h-10 object-contain rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {product.brand}
                                  </div>
                                  <div className="text-sm font-semibold text-wine">
                                    KES {formatPrice(product.price)}
                                  </div>
                                </div>
                              </button>
                            ))}
                            {searchSuggestions.length > 8 && (
                              <div className="px-4 py-2 text-sm text-gray-500 border-t">
                                And {searchSuggestions.length - 8} more results...
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Category Menu (hidden on mobile) */}
          <div className="hidden border-t border-white/20">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
              {categoriesLoading ? (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 whitespace-nowrap">
                  <LoadingWine size="sm" />
                  Loading...
                </div>
              ) : categoriesError ? (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 whitespace-nowrap">
                  Error
                </div>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-base font-medium transition-colors whitespace-nowrap min-h-[40px] ${
                      isActiveCategory(category.path)
                        ? "bg-white text-primary"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-background border-r w-80 h-full p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img 
                    src={`/logo2.png?t=${Date.now()}`} 
                    alt="Drinks Avenue" 
                    className="h-10 w-14 object-contain"
                    onError={(e) => {
                      console.error('Mobile logo failed to load:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => console.log('Mobile logo loaded successfully')}
                  />
                  <span className="text-xl font-bold text-wine">Drinks Avenue</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Categories</h3>
                {categoriesLoading ? (
                  <div className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground">
                    <LoadingWine size="sm" />
                    Loading categories...
                  </div>
                ) : categoriesError ? (
                  <div className="flex items-center gap-3 px-3 py-3 text-sm text-destructive">
                    Error loading categories
                  </div>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActiveCategory(category.path)
                          ? "bg-wine text-white"
                          : "text-muted-foreground hover:text-wine hover:bg-wine/10"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-xl">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))
                )}
              </div>

              <div className="pt-4 border-t">
                <a href="tel:+254712345678" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-wine transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>+254 712 345 678</span>
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>Nairobi, Kenya</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Quick Links</h3>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Search</h3>
                  <div className="relative">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search drinks..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-10 pr-4 py-1 border border-input rounded-lg bg-background text-xs focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine"
                      />
                    </form>
                    
                    {/* Mobile Search Suggestions Dropdown */}
                    {showSuggestions && searchQuery.length > 0 && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                      >
                        {suggestionsLoading ? (
                          <div className="p-3 text-center text-gray-500">
                            <LoadingWine size="sm" />
                            <span className="ml-2 text-sm">Searching...</span>
                          </div>
                        ) : (uniqueBrands.length > 0 || searchSuggestions.length > 0) ? (
                          <div className="py-1">
                            {/* Brands Section - Upper */}
                            {uniqueBrands.length > 0 && (
                              <>
                                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                                  Brands
                                </div>
                                {uniqueBrands.map((brand) => (
                                  <button
                                    key={brand}
                                    onClick={() => handleBrandClick(brand)}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-wine/10 flex items-center justify-center">
                                      <span className="text-wine font-semibold text-xs">
                                        {brand.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 text-sm truncate">
                                        {brand}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        View all products
                                      </div>
                                    </div>
                                  </button>
                                ))}
                                <div className="border-t my-1"></div>
                              </>
                            )}
                            
                            {/* Products Section - Lower */}
                            {searchSuggestions.length > 0 && (
                              <>
                                {uniqueBrands.length > 0 && (
                                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Products
                                  </div>
                                )}
                                {searchSuggestions.slice(0, 5).map((product, index) => (
                                  <button
                                    key={product.id}
                                    onClick={() => handleSuggestionClick(product)}
                                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                      index === selectedSuggestionIndex ? 'bg-gray-100' : ''
                                    }`}
                                  >
                                    <img
                                      src={product.image || '/placeholder-product.jpg'}
                                      alt={product.name}
                                      className="w-8 h-8 object-contain rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 text-sm truncate">
                                        {product.name}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {product.brand}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                                {searchSuggestions.length > 5 && (
                                  <div className="px-3 py-1 text-xs text-gray-500 border-t">
                                    And {searchSuggestions.length - 5} more results...
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 text-center text-gray-500 text-sm">
                            No products found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default Navigation;

