import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Category {
  name: string;
  path: string;
  icon?: any;
  subcategories?: Array<{ name: string; path: string }>;
}

interface CategoriesSidebarPermanentProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategoriesSidebarPermanent({ categories, isLoading }: CategoriesSidebarPermanentProps) {
  const location = useLocation();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActiveCategory = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleCategoryMouseEnter = (categoryPath: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCategory(categoryPath);
  };

  const handleCategoryMouseLeave = () => {
    // Add a small delay before hiding to allow moving to subcategory dropdown
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 100);
  };

  const handleSubcategoryMouseEnter = (categoryPath: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCategory(categoryPath);
  };

  const handleSubcategoryMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <aside className="hidden lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col overflow-visible">
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-visible bg-white border-r border-gray-200 shadow-sm scrollbar-hide">
        <div className="flex flex-shrink-0 items-center px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-visible">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 text-sm">Loading categories...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500 text-sm">No categories available</div>
            </div>
          ) : (
            categories.map((category) => {
              const categoryRef = categoryRefs.current[category.path];
              const topPosition = categoryRef ? categoryRef.getBoundingClientRect().top - 64 : 0; // 64px for nav height
              
              return (
                <div 
                  key={category.path} 
                  ref={(el) => { categoryRefs.current[category.path] = el; }}
                  className="group relative"
                  onMouseEnter={() => handleCategoryMouseEnter(category.path)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <Link
                    to={category.path}
                    className={`flex items-center justify-start px-3 py-2.5 rounded-lg transition-all duration-150 shadow-sm ${
                      isActiveCategory(category.path)
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-700 hover:bg-primary/5 hover:text-primary hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      {category.icon && (
                        <category.icon className={`h-4 w-4 mr-3 transition-colors ${
                          isActiveCategory(category.path) ? "text-white" : "text-primary/70"
                        }`} />
                      )}
                      <span className="font-medium text-sm">
                        {category.name}
                      </span>
                    </div>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronRight className={`h-4 w-4 transition-transform duration-150 ${hoveredCategory === category.path ? 'rotate-90' : ''} ${
                        isActiveCategory(category.path) ? "text-white" : "text-gray-400"
                      }`} />
                    )}
                  </Link>
                  
                  {/* Subcategories - Only visible on hover, positioned to the right using fixed positioning */}
                  {category.subcategories && category.subcategories.length > 0 && hoveredCategory === category.path && (
                    <div 
                      className="fixed w-64 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 z-[9999] animate-in fade-in slide-in-from-left-2"
                      style={{
                        left: '264px', // 256px sidebar + 8px gap
                        top: `${topPosition + 64}px` // Add 64px offset for the header
                      }}
                      onMouseEnter={() => handleSubcategoryMouseEnter(category.path)}
                      onMouseLeave={handleSubcategoryMouseLeave}
                    >
                      <div className="p-3">
                        <div className="px-3 py-2 mb-2 border-b border-gray-50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{category.name}</p>
                        </div>
                        <div className="space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.path}
                              to={subcategory.path}
                              onClick={() => {
                                setHoveredCategory(null);
                                if (hoverTimeoutRef.current) {
                                  clearTimeout(hoverTimeoutRef.current);
                                  hoverTimeoutRef.current = null;
                                }
                              }}
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                                location.pathname === subcategory.path || location.search.includes(`subcategory=${subcategory.path.split('=')[1]}`)
                                  ? "bg-primary/10 text-primary font-bold"
                                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
                              }`}
                            >
                              <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </div>
    </aside>
  );
}
