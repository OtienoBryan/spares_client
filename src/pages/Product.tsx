import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Minus,
  Plus,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import type { Product } from "@/services/api";
import { useProduct, useProductsByCategory } from "@/hooks/useApi";
import { LoadingWine, LoadingWave } from "@/components/ui/lottie-loader";
import { ProductPageSkeleton } from "@/components/ui/loading-skeleton";
import { formatPrice } from "@/data/products";
import { slugToProductId, productSlug } from "@/lib/utils";

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Extract the numeric ID from the slug (e.g. "johnnie-walker-42" → 42)
  const productId = slug ? slugToProductId(slug) : 0;
  const { data: product, loading: productLoading, error: productError } = useProduct(productId);
  
  // Only fetch related products after main product loads and has categoryId
  const shouldFetchRelated = !productLoading && product?.categoryId && product.categoryId > 0;
  const { data: relatedProducts = [] } = useProductsByCategory(product?.categoryId || 0, shouldFetchRelated);

  // Memoize filtered related products to avoid recalculation
  const filteredRelatedProducts = useMemo(() => {
    if (!relatedProducts || relatedProducts.length === 0) return [];
    return relatedProducts.filter(p => p.id !== productId);
  }, [relatedProducts, productId]);

  // Memoized helper function to get best discount percentage from SKUs only
  const getBestDiscountFromSKU = useCallback((product: any) => {
    if (!product?.skus || product.skus.length === 0) return 0;
    
    let maxDiscount = 0;
    for (const sku of product.skus) {
      if (sku.originalPrice && sku.originalPrice > sku.price) {
        const discount = ((sku.originalPrice - sku.price) / sku.originalPrice) * 100;
        if (discount > maxDiscount) {
          maxDiscount = discount;
        }
      }
    }
    return maxDiscount;
  }, []);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    // If product has SKUs, require SKU selection
    if (product.skus && product.skus.length > 0 && !selectedSku) {
      toast({
        title: "Please select a SKU",
        description: "Please select a SKU before adding to cart.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // Add the product to cart with the selected quantity and SKU
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSku);
    }
    setTimeout(() => {
      setIsLoading(false);
      const skuText = selectedSku ? ` (${selectedSku})` : '';
      toast({
        title: "Added to cart",
        description: `${product.name}${skuText} (${quantity}x) has been added to your cart.`,
      });
    }, 500);
  };

  // Set default SKU when product loads
  useEffect(() => {
    if (product?.skus && product.skus.length > 0 && !selectedSku) {
      setSelectedSku(product.skus[0].code);
    }
  }, [product, selectedSku]);

  // Prefetch product images for faster switching
  useEffect(() => {
    if (product?.images && product.images.length > 1) {
      product.images.forEach((imageUrl) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = imageUrl;
        document.head.appendChild(link);
      });
    }
  }, [product?.images]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    
    const selectedSkuData = product.skus && selectedSku 
      ? product.skus.find(sku => sku.code === selectedSku)
      : null;
    
    const price = selectedSkuData?.price || product.price;
    const skuText = selectedSkuData ? ` (${selectedSkuData.code})` : '';
    
    const message = `Hello! I would like to order:\n\n` +
      `*${product.name}*${skuText}\n` +
      `Brand: ${product.brand}\n` +
      `Quantity: ${quantity}\n` +
      `Price: KES ${formatPrice(price)}\n` +
      `Total: KES ${formatPrice(price * quantity)}\n\n` +
      `Product Link: ${window.location.href}`;
    
    const whatsappNumber = '254712345678'; // Replace with your WhatsApp business number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };


  // Memoize discount percentage calculation
  const discountPercentage = useMemo(() => {
    if (!product?.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }, [product?.originalPrice, product?.price]);

  // Memoize enhanced structured data for SEO - MUST be before early returns to follow Rules of Hooks
  const structuredData = useMemo(() => {
    if (!product) return null;
    
    const baseUrl = window.location.origin;
    const productUrl = `${baseUrl}/product/${productSlug(product)}`;
    
    // Build product schema
    const productSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
      "description": product.description || `${product.name} by ${product.brand}${product.origin ? ` from ${product.origin}` : ''} - Premium ${product.category?.name || 'drink'} available at Drinks Avenue Kenya. ${product.alcoholContent ? `Alcohol content: ${product.alcoholContent}% ABV.` : ''} ${product.volume ? `Volume: ${product.volume}.` : ''} Fast 30-minute delivery in Nairobi and across Kenya.`,
      "image": product.images && product.images.length > 0 
        ? (Array.isArray(product.images) ? product.images : [product.image])
        : (product.image ? [product.image] : []),
    "brand": {
      "@type": "Brand",
        "name": product.brand || "Drinks Avenue"
    },
      "category": product.category?.name || "Drinks",
      "sku": product.id?.toString() || "",
      "mpn": product.id?.toString() || "",
      "gtin": product.id?.toString() || "",
      "url": productUrl,
      "manufacturer": product.brand ? {
        "@type": "Organization",
        "name": product.brand
      } : undefined,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "KES",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": productUrl,
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "seller": {
        "@type": "Organization",
          "name": "Drinks Avenue",
          "url": baseUrl
    },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "KES"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "KE"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "businessDays": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            },
            "cutoffTime": "23:00",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            }
          }
        }
      }
    };

    // Add aggregateRating only if rating exists
    if (product.rating) {
      productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1,
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    // Add additional properties
    const additionalProperties = [];
    if (product.alcoholContent) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Alcohol Content",
        "value": product.alcoholContent
      });
    }
    if (product.volume) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Volume",
        "value": product.volume
      });
    }
    if (product.origin) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Origin",
        "value": product.origin
      });
    }
    if (product.stock !== undefined) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Stock",
        "value": product.stock > 0 ? "In Stock" : "Out of Stock"
      });
    }

    if (additionalProperties.length > 0) {
      productSchema.additionalProperty = additionalProperties;
    }

    // Add SKU offers if available
    if (product.skus && product.skus.length > 0) {
      productSchema.hasVariant = product.skus.map((sku: any) => ({
        "@type": "ProductModel",
        "name": `${product.name} - ${sku.code}`,
        "sku": sku.code,
        "offers": {
          "@type": "Offer",
          "price": sku.price,
          "priceCurrency": "KES",
          "availability": "https://schema.org/InStock",
          "url": productUrl,
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          "seller": {
            "@type": "Organization",
            "name": "Drinks Avenue"
          }
        }
      }));
    }

    return productSchema;
  }, [product]);

  // Breadcrumb structured data
  const breadcrumbStructuredData = useMemo(() => {
    if (!product) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": product.category?.name || "Products",
          "item": `${window.location.origin}/category/${product.category?.name?.toLowerCase() || 'products'}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": `${window.location.origin}/product/${productSlug(product)}`
      }
    ]
  };
  }, [product]);

  // FAQ structured data for SEO
  const faqStructuredData = useMemo(() => {
    if (!product) return null;
    
    const faqs = [
      {
        "@type": "Question",
        "name": `What is the price of ${product.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The price of ${product.name} by ${product.brand} is KES ${formatPrice(product.price)}${product.volume ? ` for ${product.volume}` : ''}. ${product.originalPrice && product.originalPrice > product.price ? `Original price was KES ${formatPrice(product.originalPrice)}.` : ''}`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${product.name} available for delivery in Kenya?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, ${product.name} is available for delivery across Kenya. We offer fast 30-minute delivery in Nairobi and delivery to other cities in Kenya. ${product.stock > 0 ? 'The product is currently in stock.' : 'Please check availability before ordering.'}`
        }
      },
      {
        "@type": "Question",
        "name": `What is the alcohol content of ${product.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": product.alcoholContent 
            ? `${product.name} has an alcohol content of ${product.alcoholContent}% ABV.`
            : `Alcohol content information is not available for ${product.name}. Please contact us for more details.`
        }
      }
    ];

    if (product.origin) {
      faqs.push({
        "@type": "Question",
        "name": `Where is ${product.name} from?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${product.name} by ${product.brand} is from ${product.origin}.`
        }
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs
    };
  }, [product]);

  // Show skeleton immediately while loading - better perceived performance
  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <ProductPageSkeleton />
        <Footer />
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

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags - Enhanced */}
      <Helmet>
        <title>{`${product.name} - ${product.brand} | Buy Online | KES ${formatPrice(product.price)} | Drinks Avenue Kenya`}</title>
        <meta name="description" content={`Buy ${product.name} by ${product.brand} online at Drinks Avenue Kenya. ${product.description || `Premium ${product.category?.name || 'drink'}`} ${product.origin ? `from ${product.origin}` : ''} ${product.alcoholContent ? `(${product.alcoholContent}% ABV)` : ''} ${product.volume ? `- ${product.volume}` : ''}. Fast 30-minute delivery in Nairobi & Kenya. Free delivery available. Order now!`} />
        <meta name="keywords" content={`${product.name}, ${product.brand}, ${product.category?.name}, buy ${product.name} online Kenya, ${product.name} Nairobi, ${product.name} delivery Kenya, ${product.brand} ${product.category?.name}, ${product.name} price Kenya, ${product.name} ${product.origin || ''}, alcohol delivery Kenya, ${product.alcoholContent ? `${product.name} ${product.alcoholContent}%` : ''}, ${product.volume ? `${product.name} ${product.volume}` : ''}, premium ${product.category?.name} Kenya, drinks delivery Nairobi, buy ${product.brand} online, ${product.category?.name} delivery Kenya, online alcohol store Kenya, wine delivery Nairobi, spirits delivery Kenya`} />
        <meta name="author" content="Drinks Avenue" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="geo.position" content="-1.2921;36.8219" />
        <link rel="canonical" href={`${window.location.origin}/product/${productSlug(product)}`} />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {product.images?.[0] && (
          <link rel="preload" href={product.images[0]} as="image" fetchPriority="high" />
        )}
        
        {/* Open Graph Tags - Enhanced */}
        <meta property="og:title" content={`${product.name} - ${product.brand} | KES ${formatPrice(product.price)} | Drinks Avenue`} />
        <meta property="og:description" content={`Buy ${product.name} by ${product.brand} online in Kenya. ${product.description || `Premium ${product.category?.name || 'drink'}`} ${product.origin ? `from ${product.origin}` : ''} ${product.alcoholContent ? `(${product.alcoholContent}% ABV)` : ''}. Fast 30-minute delivery in Nairobi. Order now!`} />
        <meta property="og:image" content={product.images?.[0] || product.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${product.name} by ${product.brand} - Premium ${product.category?.name || 'drink'} ${product.origin ? `from ${product.origin}` : ''} - Drinks Avenue Kenya`} />
        <meta property="og:url" content={`${window.location.origin}/product/${productSlug(product)}`} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Drinks Avenue" />
        <meta property="og:locale" content="en_KE" />
        <meta property="product:price:amount" content={product.price?.toString() || "0"} />
        <meta property="product:price:currency" content="KES" />
        <meta property="product:availability" content={product.stock > 0 ? "in stock" : "out of stock"} />
        <meta property="product:brand" content={product.brand || "Drinks Avenue"} />
        <meta property="product:category" content={product.category?.name || "Drinks"} />
        {product.origin && (
          <meta property="product:retailer_item_id" content={product.id.toString()} />
        )}
        {product.rating && (
          <meta property="product:rating:value" content={product.rating.toString()} />
        )}
        {product.reviewCount && (
          <meta property="product:rating:count" content={product.reviewCount.toString()} />
        )}
        
        {/* Twitter Card Tags - Enhanced */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - ${product.brand} | KES ${formatPrice(product.price)} | Drinks Avenue`} />
        <meta name="twitter:description" content={`Buy ${product.name} by ${product.brand} online in Kenya. ${product.description?.substring(0, 200) || `Premium ${product.category?.name || 'drink'}`} ${product.origin ? `from ${product.origin}` : ''}. Fast delivery in Nairobi.`} />
        <meta name="twitter:image" content={product.images?.[0] || product.image} />
        <meta name="twitter:image:alt" content={`${product.name} by ${product.brand} - Premium ${product.category?.name || 'drink'} - Drinks Avenue Kenya`} />
        
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#8B1538" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Structured Data - Product */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
        
        {/* Structured Data - BreadcrumbList */}
        {breadcrumbStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbStructuredData)}
          </script>
        )}
        
        {/* Structured Data - FAQPage */}
        {faqStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(faqStructuredData)}
          </script>
        )}
      </Helmet>

      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Breadcrumb Navigation - Enhanced for SEO */}
        <nav className="mb-3 sm:mb-4 md:mb-6" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
          <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/" className="text-muted-foreground hover:text-wine transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-muted-foreground" aria-hidden="true">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to={`/category/${product.category?.name?.toLowerCase() || 'products'}`} className="text-muted-foreground hover:text-wine transition-colors" itemProp="item">
                <span itemProp="name">{product.category?.name?.charAt(0).toUpperCase() + product.category?.name?.slice(1) || 'Products'}</span>
          </Link>
              <meta itemProp="position" content="2" />
            </li>
            <li className="text-muted-foreground" aria-hidden="true">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-wine font-medium truncate max-w-[200px] sm:max-w-none">
              <span itemProp="name">{product.name}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8" itemScope itemType="https://schema.org/Product">
          {/* Product Images */}
          <div className="space-y-2 sm:space-y-3">
            <div className="aspect-square overflow-hidden rounded-lg border mx-auto max-w-[400px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={`${product.name} by ${product.brand} - Premium ${product.category?.name || 'drink'} available at Drinks Avenue. ${product.alcoholContent ? `Alcohol content: ${product.alcoholContent}.` : ''} ${product.volume ? `Volume: ${product.volume}.` : ''} Fast delivery across Kenya.`}
                className="h-full w-full object-contain bg-white"
                loading="eager"
                decoding="async"
                width="500"
                height="500"
                fetchPriority="high"
                itemProp="image"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-3 gap-1 sm:gap-2 max-w-[280px] md:max-w-[320px] mx-auto">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors touch-manipulation ${
                      selectedImage === index ? 'border-wine' : 'border-muted'
                    }`}
                    aria-label={`View image ${index + 1} of ${product.images.length}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${product.brand} - View ${index + 1}`}
                      className="h-full w-full object-contain bg-white"
                      loading={index === 0 ? "eager" : "lazy"}
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
                {product.category?.name && (
                  <Link to={`/category/${product.category.name.toLowerCase()}`}>
                    <Badge className="bg-wine text-white capitalize text-xs px-2 py-1 hover:bg-wine/90 transition-colors cursor-pointer">
                      {product.category.name}
                    </Badge>
                  </Link>
                )}
                {!product.category?.name && (
                <Badge className="bg-wine text-white capitalize text-xs px-2 py-1">
                    Unknown
                </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-1">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
                {product.stock <= 0 && (
                  <Badge variant="destructive" className="text-xs px-2 py-1">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-wine mb-2 leading-tight" itemProp="name">
                {product.name}
                {product.origin && <span className="text-muted-foreground font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"> from {product.origin}</span>}
              </h1>
              {product.brand && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-2" itemProp="brand" itemScope itemType="https://schema.org/Brand">
                  <Link 
                    to={`/brands/${encodeURIComponent(product.brand)}`}
                    className="hover:text-wine transition-colors underline-offset-2 hover:underline"
                    itemProp="name"
                  >
                    {product.brand}
                  </Link>
                </p>
              )}
              
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

            {/* Product Details - Top Section */}
            <div className="space-y-2 sm:space-y-3 mb-4 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border" itemScope itemType="https://schema.org/Product">
              <h2 className="font-semibold text-xs sm:text-sm text-wine mb-2 sm:mb-3">Product Details</h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                {product.brand && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-0.5">Brand</span>
                    <Link 
                      to={`/brands/${encodeURIComponent(product.brand)}`}
                      className="font-medium text-foreground hover:text-wine transition-colors underline-offset-2 hover:underline"
                    >
                      {product.brand}
                    </Link>
                  </div>
                )}
                {product.origin && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-0.5">Origin</span>
                    <Link 
                      to={`/origin/${encodeURIComponent(product.origin)}`}
                      className="font-medium text-foreground hover:text-wine transition-colors underline-offset-2 hover:underline"
                    >
                      {product.origin}
                    </Link>
                  </div>
                )}
                {product.volume && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-0.5">Volume</span>
                    <span className="font-medium text-foreground">{product.volume}</span>
                  </div>
                )}
                {product.alcoholContent && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-0.5">Alcohol Content</span>
                    <span className="font-medium text-foreground">{product.alcoholContent}% ABV</span>
                  </div>
                )}
              </div>
            </div>

            {/* SKU Selection */}
            {product.skus && product.skus.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select SKU:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.skus.map((sku, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSku(sku.code)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedSku === sku.code
                          ? 'border-wine bg-wine/10'
                          : 'border-gray-200 hover:border-wine/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-semibold text-gray-900">{sku.code}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-base font-bold text-wine">
                              {formatPrice(sku.price)}
                            </span>
                            {sku.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(sku.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedSku === sku.code && (
                          <CheckCircle className="h-5 w-5 text-wine" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price (fallback if no SKUs) */}
            {(!product.skus || product.skus.length === 0) && (
              <div className="flex items-center gap-2 sm:gap-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span className="text-base sm:text-lg md:text-xl font-bold text-wine" itemProp="price" content={product.price?.toString()}>
                  {formatPrice(product.price)}
                </span>
                <meta itemProp="priceCurrency" content="KES" />
                <meta itemProp="availability" content={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                {product.originalPrice && (
                  <span className="text-xs sm:text-sm md:text-base text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            )}

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
                <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  size="default"
                    className="w-auto max-w-xs bg-wine hover:bg-wine-light text-white text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-3 px-4 sm:px-6 md:px-8 touch-manipulation active:scale-95 transition-transform"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
                  <Button
                    onClick={handleWhatsAppOrder}
                    size="default"
                    variant="outline"
                    className="w-auto bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-3 px-4 sm:px-6 md:px-8 touch-manipulation active:scale-95 transition-transform"
                  >
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>
              ) : (
                <div className="w-auto max-w-xs bg-gray-100 text-gray-500 text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-3 px-4 sm:px-6 md:px-8 rounded-md text-center font-medium">
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

        {/* Product Details Tabs (reduced to essentials) - Deferred rendering */}
        <section className="mt-6 sm:mt-8 md:mt-12" aria-label="Product Details">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8 sm:h-9" role="tablist">
              <TabsTrigger value="details" className="text-[11px] sm:text-xs" role="tab">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="text-[11px] sm:text-xs" role="tab">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-3 sm:mt-4" role="tabpanel">
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <h2 className="text-sm sm:text-base font-semibold">Product Description</h2>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div itemProp="description">
                    <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                      {product.description || `Discover ${product.name} by ${product.brand}${product.origin ? ` from ${product.origin}` : ''}${product.category?.name ? `, a premium ${product.category.name.toLowerCase()}` : ''} available at Drinks Avenue. ${product.alcoholContent ? `With ${product.alcoholContent}% ABV, ` : ''}this product offers exceptional quality and taste. Order now for fast delivery across Kenya.`}
                    </p>
                    {product.description && (
                      <div className="mt-3 space-y-2 text-xs sm:text-sm text-muted-foreground">
                        {product.origin && (
                          <p><strong>Origin:</strong> {product.origin}</p>
                        )}
                        {product.alcoholContent && (
                          <p><strong>Alcohol Content:</strong> {product.alcoholContent}% ABV</p>
                        )}
                        {product.volume && (
                          <p><strong>Volume:</strong> {product.volume}</p>
                        )}
                        <p><strong>Delivery:</strong> Fast 30-minute delivery available in Nairobi. Free delivery on orders above KES 2,000.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <h2 className="text-base sm:text-lg font-semibold">Customer Reviews</h2>
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
          </Tabs>
        </section>

        {/* Related Products - Lazy loaded after main content */}
        {filteredRelatedProducts.length > 0 && (
          <section 
            className="mt-6 sm:mt-8 md:mt-12 py-3 sm:py-4 md:py-6 bg-gradient-to-br from-wine/5 to-primary/5" 
            aria-label="Related Products"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            <div className="container mx-auto px-3 sm:px-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-wine mb-3 sm:mb-4 md:mb-6" itemProp="name">You Might Also Like</h2>
              <meta itemProp="numberOfItems" content={filteredRelatedProducts.slice(0, 6).length.toString()} />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 items-stretch">
              {filteredRelatedProducts.slice(0, 6).map((relatedProduct, index) => (
                <div key={relatedProduct.id} className="relative group flex flex-col h-full" itemScope itemType="https://schema.org/ListItem">
                  <meta itemProp="position" content={(index + 1).toString()} />
                  <Link to={`/product/${productSlug(relatedProduct)}`} className="block flex-1 flex flex-col">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 touch-manipulation cursor-pointer flex flex-col h-full">
                      <div className="relative overflow-hidden flex-shrink-0" style={{ minHeight: '144px' }}>
                        <img
                          src={relatedProduct.image || '/placeholder-product.jpg'}
                          alt={relatedProduct.name}
                          className="h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 w-full object-contain bg-white"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {/* Discount Badge - Only show if there's a SKU discount */}
                        {getBestDiscountFromSKU(relatedProduct) > 0 && (
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                            {Math.round(getBestDiscountFromSKU(relatedProduct))}% OFF
                          </div>
                        )}
                      </div>
                      <CardContent className="p-2 sm:p-2 md:p-3 lg:p-3 flex flex-col flex-1">
                        <div className="space-y-1 sm:space-y-2 flex flex-col flex-1">
                          <h3 className="font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm line-clamp-2 min-h-[2em] group-hover:text-wine transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 ${
                                    i < Math.floor(relatedProduct.rating || 0)
                                      ? "text-gold fill-gold"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              ({relatedProduct.reviewCount || 0})
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            {relatedProduct.skus && relatedProduct.skus.length > 0 ? (
                              <>
                                {relatedProduct.skus.slice(0, 2).map((sku: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{sku.code}:</span>
                                    <span className="text-xs sm:text-xs md:text-sm font-bold text-wine">
                                      {formatPrice(sku.price)}
                                    </span>
                                    {sku.originalPrice && (
                                      <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                        {formatPrice(sku.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {relatedProduct.skus.length > 2 && (
                                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                                    +{relatedProduct.skus.length - 2} more
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-xs sm:text-xs md:text-sm lg:text-base font-bold text-wine">
                                      {formatPrice(relatedProduct.price)}
                                    </span>
                                    {relatedProduct.originalPrice && (
                                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                        {formatPrice(relatedProduct.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                                    Save {formatPrice(relatedProduct.originalPrice - relatedProduct.price)}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-auto pt-1 flex-shrink-0">
                            {relatedProduct.origin && (
                              <div className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                                {relatedProduct.origin}
                              </div>
                            )}
                            {relatedProduct.alcoholContent && (
                              <span className="text-[10px] sm:text-xs text-gold font-medium">Alc. {relatedProduct.alcoholContent}%</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
              </div>
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
            <div className="flex flex-col gap-0.5">
              {product.skus && product.skus.length > 0 && selectedSku ? (
                (() => {
                  const selectedSkuData = product.skus.find(sku => sku.code === selectedSku);
                  return selectedSkuData ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-semibold text-gray-700">{selectedSkuData.code}:</span>
                      <span className="text-sm font-bold text-wine">{formatPrice(selectedSkuData.price)}</span>
                      {selectedSkuData.originalPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">{formatPrice(selectedSkuData.originalPrice)}</span>
                      )}
                    </div>
                  ) : null;
                })()
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-wine">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
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
