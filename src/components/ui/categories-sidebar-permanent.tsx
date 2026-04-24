import { Link, useLocation } from "react-router-dom";
import { ChevronRight, LayoutDashboard } from "lucide-react";
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
  const headerOffsetPx = 114;

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
    <aside className="hidden lg:fixed lg:top-[114px] lg:bottom-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col overflow-visible">
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-visible border-r border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/90 shadow-[inset_-1px_0_0_rgba(15,23,42,0.04)] scrollbar-hide">
        <div className="flex flex-shrink-0 flex-col gap-1 border-b border-slate-200/80 bg-white/60 px-4 pb-4 pt-4 backdrop-blur-sm">
          <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-primary to-primary/60" aria-hidden />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Shop by category
          </h2>
          <p className="text-xs leading-snug text-slate-400">Browse parts and systems</p>
        </div>
        <nav className="mt-2 flex-1 space-y-1 overflow-visible px-2.5 pb-3 pt-1">
          <Link
            to="/"
            className={`mb-1 flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2.5 transition-all duration-200 ${
              location.pathname === "/"
                ? "border-primary/30 bg-white text-primary shadow-sm ring-1 ring-primary/10"
                : "border-slate-200/90 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-primary hover:shadow-sm"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  location.pathname === "/"
                    ? "bg-primary/15 text-primary"
                    : "bg-slate-100/90 text-primary/80 hover:bg-primary/10"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <span className="truncate text-sm font-semibold leading-tight">Dashboard</span>
            </div>
          </Link>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200/80" />
              <div className="text-xs text-slate-500">Loading categories…</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-8 text-center text-xs text-slate-500">
              No categories available
            </div>
          ) : (
            categories.map((category) => {
              const categoryRef = categoryRefs.current[category.path];
              const topPosition = categoryRef ? categoryRef.getBoundingClientRect().top - headerOffsetPx : 0;
              const active = isActiveCategory(category.path);

              return (
                <div
                  key={category.path}
                  ref={(el) => {
                    categoryRefs.current[category.path] = el;
                  }}
                  className="group relative"
                  onMouseEnter={() => handleCategoryMouseEnter(category.path)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <Link
                    to={category.path}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2.5 transition-all duration-200 ${
                      active
                        ? "border-primary/30 bg-white text-primary shadow-sm ring-1 ring-primary/10"
                        : "border-slate-200/90 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-primary hover:shadow-sm"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      {category.icon && (
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            active ? "bg-primary/15 text-primary" : "bg-slate-100/90 text-primary/80 group-hover:bg-primary/10"
                          }`}
                        >
                          <category.icon className="h-4 w-4" />
                        </span>
                      )}
                      <span className="truncate text-sm font-semibold leading-tight">{category.name}</span>
                    </div>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                          hoveredCategory === category.path ? "translate-x-0.5 text-primary" : ""
                        } ${active ? "text-primary/70" : ""}`}
                      />
                    )}
                  </Link>

                  {category.subcategories && category.subcategories.length > 0 && hoveredCategory === category.path && (
                    <div
                      className="fixed z-[9999] w-[17rem] animate-in fade-in slide-in-from-left-2 duration-200"
                      style={{
                        left: "calc(16rem + 0.5rem)",
                        top: `${topPosition + headerOffsetPx}px`,
                      }}
                      onMouseEnter={() => handleSubcategoryMouseEnter(category.path)}
                      onMouseLeave={handleSubcategoryMouseLeave}
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_22px_50px_-12px_rgba(15,23,42,0.18)]">
                        <div className="border-b border-slate-100 bg-gradient-to-r from-primary/[0.06] to-transparent px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">In {category.name}</p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-800">Subcategories</p>
                        </div>
                        <div className="max-h-[min(70vh,24rem)] space-y-0.5 overflow-y-auto p-2">
                          {category.subcategories.map((subcategory) => {
                            const subActive =
                              location.pathname === subcategory.path ||
                              location.search.includes(`subcategory=${subcategory.path.split("=")[1]}`);
                            return (
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
                                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                                  subActive
                                    ? "border-primary/25 bg-primary/10 font-semibold text-primary"
                                    : "border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-primary"
                                }`}
                              >
                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary/40" />
                                <span className="truncate">{subcategory.name}</span>
                              </Link>
                            );
                          })}
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
