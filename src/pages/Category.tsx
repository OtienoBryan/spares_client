import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";


import { useProductsByCategory, useCategories, useSearchProductsDebounced } from "@/hooks/useApi";
import { useCart } from "@/contexts/CartContext";
import { LoadingComponent } from "@/components/ui/lottie-loader";
import { CategorySeo } from "@/components/category/CategorySeo";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { CategoryGrid } from "@/components/category/CategoryGrid";

const CategoryPage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const { addToCart } = useCart();
  const { data: categories } = useCategories();
  
  // State for filters
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Find the current category ID from the slug
  const currentCategory = useMemo(() => {
    if (!categories || !categorySlug) return null;
    return categories.find(c => c.name.toLowerCase() === categorySlug.toLowerCase());
  }, [categories, categorySlug]);

  const categoryId = currentCategory?.id || 0;
  const categoryDisplayName = currentCategory?.name || (categorySlug ? categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Products');

  // Fetch products
  const { data: categoryProducts = [], loading: productsLoading, error: productsError } = useProductsByCategory(categoryId);
  
  // Search logic if applicable
  const { data: searchResults } = useSearchProductsDebounced(initialSearch, 300);
  
  const baseProducts = useMemo(() => {
    // Some API hooks can yield `null` before data arrives; normalize to array.
    if (initialSearch) return (searchResults ?? []);
    return (categoryProducts ?? []);
  }, [initialSearch, searchResults, categoryProducts]);

  // Derived filter options
  const allOrigins = useMemo(() => {
    const origins = new Set<string>();
    baseProducts.forEach(p => { if (p.origin) origins.add(p.origin); });
    return Array.from(origins).sort();
  }, [baseProducts]);

  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    baseProducts.forEach(p => { if (p.brand) brands.add(p.brand); });
    return Array.from(brands).sort();
  }, [baseProducts]);

  const maxPrice = useMemo(() => {
    if (baseProducts.length === 0) return 50000;
    return Math.max(...baseProducts.map(p => p.price || 0), 1000);
  }, [baseProducts]);

  // Handle price range update when base products change
  useEffect(() => {
    if (maxPrice > 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const subCategories = useMemo(() => {
    if (!currentCategory || !categories) return [];
    return categories.filter(c => c.parentId === currentCategory.id);
  }, [currentCategory, categories]);

  // Filtration logic
  const filteredProducts = useMemo(() => {
    return baseProducts.filter(product => {
      // Category filter (if searching globally)
      if (initialSearch && categoryId > 0 && product.categoryId !== categoryId) return false;
      
      // Price filter
      const price = product.price || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      
      // Origins filter
      if (selectedOrigins.length > 0 && (!product.origin || !selectedOrigins.includes(product.origin))) return false;
      
      // Brands filter
      if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) return false;
      
      // Stock filter
      if (showInStockOnly && (product.stock === 0 || product.stock === "0")) return false;
      
      // Subcategories filter
      if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(product.categoryId)) return false;
      
      return true;
    });
  }, [baseProducts, priceRange, selectedOrigins, selectedBrands, showInStockOnly, selectedSubcategories, initialSearch, categoryId]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortBy) {
      case "price-asc": return products.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc": return products.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest": return products.sort((a, b) => b.id - a.id);
      default: return products;
    }
  }, [filteredProducts, sortBy]);

  const handleSubcategoryToggle = useCallback((id: number) => {
    setSelectedSubcategories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setPriceRange([0, maxPrice]);
    setSelectedOrigins([]);
    setSelectedBrands([]);
    setShowInStockOnly(false);
    setSelectedSubcategories([]);
    setCurrentPage(1);
  }, [maxPrice]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  if (productsLoading && baseProducts.length === 0) {
    return (
      <>
        <div className="text-center">
          <LoadingComponent size="xl" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-4">Loading Parts...</h1>
        </div>
      </>
  );
  }

  return (
    <>
      <CategorySeo 
        categoryDisplayName={categoryDisplayName} 
        categorySlug={categorySlug} 
        products={sortedProducts} 
      />
      
      
        <CategoryHeader categoryDisplayName={categoryDisplayName} />

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <CategorySidebar 
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            allBrands={allBrands}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            allOrigins={allOrigins}
            selectedOrigins={selectedOrigins}
            setSelectedOrigins={setSelectedOrigins}
            showInStockOnly={showInStockOnly}
            setShowInStockOnly={setShowInStockOnly}
            subCategories={subCategories}
            selectedSubcategories={selectedSubcategories}
            handleSubcategoryToggle={handleSubcategoryToggle}
            clearFilters={clearFilters}
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
          />

          <CategoryGrid 
            products={sortedProducts}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={productsLoading}
            addToCart={addToCart}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </>
  );
};

export default CategoryPage;
