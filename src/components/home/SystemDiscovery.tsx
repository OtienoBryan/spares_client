import { Link } from "react-router-dom";
import { ArrowRight, Settings, Zap, Disc, ArrowDownUp, Filter, Lightbulb, Package } from "lucide-react";
import { useCategories } from "@/hooks/useApi";
import { Category } from "@/services/api";

// Map a category name to a fallback lucide icon
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

// Accent colour palette — cycles through categories
const ACCENT_PALETTE = [
  { ring: "ring-blue-200",   bg: "bg-blue-50",    icon: "text-blue-600",   hover: "group-hover:bg-blue-600"   },
  { ring: "ring-amber-200",  bg: "bg-amber-50",   icon: "text-amber-600",  hover: "group-hover:bg-amber-600"  },
  { ring: "ring-red-200",    bg: "bg-red-50",     icon: "text-red-600",    hover: "group-hover:bg-red-600"    },
  { ring: "ring-emerald-200",bg: "bg-emerald-50", icon: "text-emerald-600",hover: "group-hover:bg-emerald-600"},
  { ring: "ring-violet-200", bg: "bg-violet-50",  icon: "text-violet-600", hover: "group-hover:bg-violet-600" },
  { ring: "ring-cyan-200",   bg: "bg-cyan-50",    icon: "text-cyan-600",   hover: "group-hover:bg-cyan-600"   },
  { ring: "ring-orange-200", bg: "bg-orange-50",  icon: "text-orange-600", hover: "group-hover:bg-orange-600" },
  { ring: "ring-pink-200",   bg: "bg-pink-50",    icon: "text-pink-600",   hover: "group-hover:bg-pink-600"   },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm">
      <div className="mb-2.5 h-16 w-full rounded-lg bg-gray-100" />
      <div className="mb-2 h-3.5 w-2/3 rounded bg-gray-100" />
      <div className="h-3 w-full rounded bg-gray-100" />
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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label={`Explore ${category.name}`}
    >
      {/* Image / Illustration area */}
      <div className="relative flex h-16 sm:h-18 w-full items-center justify-center overflow-hidden bg-transparent">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 ${accent.ring} transition-all duration-300`}>
            <Icon className={`h-5 w-5 ${accent.icon}`} />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center text-center gap-1 p-2 sm:p-2.5">
        <h3 className="text-[12px] sm:text-[13px] font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        {category.description ? (
          <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug line-clamp-2">
            {category.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-center gap-1 pt-0.5 text-[10px] font-bold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Explore
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}

export function SystemDiscovery() {
  const { data: allCategories, loading } = useCategories();

  // Only show active categories; exclude utility entries like "Home"
  const categories = (allCategories || [])
    .filter((c) => c.isActive && c.name.toLowerCase() !== "home");

  return (
    <section className="py-4 sm:py-6 bg-white overflow-hidden">
      <div className="container mx-auto px-2 sm:px-3">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
              <span className="material-icons text-primary text-xl sm:text-2xl">precision_manufacturing</span>
              Explore by Vehicle System
            </h2>
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-xl font-medium">
              Professional-grade components categorized by system for accurate fitment.
            </p>
          </div>
          <Link
            to="/catalog"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all touch-manipulation"
          >
            Browse all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-2.5 md:gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : categories.length === 0
            ? (
              <div className="col-span-full rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-muted-foreground">
                No categories found. Add categories in the admin panel.
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
