import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/services/api";
import { coerceNumber, formatPrice, getDiscountPercentage, getProductListPrice, isProductInStock } from "@/data/products";
import { productSlug } from "@/lib/utils";
import { buildWhatsAppProductOrderUrl } from "@/lib/whatsapp";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  compact?: boolean; // render a smaller, denser card layout
  /** Extra-small layout (e.g. product page “Recommended Components”) */
  related?: boolean;
  hideAddToCart?: boolean; // hide the add to cart button
  hideWhatsApp?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  compact = false,
  related = false,
  hideAddToCart = false,
  hideWhatsApp = false,
}: ProductCardProps) {
  const dense = compact || related;
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isProductInStock(product)) return;
    
    // If product has SKUs, navigate to product page to select SKU
    if (product.skus && product.skus.length > 0) {
      navigate(`/product/${productSlug(product)}`);
      return;
    }
    
    // If no SKUs, add directly to cart
    setIsLoading(true);
    setTimeout(() => {
      onAddToCart(product);
      setIsLoading(false);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }, 500);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(buildWhatsAppProductOrderUrl(product), "_blank", "noopener,noreferrer");
  };

  const discountPercentage = getDiscountPercentage(product);
  const inStock = isProductInStock(product);
  const { amount: listPrice, fromMultipleSkus } = getProductListPrice(product);
  const listOriginal = coerceNumber(product.originalPrice);
  const showStrike =
    Number.isFinite(listOriginal) && listOriginal > listPrice && listPrice > 0;

  const handleLinkClick = () => {
    setIsNavigating(true);
  };

  return (
    <Link 
      to={`/product/${productSlug(product)}`} 
      className="block"
      onClick={handleLinkClick}
    >
      <Card className={
        `group overflow-hidden transition-all duration-300 ${dense ? 'hover:shadow-lg' : 'hover:shadow-xl hover:scale-[1.05]'} active:scale-95 border-0 flex flex-col touch-manipulation cursor-pointer relative ${isNavigating ? 'pointer-events-none' : ''}`
      }>
        {isNavigating && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-spin" />
              <span className="text-white text-xs sm:text-sm font-semibold">Loading...</span>
            </div>
          </div>
        )}
        <div className="relative overflow-hidden">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className={`${
              related
                ? 'h-28 sm:h-32 md:h-36 lg:h-40 w-[72%] sm:w-[76%] md:w-[80%]'
                : compact
                  ? 'h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 w-[82%] sm:w-[84%] md:w-[86%]'
                  : 'h-72 sm:h-44 md:h-52 lg:h-72 xl:h-80 w-full'
            } mx-auto object-contain bg-white transition-transform duration-300 ${dense ? '' : 'group-hover:scale-105'}`}
            loading="lazy"
            decoding="async"
          />
          {discountPercentage && discountPercentage > 0 && (
            <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-destructive text-destructive-foreground text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold flex items-center gap-1 shadow-sm">
              <span className="material-icons text-[12px] sm:text-[14px]">local_offer</span>
              -{discountPercentage}%
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs sm:text-sm px-3 py-2 font-bold bg-gray-900 border-red-600/50 text-white flex items-center gap-1.5 shadow-lg">
                <span className="material-icons text-base">error_outline</span>
                Out of Stock
              </Badge>
            </div>
          )}
          <Badge className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-primary text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold shadow-sm">
            {product.category?.name || 'Spares'}
          </Badge>
        </div>
        
        <CardContent className={`${related ? 'p-1.5' : compact ? 'p-2' : 'p-3 sm:p-4 md:p-5'} flex flex-col h-full`}>
          <div className={`${dense ? 'space-y-1' : 'space-y-2 sm:space-y-3'} flex-1`}>
            <h3 className={`${
              related ? 'text-[10px] sm:text-[11px]' : compact ? 'text-[11px] sm:text-xs' : 'text-base sm:text-lg md:text-xl'
            } font-bold line-clamp-1 group-hover:text-primary transition-colors tracking-tight`}>
              {product.name}
            </h3>
          
          <div className={`flex flex-col gap-1 ${related ? 'text-[9px]' : compact ? 'text-[10px]' : 'text-xs sm:text-sm'} text-muted-foreground`}>
            <div className={`flex items-center flex-wrap ${dense ? 'gap-1' : 'gap-2 sm:gap-3'}`}>
              <div className={`flex items-center gap-1 font-bold text-gray-700 bg-gray-100 rounded-md ${dense ? 'px-1 py-0.5' : 'px-1.5 py-0.5'}`}>
                <span className={`material-icons text-gray-500 ${dense ? 'text-[10px]' : 'text-[12px] sm:text-[14px]'}`}>settings_suggest</span>
                <span>Specs: {product.specifications || product.alcoholContent || 'N/A'}</span>
              </div>
              {product.origin && (
                <div className="flex items-center gap-1 font-bold text-primary group-hover:underline">
                  <span className={`material-icons ${dense ? 'text-[10px]' : 'text-[12px] sm:text-[14px]'}`}>verified</span>
                  <span>{product.origin}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`flex flex-col gap-2 ${dense ? 'mt-1' : 'mt-3'}`}>
            <div className={`flex flex-col ${dense ? 'gap-1' : 'gap-2'}`}>
                <div className={`flex items-center flex-wrap ${dense ? 'gap-1 sm:gap-2' : 'gap-2 sm:gap-3'}`}>
                  <span className={`${
                    related ? 'text-xs sm:text-sm' : compact ? 'text-sm sm:text-base' : 'text-lg sm:text-xl md:text-2xl'
                  } font-black text-gray-900`}>
                    {fromMultipleSkus && (
                      <span className="text-muted-foreground font-semibold text-[10px] sm:text-xs mr-1">From</span>
                    )}
                    KES {formatPrice(listPrice)}
                  </span>
                  {showStrike && (
                    <span className={`${related ? 'text-[10px]' : compact ? 'text-xs' : 'text-sm sm:text-base'} text-muted-foreground line-through`}>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
            </div>

            {(!hideAddToCart || !hideWhatsApp) && (
              <div className={`flex flex-col w-full ${related ? 'gap-1' : 'gap-1.5'}`}>
                {!hideAddToCart &&
                  (inStock ? (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(e);
                      }}
                      disabled={isLoading}
                      size="sm"
                      className={`bg-primary hover:bg-primary-light text-white w-full ${
                        related
                          ? 'text-[10px] px-2 py-1 h-7'
                          : compact
                            ? 'text-xs sm:text-sm px-3 py-2 h-8'
                            : 'text-sm sm:text-base px-4 py-2 h-9 sm:h-10'
                      } touch-manipulation active:scale-95 transition-transform font-semibold`}
                    >
                      <ShoppingCart
                        className={
                          related
                            ? "mr-1 h-3 w-3"
                            : compact
                              ? "mr-2 h-3 w-3 sm:h-4 sm:w-4"
                              : "mr-2 h-4 w-4 sm:h-4 sm:w-4"
                        }
                      />
                      {isLoading ? "Adding..." : "Add to cart"}
                    </Button>
                  ) : (
                    <div
                      className={`w-full flex items-center justify-center ${
                        related
                          ? 'px-2 py-1 h-7 text-[10px]'
                          : compact
                            ? 'px-3 py-2 h-8 text-xs sm:text-sm'
                            : 'px-4 py-2 h-9 sm:h-10 text-sm sm:text-base'
                      } bg-gray-100 text-gray-500 font-semibold rounded-md`}
                    >
                      Out of Stock
                    </div>
                  ))}
                {!hideWhatsApp && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleWhatsApp}
                    className={`w-full border-green-600 text-green-700 hover:bg-green-50 ${
                      related
                        ? 'text-[10px] px-2 py-1 h-7'
                        : compact
                          ? 'text-xs sm:text-sm px-3 py-2 h-8'
                          : 'text-sm sm:text-base px-4 py-2 h-9 sm:h-10'
                    }`}
                  >
                    <MessageCircle className={`${related ? 'h-3 w-3 mr-1' : compact ? 'h-3 w-3 mr-1.5' : 'h-4 w-4 mr-2'}`} />
                    Order via WhatsApp
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      </Card>
    </Link>
  );
}
