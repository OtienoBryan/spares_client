import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/lazy-image";
import { ShoppingCart, Heart } from "lucide-react";
import { formatPrice } from "@/data/products";
import type { Product as ApiProduct } from "@/services/api";
import { slugify } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  category?: string;
  discount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  skus?: ApiProduct['skus'];
}

interface OptimizedProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: boolean;
  className?: string;
}

const OptimizedProductCard = memo<OptimizedProductCardProps>(({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  className = "",
}) => {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Link to={`/product/${slugify(product.name)}-${product.id}`}>
            <LazyImage
              src={product.image}
              alt={product.name}
              className="w-full h-56 sm:h-64 md:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                New
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                Best Seller
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => onToggleFavorite(product)}
            >
              <Heart 
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`} 
              />
            </Button>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            {product.brand && (
              <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
            )}
            <Link to={`/product/${slugify(product.name)}-${product.id}`}>
              <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-1">
              {product.skus && product.skus.length > 0 ? (
                product.skus.map((sku, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">{sku.code}:</span>
                    <span className="font-bold text-base">{formatPrice(sku.price)}</span>
                    {sku.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(sku.originalPrice)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice!)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {onAddToCart && (
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedProductCard.displayName = "OptimizedProductCard";

export default OptimizedProductCard;
