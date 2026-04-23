import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/services/api";
import { productSlug } from "@/lib/utils";
import { isProductInStock } from "@/data/products";
import { buildWhatsAppProductOrderUrl } from "@/lib/whatsapp";

type Props = {
  product: Product;
  onAddToCart: (product: Product) => void;
  compact?: boolean;
};

export function ProductGridCardActions({ product, onAddToCart, compact = true }: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const inStock = isProductInStock(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    if (product.skus && product.skus.length > 0) {
      navigate(`/product/${productSlug(product)}`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onAddToCart(product);
      setLoading(false);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }, 300);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(buildWhatsAppProductOrderUrl(product), "_blank", "noopener,noreferrer");
  };

  const btnClass = compact
    ? "h-8 text-[10px] px-2 gap-1"
    : "text-xs px-2 py-1.5 h-9 gap-1";

  return (
    <div className="flex flex-col gap-1 w-full" onClick={(e) => e.stopPropagation()}>
      {inStock ? (
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={loading}
          className={`w-full bg-primary hover:bg-primary/90 text-white ${btnClass}`}
          onClick={handleAdd}
        >
          <ShoppingCart className="h-3 w-3 shrink-0" />
          {loading ? "…" : "Add to cart"}
        </Button>
      ) : (
        <div
          className={`w-full rounded-md bg-muted text-muted-foreground text-center font-medium ${compact ? "text-[10px] py-1.5" : "text-xs py-2"}`}
        >
          Out of stock
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={`w-full border-green-600 text-green-700 hover:bg-green-50 ${btnClass}`}
        onClick={handleWhatsApp}
      >
        <MessageCircle className="h-3 w-3 shrink-0" />
        WhatsApp
      </Button>
    </div>
  );
}
