import { useState, useEffect, useMemo, memo } from "react";
import { useParams, Link } from "react-router-dom";


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

  const filteredRelatedProducts = useMemo(() => {
    if (!relatedProducts || !product) return [];
    return relatedProducts.filter(p => p.id !== product.id);
  }, [relatedProducts, product]);

  // Set default SKU when product loads
  useEffect(() => {
    if (product?.skus && product.skus.length > 0 && !selectedSku) {
      setSelectedSku(product.skus[0].code);
    }
  }, [product, selectedSku]);

  const selectedSkuData = useMemo(() => {
    if (!product?.skus || !selectedSku) return null;
    return product.skus.find((sku: any) => sku.code === selectedSku) || null;
  }, [product?.skus, selectedSku]);

  const displayPrice = selectedSkuData?.price ?? product?.price ?? 0;
  const displayOriginalPrice = selectedSkuData?.originalPrice ?? product?.originalPrice;
  const hasDiscount = !!displayOriginalPrice && displayOriginalPrice > displayPrice;
  const discountPercentage = hasDiscount ? Math.round(((displayOriginalPrice! - displayPrice) / displayOriginalPrice!) * 100) : 0;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    if (product.skus?.length > 0 && !selectedSku) {
      toast({ title: "Please select a size/type", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSku);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Added to cart",
        description: `${product.name}${selectedSku ? ` (${selectedSku})` : ''} has been added.`,
      });
    }, 500);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const price = selectedSkuData?.price || product.price;
    const message = `Hello! I'm interested in this spare part:\n\n` +
      `*Part:* ${product.name}\n` +
      `*Type/Size:* ${selectedSku || "Standard"}\n` +
      `*Brand:* ${product.brand || "Authentic OEM"}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Total:* KES ${formatPrice(price * quantity)}\n\n` +
      `Please verify fitment for my vehicle. Link: ${window.location.href}`;
    
    window.open(`https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (productLoading) {
    return (
      <>
        <ProductPageSkeleton />
        </>
  );
  }

  if (productError || !product) {
    return (
      <>
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary mb-4">Part Not Found</h1>
          <p className="text-muted-foreground mb-6">The component you're looking for doesn't exist.</p>
          <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg">Return Home</Link>
        </div>
      </>
  );
  }

  return (
    <>
      <ProductSeo product={product} />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-xs sm:text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.category?.name?.toLowerCase().replace(/\s+/g, '-') || 'parts'}`} className="hover:text-primary">
            {product.category?.name || "Parts"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6 lg:gap-12">
          <ProductGallery 
            product={product} 
            selectedImage={selectedImage} 
            setSelectedImage={setSelectedImage} 
          />

          <div>
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

            {/* Description Tab Mock */}
            <div className="mt-8 border-t pt-8">
               <h2 className="text-lg font-bold mb-4">Product Description</h2>
               <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                 {product.description || `This high-quality ${product.name} is designed for optimal performance and durability. Manufactured to meet OEM standards, it ensures a perfect fit and reliable service life for your vehicle. Genuine component from ${product.brand || 'Precision Parts Kenya'}.`}
               </p>
            </div>
          </div>
        </div>

        <RelatedProducts 
          products={filteredRelatedProducts} 
          addToCart={addToCart} 
        />
      </div>

      </>
  );
});

ProductPage.displayName = 'ProductPage';

export default ProductPage;
