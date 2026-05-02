import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star, Heart, Minus, Plus, ShoppingCart, MessageCircle,
  Truck, ShieldCheck, RotateCcw, Phone, CheckCircle2, AlertCircle, Clock,
  Car, CalendarDays, ChevronRight
} from "lucide-react";
import { formatPrice } from "@/data/products";

interface ProductDetailsProps {
  product: any;
  selectedSku: string | null;
  setSelectedSku: (sku: string) => void;
  displayPrice: number;
  displayOriginalPrice?: number;
  hasDiscount: boolean;
  discountPercentage: number;
  isFavorite: boolean;
  setIsFavorite: (v: boolean | ((v: boolean) => boolean)) => void;
  quantity: number;
  handleQuantityChange: (change: number) => void;
  handleAddToCart: () => void;
  handleWhatsAppOrder: () => void;
  isLoading: boolean;
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Genuine OEM" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Phone, label: "WhatsApp Support" },
];

export const ProductDetails = ({
  product,
  selectedSku,
  setSelectedSku,
  displayPrice,
  displayOriginalPrice,
  hasDiscount,
  discountPercentage,
  isFavorite,
  setIsFavorite,
  quantity,
  handleQuantityChange,
  handleAddToCart,
  handleWhatsAppOrder,
  isLoading,
}: ProductDetailsProps) => {
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 10;
  const savings = hasDiscount ? (displayOriginalPrice || 0) - displayPrice : 0;

  const fitmentGroups = useMemo(() => {
    const models: any[] = product.vehicleModels || [];
    const years: any[] = product.vehicleYears || [];
    if (models.length === 0) return [];
    const map = new Map<string, { id: number; name: string; years: any[] }[]>();
    for (const model of models) {
      const key = model.make?.name || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ id: model.id, name: model.name, years: years.filter(y => y.modelId === model.id) });
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [product.vehicleModels, product.vehicleYears]);

  return (
    <div className="w-full space-y-5">
      {/* Top badges row */}
      <div className="flex flex-wrap items-center gap-2">
        {product.category?.name && (
          <Badge variant="outline" className="text-xs text-muted-foreground border-gray-200">
            {product.category.name}
          </Badge>
        )}
        {product.brand && (
          <Badge variant="outline" className="text-xs text-muted-foreground border-gray-200">
            {product.brand}
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
            {discountPercentage}% OFF
          </Badge>
        )}
        {product.isOnOffer && (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
            🏷 On Offer
          </Badge>
        )}
      </div>

      {/* Title + Wishlist */}
      <div className="flex items-start gap-3">
        <h1 className="flex-1 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>
        <button
          type="button"
          onClick={() => setIsFavorite(v => !v)}
          className="mt-1 shrink-0 h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Rating */}
      {(product.rating > 0 || product.reviewCount > 0) && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">{product.rating?.toFixed(1)}</span>
          {product.reviewCount > 0 && (
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          )}
        </div>
      )}

      {/* Price + Vehicle Compatibility side by side */}
      <div className={`flex gap-3 ${fitmentGroups.length > 0 ? "flex-col sm:flex-row items-stretch" : ""}`}>
        {/* Price block */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-1 flex-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Price</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              KES {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-base sm:text-lg text-muted-foreground line-through">
                KES {formatPrice(displayOriginalPrice || 0)}
              </span>
            )}
          </div>
          {hasDiscount && savings > 0 && (
            <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              You save KES {formatPrice(savings)}
            </p>
          )}
        </div>

        {/* Vehicle Compatibility */}
        {fitmentGroups.length > 0 && (
          <div className="flex-1 rounded-xl border border-blue-100 bg-blue-50/40 p-4 min-w-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Car className="h-3.5 w-3.5 text-primary shrink-0" />
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Fits</p>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-28">
              {fitmentGroups.map(([makeName, models]) => (
                <div key={makeName}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{makeName}</p>
                  {models.map(model => (
                    <div key={model.id} className="flex items-start gap-1.5">
                      <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-800 leading-snug">
                        <span className="font-semibold">{model.name}</span>
                        {model.years.length > 0 ? (
                          <span className="ml-1 text-muted-foreground">
                            {model.years.map((y: any) => `${y.yearFrom}–${y.yearTo ?? "Now"}`).join(", ")}
                          </span>
                        ) : (
                          <span className="ml-1 inline-flex items-center gap-0.5 text-muted-foreground">
                            <CalendarDays className="h-2.5 w-2.5" /> All years
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SKU selector */}
      {product.skus && product.skus.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2.5">
            Select Variation / Size
            {selectedSku && (
              <span className="ml-2 font-normal text-muted-foreground">— {selectedSku}</span>
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {product.skus.map((sku: any) => {
              const active = selectedSku === sku.code;
              const label = String(sku.code || "").replace(/[_-]+/g, " ").trim();
              const skuDiscount = sku.originalPrice && sku.originalPrice > sku.price;
              return (
                <button
                  key={sku.code}
                  type="button"
                  onClick={() => setSelectedSku(sku.code)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                    active
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-gray-200 text-gray-800 hover:border-primary/50 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold line-clamp-1 mb-0.5">{label}</div>
                  <div className={`text-sm font-bold ${active ? "text-primary" : "text-gray-900"}`}>
                    KES {formatPrice(sku.price)}
                  </div>
                  {skuDiscount && (
                    <div className="text-[10px] text-muted-foreground line-through">
                      KES {formatPrice(sku.originalPrice)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {inStock ? (
          <>
            <CheckCircle2 className={`h-4 w-4 ${lowStock ? "text-orange-500" : "text-green-500"}`} />
            <span className={`text-sm font-semibold ${lowStock ? "text-orange-600" : "text-green-600"}`}>
              {lowStock ? `Only ${product.stock} left in stock` : "In Stock"}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold text-red-600">Out of Stock</span>
          </>
        )}
      </div>

      {/* Quantity + CTA */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 w-20 shrink-0">Quantity</span>
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isLoading}
              className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[40px] text-center text-sm font-bold text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= (product.stock || 99) || isLoading}
              className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {quantity > 1 && (
            <span className="text-sm text-muted-foreground">
              Total: <strong className="text-gray-900">KES {formatPrice(displayPrice * quantity)}</strong>
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1 h-11 text-sm font-bold bg-primary hover:bg-primary/90 active:bg-primary/80 shadow-sm"
            disabled={!inStock || isLoading}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isLoading ? "Adding…" : inStock ? "Add to Cart" : "Out of Stock"}
          </Button>

          <Button
            variant="outline"
            className="flex-1 h-11 text-sm font-bold border-2 border-green-500 text-green-700 hover:bg-green-50 active:bg-green-100"
            onClick={handleWhatsAppOrder}
            disabled={isLoading}
          >
            <MessageCircle className="mr-2 h-4 w-4 fill-green-500 text-green-500" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Delivery info */}
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4 space-y-2.5">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Delivery Info</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <Truck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Nairobi — Same Day / Next Day</p>
              <p className="text-xs text-muted-foreground">Order before 12 PM for same-day delivery</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Outside Nairobi — 2–3 Business Days</p>
              <p className="text-xs text-muted-foreground">Countrywide via courier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-[11px] font-semibold text-gray-600 leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
