import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useSearchProductsDebounced } from "@/hooks/useApi";
import { LoadingSpares } from "@/components/ui/lottie-loader";
import { formatPrice } from "@/data/products";
import { productSlug } from "@/lib/utils";
import { apiService } from "@/services/api";

/** `toolbar` = full-width row (e.g. mobile nav); `default` = centered max width (desktop header) */
export type NavSearchLayout = "default" | "toolbar";

interface NavSearchProps {
  layout?: NavSearchLayout;
}

export const NavSearch = ({ layout = "default" }: NavSearchProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const { data: searchSuggestions = [], loading: suggestionsLoading } = useSearchProductsDebounced(searchQuery, 200);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    void (async () => {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      try {
        const results = await apiService.searchProducts(trimmedQuery);
        if (Array.isArray(results) && results.length > 0) {
          const lowerQuery = trimmedQuery.toLowerCase();
          const exactMatch =
            results.find((p: any) => p?.name?.toLowerCase() === lowerQuery) ??
            results.find((p: any) => productSlug(p)?.toLowerCase() === lowerQuery);

          const target = exactMatch ?? results[0];
          navigate(`/product/${productSlug(target)}`);
          setSearchQuery("");
          setShowSuggestions(false);
          return;
        }
      } catch (err) {
        console.error("Search navigation failed:", err);
      }

      navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    })();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const uniqueBrands = useMemo(() => {
    if (!searchSuggestions || searchSuggestions.length === 0 || !searchQuery) return [];
    const brands = new Set<string>();
    const lowerQuery = searchQuery.toLowerCase();
    searchSuggestions.forEach((product: any) => {
      if (product.brand && product.brand.toLowerCase().includes(lowerQuery)) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).slice(0, 5);
  }, [searchSuggestions, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleSearch(e);
    } else if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev < searchSuggestions.length - 1 ? prev + 1 : 0);
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : searchSuggestions.length - 1);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isToolbar = layout === "toolbar";

  return (
    <div
      className={
        isToolbar
          ? "relative w-full"
          : "relative mx-auto w-full max-w-2xl px-1 sm:px-0"
      }
    >
      <form onSubmit={handleSearch} className="relative group">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={
            isToolbar
              ? "Search parts, brands, SKUs…"
              : "Search for genuine spare parts, brands, or SKUs..."
          }
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-lg border-2 border-gray-100 bg-gray-50 pr-10 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${
            isToolbar ? "py-2 pl-3 text-sm" : "py-2 pl-4 text-sm"
          }`}
        />
        <button 
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-md transition-colors group-focus-within:text-primary"
        >
          <Search className={`text-gray-400 ${isToolbar ? "h-4 w-4" : "h-4 w-4"}`} />
        </button>
      </form>
      
      {showSuggestions && searchQuery.length > 0 && (
        <div 
          ref={suggestionsRef}
          className={`absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-xl max-h-80 overflow-y-auto ${
            isToolbar ? "z-[110]" : "z-50"
          }`}
        >
          {suggestionsLoading ? (
            <div className="p-4 text-center text-gray-500">
              <LoadingSpares size="sm" />
              <span className="ml-2">Searching components...</span>
            </div>
          ) : (
            <div className="py-2">
              {uniqueBrands.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">Brands</div>
                  {uniqueBrands.map(brand => (
                    <button key={brand} onClick={() => { navigate(`/brands/${encodeURIComponent(brand)}`); setSearchQuery(""); setShowSuggestions(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{brand.charAt(0)}</div>
                      <span className="font-medium text-gray-900">{brand}</span>
                    </button>
                  ))}
                  <div className="border-t my-1"></div>
                </>
              )}
              {searchSuggestions.slice(0, 8).map((product, index) => (
                <Link key={product.id} to={`/product/${productSlug(product)}`} onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${index === selectedSuggestionIndex ? 'bg-gray-100' : ''}`}>
                  <img src={product.image || '/placeholder-product.jpg'} alt="" className="w-10 h-10 object-contain rounded bg-white" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate text-sm">{product.name}</div>
                    <div className="text-xs text-primary font-bold">KES {formatPrice(product.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
