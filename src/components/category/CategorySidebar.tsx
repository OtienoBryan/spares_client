import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { formatPrice } from "@/data/products";

interface CategorySidebarProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  maxPrice: number;
  allBrands: string[];
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  allOrigins: string[];
  selectedOrigins: string[];
  setSelectedOrigins: (origins: string[]) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (show: boolean) => void;
  subCategories: any[];
  selectedSubcategories: number[];
  handleSubcategoryToggle: (id: number) => void;
  clearFilters: () => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (open: boolean) => void;
}

export const CategorySidebar = ({
  priceRange,
  setPriceRange,
  maxPrice,
  allBrands,
  selectedBrands,
  setSelectedBrands,
  allOrigins,
  selectedOrigins,
  setSelectedOrigins,
  showInStockOnly,
  setShowInStockOnly,
  subCategories,
  selectedSubcategories,
  handleSubcategoryToggle,
  clearFilters,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
}: CategorySidebarProps) => {
  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleOriginToggle = (origin: string) => {
    if (selectedOrigins.includes(origin)) {
      setSelectedOrigins(selectedOrigins.filter(o => o !== origin));
    } else {
      setSelectedOrigins([...selectedOrigins, origin]);
    }
  };

  const totalActiveFilters = selectedBrands.length + selectedOrigins.length + selectedSubcategories.length + (showInStockOnly ? 1 : 0);

  const SidebarContent = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold flex items-center">
          <Filter className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Filters
        </h2>
        {totalActiveFilters > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-primary text-xs h-8 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Subcategories */}
      {subCategories.length > 0 && (
        <div>
          <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Part Types</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {subCategories.map((sub) => (
              <div key={sub.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`sub-${sub.id}`} 
                  checked={selectedSubcategories.includes(sub.id)}
                  onCheckedChange={() => handleSubcategoryToggle(sub.id)}
                />
                <label 
                  htmlFor={`sub-${sub.id}`}
                  className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {sub.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Price (KES)</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, maxPrice]}
            max={maxPrice}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Origin / Manufacturer */}
      {allOrigins.length > 0 && (
        <div>
          <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Origin / Manufacturer</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {allOrigins.map((origin) => (
              <div key={origin} className="flex items-center space-x-2">
                <Checkbox 
                  id={`origin-${origin}`} 
                  checked={selectedOrigins.includes(origin)}
                  onCheckedChange={() => handleOriginToggle(origin)}
                />
                <label 
                  htmlFor={`origin-${origin}`}
                  className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {origin}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {allBrands.length > 0 && (
        <div>
          <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Brand</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {allBrands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <label 
                  htmlFor={`brand-${brand}`}
                  className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="in-stock" 
            checked={showInStockOnly}
            onCheckedChange={(checked) => setShowInStockOnly(!!checked)}
          />
          <label 
            htmlFor="in-stock"
            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-24 bg-white border rounded-xl p-6 shadow-sm">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileFilterOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent />
            <div className="mt-8 space-y-3">
              <Button className="w-full bg-primary text-white" onClick={() => setIsMobileFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
