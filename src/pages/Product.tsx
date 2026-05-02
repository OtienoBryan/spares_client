import { useState, useEffect, useMemo, memo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { useProduct, useProductsByCategory } from "@/hooks/useApi";
import { ProductPageSkeleton } from "@/components/ui/loading-skeleton";
import { slugToProductId, productSlug } from "@/lib/utils";
import { WHATSAPP_ORDER_NUMBER } from "@/lib/whatsapp";
import { formatPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { ProductSeo } from "@/components/product/ProductSeo";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { RelatedProducts } from "@/components/product/RelatedProducts";

const ProductPage = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  const productId = useMemo(() => (slug ? slugToProductId(slug) : 0), [slug]);
  const { data: product, loading: productLoading, error: productError } = useProduct(productId);

  const shouldFetchRelated = !productLoading && !!product?.categoryId;
  const { data: relatedProducts = [] } = useProductsByCategory(product?.categoryId || 0, shouldFetchRelated);

  const filteredRelated = useMemo(() => {
    if (!relatedProducts || !product) return [];
    return (relatedProducts as any[]).filter((p: any) => p.id !== product.id);
  }, [relatedProducts, product]);

  useEffect(() => {
    if (product?.skus && product.skus.length > 0 && !selectedSku) {
      setSelectedSku(product.skus[0].code);
    }
  }, [product, selectedSku]);

  const selectedSkuData = useMemo(() => {
    if (!product?.skus || !selectedSku) return null;
    return product.skus.find((s: any) => s.code === selectedSku) || null;
  }, [product?.skus, selectedSku]);

  const displayPrice = selectedSkuData?.price ?? (product as any)?.price ?? 0;
  const displayOriginalPrice = selectedSkuData?.originalPrice ?? (product as any)?.originalPrice;
  const hasDiscount = !!displayOriginalPrice && displayOriginalPrice > displayPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((displayOriginalPrice! - displayPrice) / displayOriginalPrice!) * 100)
    : 0;

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= ((product as any)?.stock || 99)) setQuantity(next);
  };

  const handleAddToCart = () => {
    if (!product || (product as any).stock <= 0) return;
    if ((product as any).skus?.length > 0 && !selectedSku) {
      toast({ title: "Please select a size/variation", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    for (let i = 0; i < quantity; i++) addToCart(product, selectedSku);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Added to cart ✓",
        description: `${product.name}${selectedSku ? ` (${selectedSku})` : ""} ×${quantity}`,
      });
    }, 400);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const price = selectedSkuData?.price || (product as any).price;
    const msg =
      `Hello! I'd like to order this spare part:\n\n` +
      `*Part:* ${product.name}\n` +
      `*Variation:* ${selectedSku || "Standard"}\n` +
      `*Brand:* ${(product as any).brand || "Genuine OEM"}\n` +
      `*Qty:* ${quantity}\n` +
      `*Total:* KES ${formatPrice(price * quantity)}\n\n` +
      `Please confirm fitment. Link: ${window.location.href}`;
    window.open(`https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (productLoading) return <ProductPageSkeleton />;

  if (productError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-xl font-bold text-primary mb-3">Part Not Found</h1>
        <p className="text-muted-foreground mb-6 text-sm">The component you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const categorySlug = product.category?.name?.toLowerCase().replace(/\s+/g, "-") || "parts";

  return (
    <>
      <ProductSeo product={product} />

      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link to={`/category/${categorySlug}`} className="hover:text-primary transition-colors">
            {product.category?.name || "Parts"}
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-10 items-start">
          {/* Left — Gallery (sticky on large screens) */}
          <ProductGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          {/* Right — Details */}
          <div className="space-y-6">
            <ProductDetails
              product={product}
              selectedSku={selectedSku}
              setSelectedSku={setSelectedSku}
              displayPrice={displayPrice}
              displayOriginalPrice={displayOriginalPrice}
              hasDiscount={hasDiscount}
              discountPercentage={discountPercentage}
              isFavorite={isFavorite}
              setIsFavorite={setIsFavorite}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              handleAddToCart={handleAddToCart}
              handleWhatsAppOrder={handleWhatsAppOrder}
              isLoading={isLoading}
            />

            <ProductSpecs product={product} />
          </div>
        </div>

        {/* Description — full width below grid */}
        {product.description && (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Product Description</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {/* Related */}
        <RelatedProducts products={filteredRelated} addToCart={addToCart} />
      </div>
    </>
  );
});

ProductPage.displayName = "ProductPage";
export default ProductPage;
