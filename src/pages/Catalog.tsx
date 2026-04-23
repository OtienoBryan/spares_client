import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useProducts, useCategories } from "@/hooks/useApi";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { productSlug } from "@/lib/utils";
import { buildWhatsAppProductOrderUrl } from "@/lib/whatsapp";
import { LoadingWave, LoadingNetworkError } from "@/components/ui/lottie-loader";
import { useNetworkStatus, isNetworkError } from "@/hooks/useNetworkStatus";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { COMPANY_NAME } from "@/config/site";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  MessageCircle,
  Package,
  Tag,
  Layers,
  ArrowUpDown,
  Grid3X3,
  List,
  Star,
  CheckCircle,
  Filter,
  Hash,
  Car,
} from "lucide-react";
import type { Product, Category } from "@/services/api";

// ─── Types ──────────────────────────────────────────────────────
type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest" | "rating";
type ViewMode = "grid" | "list";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

const ITEMS_PER_PAGE = 24;

// ─── Catalog Page ───────────────────────────────────────────────
const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    origins: false,
    price: true,
  });

  const { addToCart } = useCart();
  const { isOnline } = useNetworkStatus();
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();
  const { data: categories, loading: categoriesLoading } = useCategories();

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeQuery) params.set("q", activeQuery);
    if (selectedCategory) params.set("cat", selectedCategory);
    setSearchParams(params, { replace: true });
  }, [activeQuery, selectedCategory, setSearchParams]);

  // Derived data
  const allBrands = useMemo(() => {
    if (!allProducts) return [];
    const brands = new Set<string>();
    (allProducts as Product[]).forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [allProducts]);

  const allOrigins = useMemo(() => {
    if (!allProducts) return [];
    const origins = new Set<string>();
    (allProducts as Product[]).forEach((p) => {
      if (p.origin) origins.add(p.origin);
    });
    return Array.from(origins).sort();
  }, [allProducts]);

  const maxPrice = useMemo(() => {
    if (!allProducts) return 50000;
    return Math.max(...(allProducts as Product[]).map((p) => p.price || 0), 1000);
  }, [allProducts]);

  // ─── Filtering ────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    const products = allProducts as Product[];
    const query = activeQuery.toLowerCase().trim();

    return products.filter((product) => {
      // Text search — matches name, brand, description, SKU codes, category, origin, tags
      if (query) {
        const searchFields = [
          product.name,
          product.brand,
          product.description,
          product.category?.name,
          product.origin,
          ...(product.tags || []),
          ...(product.skus?.map((s) => s.code) || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchFields.includes(query)) return false;
      }

      // Category filter
      if (selectedCategory) {
        const catName = product.category?.name?.toLowerCase() || "";
        if (catName !== selectedCategory.toLowerCase()) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

      // Origin filter
      if (selectedOrigins.length > 0 && !selectedOrigins.includes(product.origin)) return false;

      // Stock filter
      if (inStockOnly && product.stock <= 0) return false;

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      return true;
    });
  }, [allProducts, activeQuery, selectedCategory, selectedBrands, selectedOrigins, inStockOnly, priceRange]);

  // ─── Sorting ──────────────────────────────────────────────────
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name-asc":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return arr.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return arr.sort((a, b) => b.id - a.id);
      case "rating":
        return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return arr;
    }
  }, [filteredProducts, sortBy]);

  // ─── Pagination ───────────────────────────────────────────────
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      setActiveQuery(searchQuery);
      setCurrentPage(1);
    },
    [searchQuery]
  );

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveQuery("");
    setSelectedCategory("");
    setSelectedBrands([]);
    setSelectedOrigins([]);
    setPriceRange([0, 999999]);
    setInStockOnly(false);
    setSortBy("relevance");
    setCurrentPage(1);
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
    setCurrentPage(1);
  };

  const toggleOrigin = (origin: string) => {
    setSelectedOrigins((prev) => (prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]));
    setCurrentPage(1);
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedBrands.length +
    selectedOrigins.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 999999 ? 1 : 0);

  // ─── Loading / Error states ───────────────────────────────────
  if (productsLoading && !allProducts) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <LoadingWave size="xl" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary mb-2">Loading Catalog...</h1>
            <p className="text-muted-foreground">Indexing parts database</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isOnline || isNetworkError(productsError)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <LoadingNetworkError size="xl" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary mb-4">Connection Error</h1>
            <p className="text-muted-foreground mb-4">Unable to load the parts catalog.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Parts Catalog — {COMPANY_NAME}</title>
        <meta
          name="description"
          content={`Search our complete catalog of genuine automotive spare parts. Find parts by name, SKU, brand, or vehicle compatibility. ${COMPANY_NAME}.`}
        />
      </Helmet>

      <Navigation />

      {/* ─── Hero Search Bar ─────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">Parts Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3">
              Find the Right Part
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
              Search by part name, SKU number, brand, or vehicle make — we'll match you to the exact component.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Brake pads, Toyota Fielder, 04465-12610..."
                className="w-full pl-12 pr-4 py-4 sm:py-5 text-gray-900 text-sm sm:text-base placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveQuery("");
                    setCurrentPage(1);
                  }}
                  className="p-2 mr-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-4 sm:py-5 font-bold text-sm sm:text-base transition-colors shrink-0"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {["Brake Pads", "Oil Filter", "Suspension", "Battery", "Spark Plug"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    setActiveQuery(tag);
                    setCurrentPage(1);
                  }}
                  className="text-xs text-white/60 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* ─── Main Content ────────────────────────────────────── */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-gray-900">{sortedProducts.length}</span>{" "}
              {sortedProducts.length === 1 ? "part" : "parts"} found
              {activeQuery && (
                <>
                  {" "}for "<span className="font-semibold text-primary">{activeQuery}</span>"
                </>
              )}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="bg-primary text-white h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* Sort */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="appearance-none w-full sm:w-auto bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* View mode */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* ─── Sidebar Filters ───────────────────────────────── */}
          <aside
            className={`${
              showFilters ? "fixed inset-0 z-50 bg-black/50 lg:static lg:bg-transparent" : "hidden"
            } lg:block lg:w-64 lg:shrink-0`}
          >
            <div
              className={`${
                showFilters ? "w-80 max-w-[85vw] h-full bg-white overflow-y-auto p-5" : ""
              } lg:w-full lg:p-0 lg:h-auto`}
            >
              {/* Mobile close */}
              {showFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              <div className="space-y-1">
                {/* Categories */}
                <FilterSection
                  title="Category"
                  icon={<Layers className="h-4 w-4" />}
                  expanded={expandedSections.categories}
                  onToggle={() => toggleSection("categories")}
                >
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory ? "bg-primary text-white font-bold" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Categories
                  </button>
                  {(categories as Category[] | null)?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-primary text-white font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </FilterSection>

                {/* Brands */}
                <FilterSection
                  title="Brand"
                  icon={<Tag className="h-4 w-4" />}
                  expanded={expandedSections.brands}
                  onToggle={() => toggleSection("brands")}
                >
                  {allBrands.slice(0, 15).map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="truncate">{brand}</span>
                    </label>
                  ))}
                </FilterSection>

                {/* Origin */}
                <FilterSection
                  title="Origin"
                  icon={<Car className="h-4 w-4" />}
                  expanded={expandedSections.origins}
                  onToggle={() => toggleSection("origins")}
                >
                  {allOrigins.slice(0, 10).map((origin) => (
                    <label
                      key={origin}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOrigins.includes(origin)}
                        onChange={() => toggleOrigin(origin)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="truncate">{origin}</span>
                    </label>
                  ))}
                </FilterSection>

                {/* Stock + Price */}
                <FilterSection
                  title="Availability & Price"
                  icon={<SlidersHorizontal className="h-4 w-4" />}
                  expanded={expandedSections.price}
                  onToggle={() => toggleSection("price")}
                >
                  <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={() => {
                        setInStockOnly(!inStockOnly);
                        setCurrentPage(1);
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>In Stock Only</span>
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-auto" />
                  </label>
                  <div className="px-3 pt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0] || ""}
                        onChange={(e) => {
                          setPriceRange([Number(e.target.value) || 0, priceRange[1]]);
                          setCurrentPage(1);
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <span className="text-gray-400 text-xs">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1] < 999999 ? priceRange[1] : ""}
                        onChange={(e) => {
                          setPriceRange([priceRange[0], Number(e.target.value) || 999999]);
                          setCurrentPage(1);
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </FilterSection>
              </div>

              {/* Mobile apply button */}
              {showFilters && (
                <div className="mt-6 lg:hidden">
                  <Button onClick={() => setShowFilters(false)} className="w-full bg-primary text-white">
                    Apply Filters ({sortedProducts.length} results)
                  </Button>
                </div>
              )}
            </div>
          </aside>

          {/* ─── Product Results ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No parts found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {activeQuery
                    ? `We couldn't find parts matching "${activeQuery}". Try a different search term or clear your filters.`
                    : "No parts match the current filters. Try adjusting your criteria."}
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {paginatedProducts.map((product) => (
                  <CatalogGridCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedProducts.map((product) => (
                  <CatalogListCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// ─── Filter Section Component ───────────────────────────────────
function FilterSection({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
          {icon}
          {title}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {expanded && <div className="px-1 pb-3 space-y-0.5">{children}</div>}
    </div>
  );
}

// ─── Grid Card ──────────────────────────────────────────────────
function CatalogGridCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  const inStock = product.stock > 0;

  return (
    <Link to={`/product/${productSlug(product)}`} className="block group">
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95">
        <div className="relative bg-white">
          <img
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-40 sm:h-48 md:h-52 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className="bg-primary/90 text-white text-[9px] px-1.5 py-0.5 font-bold">
              {product.category?.name || "Parts"}
            </Badge>
            {product.brand && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 font-bold bg-gray-100 text-gray-700">
                {product.brand}
              </Badge>
            )}
          </div>
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-gray-900/80 px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
          {inStock && (
            <div className="absolute top-2 right-2">
              <div className="h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" title="In Stock" />
            </div>
          )}
        </div>
        <CardContent className="p-3 space-y-2">
          <h3 className="text-xs sm:text-sm font-bold line-clamp-2 text-gray-900 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>

          {/* SKU / Part info */}
          {product.skus && product.skus.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{product.skus[0].code}</span>
            </div>
          )}

          {/* Fitment / Origin */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {product.origin && (
              <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                <Car className="h-2.5 w-2.5" />
                {product.origin}
              </span>
            )}
            {product.rating > 0 && (
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-2.5 w-2.5 fill-current" />
                <span className="text-gray-600 font-medium">{product.rating}</span>
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-gray-900">
              KES {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 pt-1">
            <Button
              size="sm"
              className="flex-1 h-8 text-[11px] bg-primary hover:bg-primary/90 text-white font-bold"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (inStock) onAddToCart(product);
              }}
              disabled={!inStock}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {inStock ? "Add" : "Unavailable"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 border-green-200 text-green-700 hover:bg-green-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(buildWhatsAppProductOrderUrl(product), "_blank");
              }}
            >
              <MessageCircle className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── List Card ──────────────────────────────────────────────────
function CatalogListCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  const inStock = product.stock > 0;

  return (
    <Link to={`/product/${productSlug(product)}`} className="block group">
      <Card className="overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-primary/20">
        <div className="flex gap-4 p-3 sm:p-4">
          {/* Image */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-white rounded-xl overflow-hidden border border-gray-50">
            <img
              src={product.image || "/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-full object-contain p-1"
              loading="lazy"
            />
            {inStock && (
              <div className="absolute top-1 right-1 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <span className="text-base sm:text-lg font-black text-gray-900 shrink-0">
                  KES {formatPrice(product.price)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 font-bold">
                  {product.category?.name || "Parts"}
                </Badge>
                {product.brand && (
                  <span className="text-[10px] text-gray-500 font-medium">{product.brand}</span>
                )}
                {product.skus && product.skus.length > 0 && (
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-0.5">
                    <Hash className="h-2.5 w-2.5" />
                    {product.skus[0].code}
                  </span>
                )}
                {product.origin && (
                  <span className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                    <Car className="h-2.5 w-2.5" />
                    {product.origin}
                  </span>
                )}
                {inStock ? (
                  <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
                    <CheckCircle className="h-2.5 w-2.5" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-[10px] text-red-500 font-bold">Out of Stock</span>
                )}
              </div>

              {product.description && (
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-1 hidden sm:block">{product.description}</p>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                className="h-7 text-[11px] bg-primary hover:bg-primary/90 text-white font-bold px-4"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (inStock) onAddToCart(product);
                }}
                disabled={!inStock}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] border-green-200 text-green-700 hover:bg-green-50 px-3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(buildWhatsAppProductOrderUrl(product), "_blank");
                }}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default CatalogPage;
