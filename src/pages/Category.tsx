import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";


import { useProductsByCategory, useCategories, useSearchProductsDebounced, useSubCategories } from "@/hooks/useApi";
import { Product, Category, SubCategory } from "@/services/api";
import { getProductListPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { LoadingComponent } from "@/components/ui/lottie-loader";
import { CategorySkeleton } from "@/components/ui/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { CategorySeo } from "@/components/category/CategorySeo";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { CategoryGrid } from "@/components/category/CategoryGrid";

const CategoryPage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const subcategoryParam = searchParams.get('subcategory');

  const toSlug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  
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

  // Sync subcategory from URL
  useEffect(() => {
    if (subcategoryParam) {
      const id = parseInt(subcategoryParam);
      if (!isNaN(id)) {
        setSelectedSubcategories([id]);
      }
    } else {
      setSelectedSubcategories([]);
    }
  }, [subcategoryParam]);

  // Find the current category ID from the slug
  const currentCategory = useMemo(() => {
    if (!categories || !categorySlug) return null;
    const normalizedSlug = toSlug(decodeURIComponent(categorySlug));
    return (categories as Category[]).find(c => toSlug(c.name) === normalizedSlug);
  }, [categories, categorySlug]);

  const categoryId = currentCategory?.id || 0;
  const categoryDisplayName = currentCategory?.name || (categorySlug ? categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Products');

  // Fetch products
  const { data: categoryProducts = [], loading: productsLoading, error: productsError } = useProductsByCategory(categoryId);

  // Fetch subcategories for this category (used for badges + filters)
  const { data: apiSubCategories } = useSubCategories(categoryId);
  
  // Search logic if applicable
  const { data: searchResults } = useSearchProductsDebounced(initialSearch, 300);
  
  const baseProducts = useMemo((): Product[] => {
    // Some API hooks can yield `null` before data arrives; normalize to array.
    if (initialSearch) return (searchResults ?? []) as Product[];
    return (categoryProducts ?? []) as Product[];
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
    return Math.max(
      ...baseProducts.map((p) => getProductListPrice(p).amount || 0),
      1000,
    );
  }, [baseProducts]);

  // Handle price range update when base products change
  useEffect(() => {
    if (maxPrice > 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const subCategories = useMemo(() => {
    const subs = (apiSubCategories ?? []) as SubCategory[];
    return subs.filter(sc => sc.isActive !== false);
  }, [apiSubCategories]);

  // Filtration logic
  const filteredProducts = useMemo(() => {
    return baseProducts.filter(product => {
      // Category filter (if searching globally)
      if (initialSearch && categoryId > 0 && product.categoryId !== categoryId) return false;
      
      // Price filter (align with card: base price or min SKU)
      const price = getProductListPrice(product).amount || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      
      // Origins filter
      if (selectedOrigins.length > 0 && (!product.origin || !selectedOrigins.includes(product.origin))) return false;
      
      // Brands filter
      if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) return false;
      
      // Stock filter
      if (showInStockOnly && product.stock === 0) return false;
      
      // Subcategories filter
      if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(product.subcategoryId || 0)) return false;
      
      return true;
    });
  }, [baseProducts, priceRange, selectedOrigins, selectedBrands, showInStockOnly, selectedSubcategories, initialSearch, categoryId]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return products.sort(
          (a, b) => getProductListPrice(a).amount - getProductListPrice(b).amount,
        );
      case "price-desc":
        return products.sort(
          (a, b) => getProductListPrice(b).amount - getProductListPrice(a).amount,
        );
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

  if (productsLoading) {
    return <CategorySkeleton />;
  }

  return (
    <>
      <CategorySeo 
        categoryDisplayName={categoryDisplayName} 
        categorySlug={categorySlug} 
        products={sortedProducts} 
      />
      
      
        <div className="w-full overflow-x-hidden">
          <CategoryHeader categoryDisplayName={categoryDisplayName} />

        {subCategories.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete("subcategory");
                  setSearchParams(next);
                  setSelectedSubcategories([]);
                  setCurrentPage(1);
                }}
                className="shrink-0"
              >
                <Badge
                  variant={selectedSubcategories.length === 0 ? "default" : "secondary"}
                  className="cursor-pointer whitespace-nowrap"
                >
                  All
                </Badge>
              </button>

              {subCategories.map((sc) => {
                const active = selectedSubcategories.includes(sc.id);
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      if (active) {
                        next.delete("subcategory");
                        setSearchParams(next);
                        setSelectedSubcategories([]);
                      } else {
                        next.set("subcategory", String(sc.id));
                        setSearchParams(next);
                        setSelectedSubcategories([sc.id]);
                      }
                      setCurrentPage(1);
                    }}
                    className="shrink-0"
                  >
                    <Badge
                      variant={active ? "default" : "outline"}
                      className={`cursor-pointer whitespace-nowrap ${active ? "" : "hover:bg-primary/10 hover:border-primary/30 hover:text-primary"}`}
                    >
                      {sc.name}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 sm:gap-8">
            <div className="w-full lg:w-64 xl:w-72 shrink-0">
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
            </div>

            <div className="min-w-0 flex-1 overflow-x-hidden">
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
          </div>
        </div>
      </>
  );
};

export default CategoryPage;
