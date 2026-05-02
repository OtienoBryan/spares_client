import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGridCardActions } from "@/components/ProductGridCardActions";
import { useCart } from "@/contexts/CartContext";
import { useVehicleMakes, useProductsByVehicleMake } from "@/hooks/useApi";
import { productSlug } from "@/lib/utils";
import { formatPrice } from "@/data/products";

const VehicleMakePage = () => {
  const { makeId } = useParams<{ makeId: string }>();
  const id = Number(makeId);
  const { addToCart } = useCart();

  const { data: makes } = useVehicleMakes();
  const { data: products, loading, error } = useProductsByVehicleMake(id);

  const make = makes?.find((m) => m.id === id);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 md:py-10">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Make header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
          {make?.logo ? (
            <img src={make.logo} alt={make.name} className="w-full h-full object-contain p-1.5" />
          ) : (
            <Wrench className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {make?.name ?? "Vehicle Make"}
          </h1>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {products?.length ?? 0} part{products?.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-muted h-64" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20 text-muted-foreground">
          <p>Failed to load products. Please try again.</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && (!products || products.length === 0) && (
        <div className="text-center py-20 text-muted-foreground">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="font-medium text-gray-500">No parts found for this vehicle make.</p>
          <p className="text-sm mt-1">Try browsing our full catalog instead.</p>
          <Link
            to="/catalog"
            className="mt-4 inline-block bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Catalog
          </Link>
        </div>
      )}

      {/* Products grid */}
      {!loading && products && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 flex flex-col h-full">
                <Link to={`/product/${productSlug(product)}`} className="block flex-1 min-w-0 touch-manipulation cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="h-40 sm:h-44 md:h-48 w-full object-contain bg-white"
                      loading="lazy"
                      decoding="async"
                    />
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <CardContent className="p-2 sm:p-3">
                    <h3 className="font-semibold text-[10px] sm:text-xs line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.brand && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{product.brand}</p>
                    )}
                  </CardContent>
                </Link>
                <div className="px-2 sm:px-3 pb-2 pt-0 shrink-0">
                  <ProductGridCardActions product={product} onAddToCart={addToCart} />
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleMakePage;
