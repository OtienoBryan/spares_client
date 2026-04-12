import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Category {
  name: string;
  path: string;
  icon?: string;
  subcategories?: Array<{ name: string; path: string }>;
}

interface CategoriesSidebarProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategoriesSidebar({ categories, isLoading }: CategoriesSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs sm:text-sm"
          aria-label="Open categories menu"
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Categories</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-primary">
            <Menu className="h-5 w-5" />
            Categories
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading categories...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">No categories available</div>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.path} className="group">
                <Link
                  to={category.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors duration-150 group/item"
                >
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <span className="text-xl" aria-hidden="true">
                        {category.icon}
                      </span>
                    )}
                    <span className="font-medium text-gray-700 group-hover/item:text-primary transition-colors">
                      {category.name}
                    </span>
                  </div>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover/item:text-primary transition-colors" />
                  )}
                </Link>
                
                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.path}
                        to={subcategory.path}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-150"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
