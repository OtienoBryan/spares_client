import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Clock,
  MapPin,
  Minus,
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Product } from "@/services/api";
import { useProduct, useProductsByCategory } from "@/hooks/useApi";
import { ProductCard } from "@/components/ui/product-card";
import { LoadingWine, LoadingWave } from "@/components/ui/lottie-loader";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  // Use API hooks to fetch product data
  const productId = id ? parseInt(id, 10) : 0;
  const { data: product, loading: productLoading, error: productError } = useProduct(productId);
  const { data: relatedProducts = [] } = useProductsByCategory(product?.categoryId || 0);

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== productId) || [];

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    setIsLoading(true);
    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Added to cart",
        description: `${product.name} (${quantity}x) has been added to your cart.`,
      });
    }, 500);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };


  const discountPercentage = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Handle loading state
  if (productLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingWine size="xl" className="mx-auto mb-3 sm:mb-4" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-2 sm:mb-4">Loading Product...</h1>
        </div>
      </div>
    );
  }

  // Handle error state
  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-3 sm:mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
            {productError || "The product you're looking for doesn't exist."}
          </p>
          <Link to="/">
            <Button className="text-xs sm:text-sm touch-manipulation">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured data for the product
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images || [product.image],
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "category": product.category?.name,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "KES",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Drinks Avenue"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Alcohol Content",
        "value": product.alcoholContent
      },
      {
        "@type": "PropertyValue",
        "name": "Volume",
        "value": product.volume
      },
      {
        "@type": "PropertyValue",
        "name": "Origin",
        "value": product.origin
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{`${product.name} - ${product.brand} | Drinks Avenue`}</title>
        <meta name="description" content={`Buy ${product.name} by ${product.brand}. ${product.description?.substring(0, 160)}...`} />
        <meta name="keywords" content={`${product.name}, ${product.brand}, ${product.category?.name}, alcohol, drinks, ${product.alcoholContent}, ${product.volume}`} />
        <meta name="author" content="Drinks Avenue" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${window.location.origin}/product/${product.id}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${product.name} - ${product.brand} | Drinks Avenue`} />
        <meta property="og:description" content={`Buy ${product.name} by ${product.brand}. ${product.description?.substring(0, 160)}...`} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`${window.location.origin}/product/${product.id}`} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Drinks Avenue" />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="KES" />
        <meta property="product:availability" content={product.stock > 0 ? "in stock" : "out of stock"} />
        <meta property="product:brand" content={product.brand} />
        <meta property="product:category" content={product.category?.name} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - ${product.brand} | Drinks Avenue`} />
        <meta name="twitter:description" content={`Buy ${product.name} by ${product.brand}. ${product.description?.substring(0, 160)}...`} />
        <meta name="twitter:image" content={product.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-3 sm:mb-4 md:mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-wine transition-colors">
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link to={`/category/${product.category?.name || 'products'}`} className="text-muted-foreground hover:text-wine transition-colors">
                {product.category?.name?.charAt(0).toUpperCase() + product.category?.name?.slice(1) || 'Products'}
          </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-wine font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Product Images */}
          <div className="space-y-2 sm:space-y-3">
            <div className="aspect-square overflow-hidden rounded-lg border mx-auto max-w-[240px] sm:max-w-[260px] md:max-w-[280px]">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={`${product.name} - ${product.brand} - ${product.category?.name} - Drinks Avenue`}
                className="h-full w-full object-contain bg-white"
                loading="eager"
                decoding="async"
                width="340"
                height="340"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-3 gap-1 sm:gap-2 max-w-[280px] md:max-w-[320px] mx-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors touch-manipulation ${
                      selectedImage === index ? 'border-wine' : 'border-muted'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${product.brand} - View ${index + 1}`}
                      className="h-full w-full object-contain bg-white"
                      loading="lazy"
                      decoding="async"
                      width="90"
                      height="90"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details (trimmed for clarity above-the-fold) */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                <Badge className="bg-wine text-white capitalize text-xs px-2 py-1">
                  {product.category?.name || 'Unknown'}
                </Badge>
                {discountPercentage > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-1">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
                {product.stock <= 0 && (
                  <Badge variant="destructive" className="text-xs px-2 py-1">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-wine mb-2 leading-tight">{product.name}</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{product.brand}</p>
              
              <div className="flex items-center gap-2 sm:gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < Math.floor(product.rating)
                            ? "text-gold fill-gold"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground ml-1 sm:ml-2">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-base sm:text-lg md:text-xl font-bold text-wine">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm md:text-base text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  <span className="text-green-600 font-medium text-xs sm:text-sm">
                    In Stock 
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <span className="text-red-600 font-medium text-xs sm:text-sm">Out of Stock</span>
                </>
              )}
            </div>

            {/* Keep the detailed specs and description in tabs below */}

            {/* Purchase Section */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="font-semibold text-xs sm:text-sm text-wine">Purchase Options</h2>

            {/* Quantity and Add to Cart */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-medium text-[11px] sm:text-xs">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="touch-manipulation h-7 w-7 sm:h-8 sm:w-8"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                    <span className="w-9 sm:w-10 text-center font-medium text-xs sm:text-sm">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="touch-manipulation h-7 w-7 sm:h-8 sm:w-8"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {product.stock > 0 ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  size="default"
                  className="w-full bg-wine hover:bg-wine-light text-white text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-3 touch-manipulation active:scale-95 transition-transform"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-3 rounded-md text-center font-medium">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Brief delivery note */}
              <div className="flex items-center gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-wine" />
                <span className="text-xs sm:text-sm text-muted-foreground">Fast delivery. ID required for alcohol.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (reduced to essentials) */}
        <section className="mt-6 sm:mt-8 md:mt-12" aria-label="Product Details">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-8 sm:h-9" role="tablist">
              <TabsTrigger value="details" className="text-[11px] sm:text-xs" role="tab">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="text-[11px] sm:text-xs" role="tab">Reviews</TabsTrigger>
              <TabsTrigger value="shipping" className="text-[11px] sm:text-xs" role="tab">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-3 sm:mt-4" role="tabpanel">
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-sm sm:text-base">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Origin:</span>
                        <span>{product.origin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume:</span>
                        <span>{product.volume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alcohol Content:</span>
                        <span>{product.alcoholContent}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-[11px] sm:text-xs">Description</h4>
                      <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs">{product.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="text-center py-6 sm:py-8">
                    <div className="flex items-center justify-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${
                            i < Math.floor(product.rating)
                              ? "text-gold fill-gold"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-wine mb-2">{product.rating}</h3>
                    <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">Based on {product.reviewCount} reviews</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Reviews are not available in the current API implementation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg">Shipping & Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Delivery Options</h4>
                      <div className="space-y-2 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-wine" />
                          <span>30-minute express delivery - 5.99</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-wine" />
                          <span>Same-day delivery - 3.99</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                          <span>Free delivery on orders over 50</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Delivery Area</h4>
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-wine" />
                        <span>Available in select areas within 30 miles</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Age Verification</h4>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      All alcohol deliveries require age verification. Please have a valid ID ready upon delivery.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <section className="mt-6 sm:mt-8 md:mt-12" aria-label="Related Products">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-3 sm:mb-4 md:mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Footer */}
      <Footer />

      {/* Sticky mobile Add to Cart bar */}
      {product.stock > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t p-2 sm:hidden">
          <div className="container mx-auto px-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-wine">{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-wine hover:bg-wine-light text-white text-xs px-3 py-2"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
