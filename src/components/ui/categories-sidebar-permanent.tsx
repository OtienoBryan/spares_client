import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface SubcategoryItem {
  name: string;
  path: string;
}

interface Category {
  name: string;
  path: string;
  icon?: any;
  subcategories?: SubcategoryItem[];
}

interface CategoriesSidebarPermanentProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategoriesSidebarPermanent({
  categories,
  isLoading,
}: CategoriesSidebarPermanentProps) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const subcategoryItems = useMemo(() => {
    const items = categories.flatMap((c) => c.subcategories ?? []) ?? [];
    return items.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const filteredSubcategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return subcategoryItems;
    return subcategoryItems.filter((s) => s.name.toLowerCase().includes(q));
  }, [subcategoryItems, searchTerm]);

  const isSubActive = (subPath: string) => {
    const [subPathname, subSearch] = subPath.split("?");
    if (subSearch) {
      return (
        location.pathname === subPathname &&
        location.search.includes(subSearch)
      );
    }
    return location.pathname === subPathname;
  };

  return (
    <aside className="hidden lg:fixed lg:top-[114px] lg:bottom-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-full flex-col overflow-hidden border-r border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/90 shadow-[inset_-1px_0_0_rgba(15,23,42,0.04)]">

        {/* Fixed header */}
        <div className="flex flex-shrink-0 flex-col gap-1 border-b border-slate-200/80 bg-white/80 px-4 pb-3 pt-3 backdrop-blur-sm">
          <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-primary to-primary/60" aria-hidden />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Shop by subcategory
          </h2>
          <p className="text-[11px] leading-snug text-slate-400">Browse parts and systems</p>
        </div>

        {/* Fixed top actions (home + search) */}
        <div className="flex flex-shrink-0 flex-col gap-2 px-2.5 pb-2 pt-2">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-all duration-200 ${
              location.pathname === "/"
                ? "border-primary/30 bg-white text-primary shadow-sm ring-1 ring-primary/10"
                : "border-slate-200/90 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-primary hover:shadow-sm"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                location.pathname === "/"
                  ? "bg-primary/15 text-primary"
                  : "bg-slate-100/90 text-primary/80"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <span className="truncate text-[13px] font-semibold">Dashboard</span>
          </Link>

          {/* Search (fixed; list below scrolls) */}
          {!isLoading && subcategoryItems.length > 0 ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subcategories…"
                className="w-full rounded-xl border border-slate-200/90 bg-white/70 py-2 pl-9 pr-3 text-[12px] text-slate-700 shadow-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          ) : null}

          {searchTerm.trim() && !isLoading ? (
            <div className="px-1 text-[10px] text-slate-500">
              Showing {filteredSubcategories.length} result{filteredSubcategories.length === 1 ? "" : "s"}
            </div>
          ) : null}
        </div>

        {/* Scrollable list */}
        <nav className="flex-1 overflow-y-auto px-2.5 pb-3 scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200/80" />
              <div className="text-xs text-slate-500">Loading…</div>
            </div>
          ) : subcategoryItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-8 text-center text-xs text-slate-500">
              No subcategories available
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSubcategories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-6 text-center text-[11px] text-slate-500">
                  No matches
                </div>
              ) : null}

              {filteredSubcategories.map((sub) => {
                const active = isSubActive(sub.path);
                return (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[12px] transition-colors ${
                      active
                        ? "border-primary/25 bg-primary/10 font-semibold text-primary shadow-sm ring-1 ring-primary/10"
                        : "border-slate-200/90 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-primary hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        active ? "bg-primary" : "bg-slate-300"
                      }`}
                      aria-hidden
                    />
                    <span className="truncate">{sub.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
