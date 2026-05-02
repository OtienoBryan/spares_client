import { useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useVehicleMakes } from "@/hooks/useApi";

const AllMakesPage = () => {
  const navigate = useNavigate();
  const { data: makes, loading, error } = useVehicleMakes();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-1">
          All Vehicle Makes
        </h1>
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${makes?.length ?? 0} make${makes?.length !== 1 ? "s" : ""} available`}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20 text-muted-foreground">
          <p>Failed to load vehicle makes. Please try again.</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && (!makes || makes.length === 0) && (
        <div className="text-center py-20 text-muted-foreground">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="font-medium text-gray-500">No vehicle makes found.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && makes && makes.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
          {makes.map((make) => (
            <button
              key={make.id}
              onClick={() => navigate(`/make/${make.id}`)}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg active:scale-95 transition-all duration-200 touch-manipulation"
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
      )}
    </div>
  );
};

export default AllMakesPage;
