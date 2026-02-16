import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Product } from "@/services/api";
import { formatPrice, getDiscountPercentage, isProductInStock } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  compact?: boolean; // render a smaller, denser card layout
}

export function ProductCard({ product, onAddToCart, compact = false }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!isProductInStock(product)) return;
    
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

  const discountPercentage = getDiscountPercentage(product);
  const inStock = isProductInStock(product);

  return (
    <Card className={
      `group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-transparent hover:border-border flex flex-col touch-manipulation`
    }>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className={`${compact ? 'h-24 sm:h-28 md:h-32 lg:h-36' : 'h-32 sm:h-36 md:h-40 lg:h-44'} w-full object-contain bg-white transition-transform duration-300 group-hover:scale-105`}
            loading="lazy"
            decoding="async"
          />
          {discountPercentage && discountPercentage > 0 && (
            <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-destructive text-destructive-foreground text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1">
              -{discountPercentage}%
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm sm:text-base px-3 py-2 font-semibold bg-red-600 text-white">
                Out of Stock
              </Badge>
            </div>
          )}
          <Badge className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-wine text-white text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1">
            {product.category?.name || 'Drink'}
          </Badge>
        </div>
      </Link>
      
      <CardContent className={`${compact ? 'p-2' : 'p-2 sm:p-3 md:p-4'} flex flex-col h-full`}>
        <div className={`${compact ? 'space-y-1' : 'space-y-1 sm:space-y-2'} flex-1`}>
          <Link to={`/product/${product.id}`}>
            <h3 className={`${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm md:text-sm'} font-semibold line-clamp-1 group-hover:text-wine transition-colors cursor-pointer`}>
              {product.name}
            </h3>
          </Link>
          
          <div className={`flex items-center justify-between ${compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} text-muted-foreground`}>
            <div className={`flex items-center ${compact ? 'gap-1' : 'gap-1 sm:gap-2'}`}>
              <span className="text-gold font-medium">Alc. {product.alcoholContent || 'N/A'}%</span>
            </div>
            {product.volume && (
              <div className="flex items-center gap-1">
                <span className="font-medium">{product.volume}</span>
              </div>
            )}
          </div>
          
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${compact ? 'mt-1' : 'mt-2'}`}>
            <div className={`flex items-center ${compact ? 'gap-1' : 'gap-1 sm:gap-2'}`}>
              <span className={`${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base md:text-lg'} font-bold text-wine`}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className={`${compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} text-muted-foreground line-through`}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {inStock ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart();
                }}
                disabled={isLoading}
                size="sm"
                className={`bg-wine hover:bg-wine-light text-white w-full sm:w-auto ${compact ? 'text-[11px] px-2 py-1 h-7' : 'text-xs sm:text-sm px-3 py-2 h-8 sm:h-9'} touch-manipulation active:scale-95 transition-transform`}
              >
                <ShoppingCart className={`${compact ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'} mr-1`} />
                {isLoading ? "Adding..." : "Add"}
              </Button>
            ) : (
              <div className={`w-full sm:w-auto flex items-center justify-center ${compact ? 'px-2 py-1 h-7 text-[11px]' : 'px-3 py-2 h-8 sm:h-9 text-xs sm:text-sm'} bg-gray-100 text-gray-500 font-medium rounded-md`}>
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}