import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Wrench } from "lucide-react";
import type { VehicleMake } from "@/services/api";

interface ShopByMakeProps {
  makes: VehicleMake[];
  loading: boolean;
  error?: string | null;
}

export const ShopByMake = ({ makes, loading, error }: ShopByMakeProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error("[ShopByMake] Failed to load vehicle makes:", error);
    }
  }, [error]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse mb-6" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Silently hide if API failed or no makes exist — check DevTools console for error details
  if (error || !makes || makes.length === 0) return null;

  // mobile shows first 9 (3 cols × 3 rows), desktop shows first 12 (sm+ breakpoint)
  const visible = makes.slice(0, 12);
  const hasMore = makes.length > 12;

  return (
    <section className="py-8 md:py-12 bg-white" aria-label="Shop by Vehicle Make">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-6 md:mb-8">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-primary mb-0.5 sm:mb-1">
              Shop by Vehicle Make
            </h2>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
              Find parts that fit your vehicle
            </p>
          </div>
          <Link
            to="/makes"
            className="shrink-0 inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 active:bg-primary/80 text-white text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors touch-manipulation"
          >
            View All
            {makes.length > 12 && (
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {makes.length}
              </span>
            )}
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
          {visible.map((make, index) => (
            <button
              key={make.id}
              onClick={() => navigate(`/make/${make.id}`)}
              // items 10–12 (index 9–11) are hidden on mobile, visible on sm+
              className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg active:scale-95 transition-all duration-200 touch-manipulation${index >= 9 ? " hidden sm:flex" : ""}`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl flex items-center justify-center bg-white border border-gray-100 overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                {make.logo ? (
                  <img
                    src={make.logo}
                    alt={make.name}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Wrench className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors text-center leading-tight line-clamp-2">
                {make.name}
              </span>
            </button>
          ))}
        </div>

        {/* View all link below grid — visible on mobile when there are more than 9 */}
        {(hasMore || makes.length > 9) && (
          <div className="mt-5 flex justify-center sm:hidden">
            <Link
              to="/makes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all {makes.length} makes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
