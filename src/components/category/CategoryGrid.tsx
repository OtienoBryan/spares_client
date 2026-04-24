import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  SearchX
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LazyProductCard = lazy(() => import("@/components/ui/product-card").then(module => ({ default: module.ProductCard })));

interface CategoryGridProps {
  products: any[];
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
  addToCart: (product: any) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const CategoryGrid = ({
  products,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  isLoading,
  addToCart,
  sortBy,
  setSortBy
}: CategoryGridProps) => {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const sortOptions = [
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest Arrivals", value: "newest" },
    { label: "Best Matches", value: "relevance" }
  ];

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-xl h-56 sm:h-64 md:h-72 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 bg-white border rounded-xl p-8 sm:p-12 text-center">
        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted/50 mb-4 sm:mb-6">
          <SearchX className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">No spare parts found</h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto">
          We couldn't find any parts matching your current filters. Try adjusting your selections.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 sm:space-y-8">
      {/* Grid Controls */}
      <div className="flex items-center justify-between bg-white border rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
        <div className="text-xs sm:text-sm font-medium text-muted-foreground text-center sm:text-left">
          Showing <span className="text-gray-900">{products.length}</span> parts
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
              <ArrowUpDown className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] sm:w-[200px]">
            {sortOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={sortBy === option.value ? "text-primary font-semibold" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <Suspense key={product.id} fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
            <LazyProductCard
              product={product}
              onAddToCart={addToCart}
            />
          </Suspense>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isCurrent = currentPage === pageNumber;
              
              // Simple pagination logic for brevity
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg text-xs sm:text-sm font-semibold ${
                      isCurrent ? "bg-primary hover:bg-primary/90" : "hover:text-primary hover:border-primary/20"
                    }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              }
              
              if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return <span key={pageNumber} className="text-muted-foreground">...</span>;
              }
              
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
