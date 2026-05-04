import { Link } from "react-router-dom";
import { ArrowRight, Settings, Zap, Disc, ArrowDownUp, Filter, Lightbulb, Package } from "lucide-react";
import { useCategories } from "@/hooks/useApi";
import { Category } from "@/services/api";

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("engine")) return Settings;
  if (n.includes("electric") || n.includes("ignition") || n.includes("battery")) return Zap;
  if (n.includes("brake") || n.includes("braking")) return Disc;
  if (n.includes("suspension") || n.includes("steering")) return ArrowDownUp;
  if (n.includes("filter")) return Filter;
  if (n.includes("light") || n.includes("lamp")) return Lightbulb;
  return Package;
}

const ACCENT_PALETTE = [
  { bg: "bg-blue-50",     icon: "text-blue-500",    border: "border-blue-100"   },
  { bg: "bg-amber-50",    icon: "text-amber-500",   border: "border-amber-100"  },
  { bg: "bg-red-50",      icon: "text-red-500",     border: "border-red-100"    },
  { bg: "bg-emerald-50",  icon: "text-emerald-500", border: "border-emerald-100"},
  { bg: "bg-violet-50",   icon: "text-violet-500",  border: "border-violet-100" },
  { bg: "bg-cyan-50",     icon: "text-cyan-500",    border: "border-cyan-100"   },
  { bg: "bg-orange-50",   icon: "text-orange-500",  border: "border-orange-100" },
  { bg: "bg-pink-50",     icon: "text-pink-500",    border: "border-pink-100"   },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <div className="h-28 sm:h-32 bg-gray-100" />
      <div className="p-2">
        <div className="h-2.5 w-3/4 mx-auto rounded bg-gray-100" />
      </div>
    </div>
  );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const accent = ACCENT_PALETTE[index % ACCENT_PALETTE.length];
  const path = `/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`;
  const Icon = getCategoryIcon(category.name);

  return (
    <Link
      to={path}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 touch-manipulation"
      aria-label={`Explore ${category.name}`}
    >
      {/* Image area — large */}
      <div className={`relative flex h-28 sm:h-32 md:h-36 w-full items-center justify-center overflow-hidden ${accent.bg} border-b ${accent.border}`}>
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            decoding="async"
            className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
          />
        ) : (
          <div className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl ${accent.bg} border ${accent.border}`}>
            <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${accent.icon}`} />
          </div>
        )}

        {/* Hover overlay arrow */}
        <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center justify-center px-2 py-2.5 text-center">
        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 group-hover:text-primary transition-colors leading-tight line-clamp-2">
          {category.name}
        </span>
      </div>
    </Link>
  );
}

export function SystemDiscovery() {
  const { data: allCategories, loading } = useCategories();

  const categories = (allCategories || [])
    .filter((c) => c.isActive && c.name.toLowerCase() !== "home");

  return (
    <section className="py-6 sm:py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">

        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-primary mb-0.5 sm:mb-1 flex items-center gap-2">
              <span className="material-icons text-primary text-xl sm:text-2xl leading-none">precision_manufacturing</span>
              Explore by Vehicle System
            </h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Shop genuine parts by system for accurate fitment.
            </p>
          </div>
          <Link
            to="/catalog"
            className="shrink-0 inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors touch-manipulation"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5 sm:gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : categories.length === 0
            ? (
              <div className="col-span-full rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-muted-foreground">
                No categories found.
              </div>
            )
            : categories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
