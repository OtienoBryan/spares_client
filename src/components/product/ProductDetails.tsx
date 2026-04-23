import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";
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
  setIsFavorite: (favorite: boolean | ((v: boolean) => boolean)) => void;
  quantity: number;
  handleQuantityChange: (change: number) => void;
  handleAddToCart: () => void;
  handleWhatsAppOrder: () => void;
  isLoading: boolean;
}

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
  isLoading
}: ProductDetailsProps) => {
  return (
    <div className="w-full max-w-none">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {(discountPercentage > 0 || product.isOnOffer) && (
              <Badge className="bg-primary text-white text-xs px-2 py-0.5 rounded">
                Deal of the Day
              </Badge>
            )}
            {product.stock <= 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5 rounded">
                Out of stock
              </Badge>
            )}
          </div>

          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {(product.skus && product.skus.length > 0 && selectedSku) ? selectedSku : (product.dimensions || "Standard Unit")}
            </span>
            <span className="inline-flex items-center gap-1 text-gray-900">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="font-medium">{product.rating ?? 0}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 whitespace-nowrap">
              KES {formatPrice(displayPrice)}
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm text-muted-foreground line-through whitespace-nowrap">
                  KES {formatPrice(displayOriginalPrice || 0)}
                </div>
                {discountPercentage > 0 && (
                  <Badge variant="outline" className="text-xs border-primary text-primary">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFavorite(v => !v)}
          className="mt-0.5 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border bg-white hover:bg-gray-50 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "text-primary fill-primary" : "text-gray-600"}`} />
        </button>
      </div>

      {/* Sku Selector */}
      {product.skus && product.skus.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold text-gray-900 mb-2">Technical Variations / Sizes</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {product.skus.map((sku: any) => {
              const isSelected = selectedSku === sku.code;
              const label = String(sku.code || "").replace(/[_-]+/g, " ").trim();
              const skuHasDiscount = !!sku.originalPrice && sku.originalPrice > sku.price;
              return (
                <button
                  key={sku.code}
                  type="button"
                  onClick={() => setSelectedSku(sku.code)}
                  className={`rounded-lg border px-3 py-2.5 text-center text-xs font-semibold leading-tight transition-colors min-h-[64px] ${
                    isSelected ? "border-primary text-primary" : "border-gray-200 text-gray-900 hover:border-primary/60"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="line-clamp-1">{label}</div>
                    <div className={`text-[11px] font-bold ${isSelected ? "text-primary" : "text-gray-900"}`}>
                      KES {formatPrice(sku.price)}
                    </div>
                    {skuHasDiscount && (
                      <div className="text-[10px] text-muted-foreground line-through">
                        KES {formatPrice(sku.originalPrice)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 justify-between sm:justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || isLoading}
            className="h-9 w-9 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="min-w-[44px] text-center font-semibold text-sm">{quantity}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= (product.stock || 99) || isLoading}
            className="h-9 w-9 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 text-white h-11 h-12"
            disabled={product.stock <= 0 || isLoading}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-primary text-primary hover:bg-primary hover:text-white h-11 h-12"
            onClick={handleWhatsAppOrder}
            disabled={isLoading}
          >
            <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            WhatsApp Order
          </Button>
        </div>
      </div>
    </div>
  );
};
