import { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/product-card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { 
  Clock, 
  Truck, 
  Shield,
  Star,
  Search,
  Loader2,
  ArrowRight,
  Crown,
  Phone,
  MapPin,
  ShoppingCart
} from "lucide-react";
import { useProducts, useFeaturedProducts, useCategories, useSearchProductsDebounced, usePopularWines } from "@/hooks/useApi";
import { getBrandsByCategory, formatPrice, getDiscountPercentage } from "@/data/products";
import { LoadingWave, LoadingWine, LoadingNetworkError } from "@/components/ui/lottie-loader";
import { useNetworkStatus, isNetworkError } from "@/hooks/useNetworkStatus";

// Lazy load heavy components
const LazyProductCard = lazy(() => import("@/components/ui/product-card").then(module => ({ default: module.ProductCard })));

// Optimized image imports with lazy loading
const heroImage = "/hero-drinks.jpg";
const wineImage = "/wine-bottle.jpg";
const beerImage = "/beer-bottles.jpg";
const whiskeyImage = "/whiskey-bottle.jpg";

const Home = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Read search query from URL parameters
  const urlSearchParams = new URLSearchParams(location.search);
  const urlSearchQuery = urlSearchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set(['hero']));
  const { addToCart } = useCart();
  const { isOnline } = useNetworkStatus();
  
  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Memoized helper function to get category images
  const getCategoryImage = useCallback((categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('wine')) return '/cat/wine.png'; // Wine image
    if (name.includes('beer')) return '/cat/beer.png'; // Beer image
    if (name.includes('gin')) return '/cat/gin.png'; // Gin image
    if (name.includes('liqueur')) return '/cat/liq.png'; // Liqueur image
    if (name.includes('rum')) return '/cat/rum.png'; // Rum image
    if (name.includes('tequila')) return '/cat/tequila.png'; // Tequila image
    if (name.includes('vodka')) return '/cat/vodka.png'; // Vodka image
    if (name.includes('vapes')) return '/cat/vapes.png'; // Vodka image
    if (name.includes('whisky')) return '/cat/whiskey.png'; // Whiskey image
    //if (name.includes('spirit') || name.includes('vodka')) return '/slider/1.jpg'; // Spirits image
    if (name.includes('champagne') || name.includes('sparkling')) return '/slider/4.webp'; // Sparkling image
    if (name.includes('cocktail') || name.includes('mixer')) return '/slider/1.jpg'; // Cocktail image
    if (name.includes('convenience') || name.includes('more')) return '/slider/3.jpg'; // Convenience image
    return '/slider/2.webp'; // Default wine image
  }, []);

  // Memoized banner slider images - LCP optimized
  const bannerImages = useMemo(() => [
    {
      image: "/slider/4.webp",
      title: "Premium Drinks Delivery",
      subtitle: "Fast, reliable, and fresh to your doorstep"
    }
  ], []);

  // Priority data fetching - load critical data first
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: featuredProducts, loading: featuredLoading, error: featuredError } = useFeaturedProducts();
  
  // Secondary data - load after critical data
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();
  const { data: popularWines, loading: popularWinesLoading, error: popularWinesError } = usePopularWines();
  
  // Search only when needed
  const { data: searchResults, loading: searchLoading } = useSearchProductsDebounced(
    searchQuery.length > 2 ? searchQuery : '', 
    300
  );

  // Memoized data processing for better performance
  const popularProducts = useMemo(() => 
    (allProducts as any[])?.filter(product => product && product.rating >= 4.5).slice(0, 4) || [],
    [allProducts]
  );
  
  const dealProducts = useMemo(() => 
    (allProducts as any[])?.filter(product => product && product.originalPrice && product.originalPrice > product.price).slice(0, 4) || [],
    [allProducts]
  );
  
  // Helper function to check if product has any offers (from SKUs or general price)
  const hasOffer = useCallback((product: any) => {
    // Check if product has SKUs with discounts
    if (product.skus && product.skus.length > 0) {
      return product.skus.some((sku: any) => 
        sku.originalPrice && sku.originalPrice > sku.price
      );
    }
    // Check general product discount
    return product.originalPrice && product.originalPrice > product.price;
  }, []);

  // Helper function to get best discount percentage from SKUs only
  const getBestDiscountFromSKU = useCallback((product: any) => {
    let maxDiscount = 0;
    
    // Only check SKU discounts
    if (product.skus && product.skus.length > 0) {
      product.skus.forEach((sku: any) => {
        if (sku.originalPrice && sku.originalPrice > sku.price) {
          const discount = ((sku.originalPrice - sku.price) / sku.originalPrice) * 100;
          if (discount > maxDiscount) {
            maxDiscount = discount;
          }
        }
      });
    }
    
    return maxDiscount;
  }, []);

  const offersOfTheWeek = useMemo(() => 
    (allProducts as any[])?.filter(product => 
      product && hasOffer(product)
    ).slice(0, 8) || [],
    [allProducts, hasOffer]
  );
  
  const brandsByCategory = useMemo(() => 
    allProducts ? getBrandsByCategory(allProducts as any[]) : [],
    [allProducts]
  );

  // Get all unique brands from products
  const allBrands = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];
    const brands = new Set<string>();
    (allProducts as any[]).forEach((product: any) => {
      if (product.brand) {
        brands.add(product.brand.toLowerCase());
      }
    });
    return Array.from(brands);
  }, [allProducts]);

  // Check if search query exactly matches a brand name
  const isBrandSearch = useMemo(() => {
    if (!searchQuery) return false;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return allBrands.includes(lowerQuery);
  }, [searchQuery, allBrands]);

  // Filter products by exact brand if it's a brand search
  const brandFilteredProducts = useMemo(() => {
    if (!isBrandSearch || !allProducts) return [];
    const lowerQuery = searchQuery.toLowerCase().trim();
    return (allProducts as any[]).filter((product: any) => 
      product.brand && product.brand.toLowerCase() === lowerQuery
    );
  }, [isBrandSearch, searchQuery, allProducts]);

  // Get the actual brand name (with proper casing) from filtered products
  const brandName = useMemo(() => {
    if (!isBrandSearch || brandFilteredProducts.length === 0) return null;
    return brandFilteredProducts[0]?.brand || searchQuery;
  }, [isBrandSearch, brandFilteredProducts, searchQuery]);

  const displayProducts = useMemo(() => {
    if (!searchQuery) {
      return (featuredProducts as any[])?.slice(0, 4) || [];
    }
    
    // If it's an exact brand match, show all products from that brand
    if (isBrandSearch) {
      return brandFilteredProducts;
    }
    
    // Otherwise, use search results
    return (searchResults as any[]) || [];
  }, [searchQuery, searchResults, featuredProducts, isBrandSearch, brandFilteredProducts]);

  // Memoized helper function to safely filter products by category
  const filterProductsByCategory = useCallback((products: any[], categoryName: string) => {
    if (!products || !Array.isArray(products)) return [];
    return products.filter(p => 
      p && 
      p.category && 
      typeof p.category === 'string' && 
      p.category.toLowerCase().includes(categoryName.toLowerCase())
    );
  }, []);

  // Intersection Observer for lazy loading sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { 
        rootMargin: '50px 0px',
        threshold: 0.1 
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);





  // Image preloading effect
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = [
        // Banner images
        ...bannerImages.map(banner => banner.image),
        // Category images
        '/cat/wine.png',
        '/cat/beer.png',
        '/cat/gin.png',
        '/cat/liq.png',
        '/cat/rum.png',
        '/cat/tequila.png',
        '/cat/vodka.png',
        '/cat/whiskey.png',
        // Product images from featured products
        ...((featuredProducts as any[])?.slice(0, 8).map(product => product.image).filter(Boolean) || []),
        // Product images from offers
        ...((offersOfTheWeek as any[])?.slice(0, 8).map(product => product.image).filter(Boolean) || []),
        // Product images from popular wines
        ...((popularWines as any[])?.slice(0, 8).map(product => product.image).filter(Boolean) || []),
      ];

      const preloadPromises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.allSettled(preloadPromises);
        setImagesPreloaded(true);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        setImagesPreloaded(true); // Still set to true to not block rendering
      }
    };

    if (featuredProducts && offersOfTheWeek && popularWines) {
      preloadImages();
    }
  }, [featuredProducts, offersOfTheWeek, popularWines]);

  // Optimized loading state - only show if critical data is loading
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingWave size="xl" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-wine mb-4">Loading...</h1>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Check for network errors
  const hasNetworkError = !isOnline || 
    isNetworkError(productsError) || 
    isNetworkError(featuredError) || 
    isNetworkError(categoriesError);

  // Show network error state
  if (hasNetworkError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingNetworkError size="xl" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-wine mb-4">Connection Error</h1>
          <p className="text-muted-foreground mb-4">Unable to connect to our servers</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Generate structured data for the website
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Drinks Avenue",
    "description": "Premium drinks and spirits delivery service. Order wine, beer, whiskey, gin, and more with fast delivery.",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Drinks Avenue",
      "url": window.location.origin,
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+254-712-345678",
        "contactType": "customer service"
      }
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Drinks Avenue",
    "description": "Premium drinks and spirits delivery service in Kenya",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-712-345678",
      "contactType": "customer service",
      "availableLanguage": ["English", "Swahili"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressLocality": "Nairobi"
    },
    "sameAs": [
      "https://www.facebook.com/dalalidrinks",
      "https://www.instagram.com/dalalidrinks",
      "https://www.twitter.com/dalalidrinks"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Drinks Avenue - Premium Alcohol Delivery Service | Wine, Beer, Whiskey & More</title>
        <meta name="description" content="Order premium drinks online with fast delivery. Wide selection of wine, beer, whiskey, gin, rum, and spirits. 30-minute delivery available in Kenya." />
        <meta name="keywords" content="alcohol delivery, wine delivery, beer delivery, whiskey delivery, gin delivery, spirits delivery, Kenya, Nairobi, premium drinks, online alcohol store" />
        <meta name="author" content="Drinks Avenue" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.origin} />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.shoppadrinks.com" />
        
        {/* LCP Optimization - Preload hero image for mobile */}
        <link rel="preload" href="/slider/4.webp" as="image" type="image/webp" fetchPriority="high" imageSizes="100vw" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Drinks Avenue - Premium Alcohol Delivery Service" />
        <meta property="og:description" content="Order premium drinks online with fast delivery. Wide selection of wine, beer, whiskey, gin, rum, and spirits. 30-minute delivery available in Kenya." />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Drinks Avenue" />
        <meta property="og:locale" content="en_KE" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Drinks Avenue - Premium Alcohol Delivery Service" />
        <meta name="twitter:description" content="Order premium drinks online with fast delivery. Wide selection of wine, beer, whiskey, gin, rum, and spirits. 30-minute delivery available in Kenya." />
        <meta name="twitter:image" content={`${window.location.origin}/logo.png`} />
        
        {/* Additional SEO Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#013328" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Drinks Avenue" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationData)}
        </script>
      </Helmet>

      {/* Critical CSS for LCP Optimization */}
      <style>{`
        /* Critical styles for hero section */
        .hero-section {
          min-height: 45vh;
          background-color: #f3f4f6;
        }
        
        @media (min-width: 640px) {
          .hero-section {
            min-height: 40vh;
          }
        }
        
        @media (min-width: 768px) {
          .hero-section {
            min-height: 50vh;
          }
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          max-width: 100%;
        }
        
        /* Mobile optimization - ensure image covers properly on small screens */
        @media (max-width: 640px) {
          .hero-image {
            object-position: center center;
            min-height: 100%;
            width: 100vw;
            height: 45vh;
            max-height: 45vh;
          }
          
          .hero-image-container {
            min-height: 45vh;
            max-height: 45vh;
          }
          
          picture {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        
        /* Prevent layout shift */
        .hero-image-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          background-color: #f3f4f6;
        }
        
        /* Optimize image rendering and performance */
        .hero-image {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: optimize-quality;
          backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          .hero-image {
            image-rendering: auto;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-perspective: 1000;
            perspective: 1000;
          }
          
          .hero-image-container {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          picture {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        
        /* Ensure proper image display on all devices */
        picture img {
          display: block;
          max-width: 100%;
          height: auto;
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .hero-image {
            transform: none;
            -webkit-transform: none;
          }
        }
        
        /* Marquee Animation Styles */
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .pause-animation {
          animation-play-state: paused;
        }
        .marquee-step {
          animation: marquee-step 30s steps(1) infinite;
        }
        @keyframes marquee-step {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
      `}</style>
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section - Optimized for LCP and Mobile */}
      <section className="relative bg-gray-100 hero-section" aria-label="Hero Banner">
        <div className="w-full">
          <div className="relative h-[45vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden shadow-2xl hero-image-container">
            <picture>
              {/* Mobile-first: optimized for mobile devices */}
              <source
                media="(max-width: 640px)"
                srcSet="/slider/4.webp"
                type="image/webp"
                sizes="100vw"
              />
              {/* Tablet */}
              <source
                media="(min-width: 641px) and (max-width: 1024px)"
                srcSet="/slider/4.webp"
                type="image/webp"
                sizes="100vw"
              />
              {/* Desktop */}
              <source
                media="(min-width: 1025px)"
                srcSet="/slider/4.webp"
                type="image/webp"
                sizes="100vw"
              />
              {/* Fallback img element with optimized attributes */}
              <img
                src="/slider/4.webp"
                alt="Premium Drinks Delivery - Fast and Reliable"
                className="hero-image"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="1920"
                height="1080"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  willChange: 'auto'
                }}
                onLoad={(e) => {
                  // Ensure image is properly loaded and displayed
                  const img = e.currentTarget;
                  img.style.opacity = '1';
                }}
              />
            </picture>
            {/* Gradient overlay - optimized for mobile visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/5 sm:from-black/40 sm:via-transparent sm:to-black/10 pointer-events-none" />
          </div>
        </div>
      </section>


      {/* All Categories - From Database */}
       <section className="py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10 bg-background hidden" aria-label="Product Categories">
         <div className="container mx-auto px-3 sm:px-4">
          
          {categoriesLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <LoadingWave size="lg" />
              <span className="ml-4 text-sm sm:text-lg text-muted-foreground">Loading categories...</span>
            </div>
          ) : categoriesError ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-destructive text-sm sm:text-base">Error loading categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-1 sm:gap-1 md:gap-2 lg:gap-3">
              {(categories as any[])?.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.name.toLowerCase()}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 bg-gradient-to-br from-primary/5 to-primary/10 touch-manipulation">
                    {/* Category Image Design */}
                    <div className="h-12 sm:h-14 md:h-16 lg:h-18 flex flex-col items-center justify-center relative overflow-hidden p-1">
                      {/* Category Image */}
                      <div className="flex items-center justify-center mb-0">
                        <img
                          src={getCategoryImage(category.name)}
                          alt={`${category.name} - Premium drinks category`}
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover rounded-lg opacity-80"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          width="80"
                          height="80"
                        />
                      </div>
                      
                      {/* Category Info Below Image */}
                      <div className="text-center px-1">
                        <h3 className="text-primary font-bold text-xs leading-tight truncate w-full">{category.name}</h3>
                        <p className="text-primary/70 text-xs hidden xl:block">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Offers of the Week Section */}
      <section 
        id="offers-week"
        data-section="offers-week"
        className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-wine/5 to-primary/5" 
        aria-label="Special Offers"
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              <div className="text-center md:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-wine mb-2 sm:mb-3 md:mb-4">
                  Offers of the Week
                </h2>
                 
              </div>
              <Link to="/offers" className="mt-2 sm:mt-3 md:mt-0">
                <Button size="sm" className="bg-wine hover:bg-wine/90 active:bg-wine/80 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-3 text-xs sm:text-sm md:text-base touch-manipulation">
                  View All Offers
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {(offersOfTheWeek as any[])?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {(offersOfTheWeek as any[])?.map((product) => (
                <div key={product.id} className="relative group">
                  <Link to={`/product/${product.id}`} className="block">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 touch-manipulation cursor-pointer">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 w-full object-contain bg-white"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {/* Discount Badge - Only show if there's a SKU discount */}
                        {getBestDiscountFromSKU(product) > 0 && (
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                            {Math.round(getBestDiscountFromSKU(product))}% OFF
                          </div>
                        )}
                      </div>
                      <CardContent className="p-2 sm:p-2 md:p-3 lg:p-3">
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className="font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm line-clamp-1 group-hover:text-wine transition-colors">
                            {product.name}
                          </h3>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-gold fill-gold"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {product.skus && product.skus.length > 0 ? (
                            <>
                              {product.skus.map((sku, idx) => (
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
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <span className="text-xs sm:text-xs md:text-sm lg:text-base font-bold text-wine">
                                    {formatPrice(product.price)}
                                  </span>
                                  <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                </div>
                              </div>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <div className="text-xs sm:text-sm text-green-600 font-medium">
                                  Save {formatPrice(product.originalPrice - product.price)}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {product.origin && (
                            <div className="text-[10px] sm:text-xs text-muted-foreground">
                              {product.origin}
                            </div>
                          )}
                          {product.alcoholContent && (
                            <span className="text-[10px] sm:text-xs text-gold font-medium">Alc. {product.alcoholContent}%</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No current offers</h3>
              <p className="text-muted-foreground">Check back soon for amazing deals!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section 
        id="featured-products"
        data-section="featured-products"
        className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-wine/5 to-primary/5" 
        aria-label="Featured Products"
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold text-wine mb-1 sm:mb-2 md:mb-3">
                  {isBrandSearch ? `${brandName} Products` : searchQuery ? `Search Results${searchQuery ? ` for "${searchQuery}"` : ''}` : 'Featured Products'}
                </h2>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-sm text-muted-foreground">
                  {isBrandSearch 
                    ? `All products from ${brandName}`
                    : searchQuery 
                      ? `Products matching your search`
                      : 'Discover our handpicked selection of premium drinks'}
                </p>
              </div>
              <Link to="/featured" className="mt-2 sm:mt-0">
                <Button size="sm" className="bg-wine hover:bg-wine/90 active:bg-wine/80 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-3 text-xs sm:text-sm md:text-base touch-manipulation">
                  <span className="hidden sm:inline">View All Featured</span>
                  <span className="sm:hidden">View All</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </div>
          </div>
          {featuredLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-56 sm:h-64 md:h-72 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredError ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
              <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2 sm:mb-3">Unable to load featured products</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                There was an error loading our featured products. Please try again later.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="text-xs sm:text-sm touch-manipulation"
              >
                Try Again
              </Button>
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <Link to={`/product/${product.id}`} className="block">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 touch-manipulation cursor-pointer">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 w-full object-contain bg-white"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {/* Discount Badge - Only show if there's a SKU discount */}
                        {getBestDiscountFromSKU(product) > 0 && (
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                            {Math.round(getBestDiscountFromSKU(product))}% OFF
                          </div>
                        )}
                      </div>
                      <CardContent className="p-2 sm:p-2 md:p-3 lg:p-3">
                        <div className="space-y-1 sm:space-y-2">
                          <h3 className="font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm line-clamp-1 group-hover:text-wine transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 ${
                                    i < Math.floor(product.rating || 0)
                                      ? "text-gold fill-gold"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              ({product.reviewCount || 0})
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {product.skus && product.skus.length > 0 ? (
                              <>
                                {product.skus.map((sku, idx) => (
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
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-xs sm:text-xs md:text-sm lg:text-base font-bold text-wine">
                                      {formatPrice(product.price || 0)}
                                    </span>
                                    {product.originalPrice && (
                                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                        {formatPrice(product.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                                    Save {formatPrice(product.originalPrice - product.price)}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {product.origin && (
                              <div className="text-[10px] sm:text-xs text-muted-foreground">
                                {product.origin}
                              </div>
                            )}
                            {product.alcoholContent && (
                              <span className="text-[10px] sm:text-xs text-gold font-medium">Alc. {product.alcoholContent}%</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⭐</div>
              <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2 sm:mb-3">
                {isBrandSearch ? `No products found for ${brandName}` : searchQuery ? "No products found matching your search." : "No featured products available"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {isBrandSearch 
                  ? `We don't have any products from ${brandName} at the moment.`
                  : searchQuery 
                    ? "Try searching with different keywords or browse our categories."
                    : "Check back soon for our premium selection!"}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    navigate('/');
                  }}
                  className="text-xs sm:text-sm touch-manipulation"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Popular Wines Section */}
      <section className="py-3 sm:py-4 md:py-6 bg-gradient-to-br from-wine/5 to-primary/5" aria-label="Popular Wines">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              <div className="text-center md:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-wine mb-2 sm:mb-3 md:mb-4">
                  Popular Wines
                </h2>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  Discover our finest selection of wines from around the world.
                </p>
              </div>
              <Link to="/category/wine" className="mt-2 sm:mt-3 md:mt-0">
                <Button size="sm" className="bg-wine hover:bg-wine/90 active:bg-wine/80 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 lg:px-8 lg:py-3 text-xs sm:text-sm md:text-base touch-manipulation">
                  View All Wines
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {popularWinesLoading ? (
            <div className="flex gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="w-64 sm:w-72 md:w-80 flex-shrink-0">
                  <Card className="overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-56 sm:h-64 md:h-72 w-full bg-muted"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-8 bg-muted rounded w-full"></div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : popularWinesError ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Failed to load popular wines</p>
            </div>
          ) : popularWines && (popularWines as any[])?.length > 0 ? (
            <>
              {/* Mobile: Static Grid Layout */}
              <div className="block sm:hidden">
                <div className="grid grid-cols-2 gap-3">
                  {((popularWines as any[]) || []).slice(0, 4).map((product) => (
                    <div key={product.id} className="relative group">
                      <Link to={`/product/${product.id}`} className="block">
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 touch-manipulation cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={product.image || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="h-44 sm:h-48 md:h-52 lg:h-56 w-full object-contain bg-white"
                              loading="lazy"
                              decoding="async"
                            />
                            {/* Popular Wine Badge */}
                            <div className="absolute top-1 left-1 bg-purple-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                              POPULAR
                            </div>
                            {/* Discount Badge */}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </div>
                            )}
                          </div>
                          <CardContent className="p-2">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-xs line-clamp-1 group-hover:text-wine transition-colors">
                                {product.name}
                              </h3>
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-2 w-2 ${
                                      i < Math.floor(product.rating || 4.5)
                                        ? "text-gold fill-gold"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({product.reviewCount || 0})
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {product.skus && product.skus.length > 0 ? (
                                <>
                                  {product.skus.map((sku, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      <span className="text-[10px] font-semibold text-gray-700">{sku.code}:</span>
                                      <span className="text-xs font-bold text-wine">
                                        {formatPrice(sku.price)}
                                      </span>
                                      {sku.originalPrice && (
                                        <span className="text-[10px] text-muted-foreground line-through">
                                          {formatPrice(sku.originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-bold text-wine">
                                        {formatPrice(product.price)}
                                      </span>
                                      {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xs text-muted-foreground line-through">
                                          {formatPrice(product.originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="text-xs text-muted-foreground">
                                      Save {formatPrice(product.originalPrice - product.price)}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {product.origin && (
                                <div className="text-[10px] text-muted-foreground">
                                  {product.origin}
                                </div>
                              )}
                              {product.alcoholContent && (
                                <span className="text-[10px] text-gold font-medium">Alc. {product.alcoholContent}%</span>
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

              {/* Desktop: Grid Layout */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                  {(popularWines as any[])?.map((product) => (
                    <div key={product.id} className="relative group">
                      <Link to={`/product/${product.id}`} className="block">
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 border-0 touch-manipulation cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={product.image || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 w-full object-contain bg-white"
                              loading="lazy"
                              decoding="async"
                            />
                            {/* Popular Wine Badge */}
                            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-purple-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                              POPULAR
                            </div>
                            {/* Discount Badge */}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </div>
                            )}
                          </div>
                          <CardContent className="p-2 sm:p-2 md:p-3 lg:p-3">
                            <div className="space-y-1 sm:space-y-2">
                              <h3 className="font-semibold text-[10px] sm:text-xs md:text-xs lg:text-sm line-clamp-1 group-hover:text-wine transition-colors">
                                {product.name}
                              </h3>
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 ${
                                      i < Math.floor(product.rating || 4.5)
                                        ? "text-gold fill-gold"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                ({product.reviewCount || 0})
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {product.skus && product.skus.length > 0 ? (
                                <>
                                  {product.skus.map((sku, idx) => (
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
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <span className="text-xs sm:text-xs md:text-sm lg:text-base font-bold text-wine">
                                        {formatPrice(product.price)}
                                      </span>
                                      {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                          {formatPrice(product.originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="text-xs sm:text-sm text-green-600 font-medium">
                                      Save {formatPrice(product.originalPrice - product.price)}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {product.origin && (
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                  {product.origin}
                                </div>
                              )}
                              {product.alcoholContent && (
                                <span className="text-[10px] sm:text-xs text-gold font-medium">Alc. {product.alcoholContent}%</span>
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
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No popular wines available</p>
            </div>
          )}
        </div>
      </section>

      {/* Made for More Section */}
      <section className="py-6 sm:py-8 md:py-12 bg-background" aria-label="Premium Collections">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-wine mb-2 sm:mb-3">
              Made for More
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Explore the infinite versatility of premium spirits, and experience how any drink or occasion becomes 'more' with our selection.
            </p>
            <Button variant="outline" className="mt-2 sm:mt-3 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
              View all
              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
              </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                title: "Premium Spirits",
                description: "Discover our collection of premium spirits from around the world",
                image: whiskeyImage,
                products: filterProductsByCategory((allProducts as any[]) || [], 'spirit').slice(0, 3)
              },
              {
                title: "Fine Wines",
                description: "Curated selection of wines for every occasion",
                image: wineImage,
                products: filterProductsByCategory((allProducts as any[]) || [], 'wine').slice(0, 3)
              },
              {
                title: "Craft Beers",
                description: "Local and international craft beers",
                image: beerImage,
                products: filterProductsByCategory((allProducts as any[]) || [], 'beer').slice(0, 3)
              }
            ].map((section, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-32 sm:h-40 md:h-44 bg-cover bg-center" style={{ backgroundImage: `url(${section.image})` }}>
                  <div className="h-full bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white px-2">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">{section.title}</h3>
                      <p className="text-xs sm:text-sm opacity-90 leading-tight">{section.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {section.products.map((product) => (
                      <div key={product.id} className="text-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-muted rounded mx-auto mb-1 sm:mb-2"></div>
                        <p className="text-xs text-muted-foreground truncate leading-tight">{product.name}</p>
                        {product.skus && product.skus.length > 0 ? (
                          <div className="space-y-0.5">
                            {product.skus.map((sku, idx) => (
                              <div key={idx}>
                                <p className="text-[10px] font-semibold text-gray-700">{sku.code}</p>
                                <p className="text-xs font-bold text-wine">{formatPrice(sku.price)}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-wine">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Beers Section */}
      <section className="py-16 bg-background" aria-label="Best Selling Beers">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-wine mb-4">
              Best Selling Beers
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our wide range of craft beers, lagers, pilsners and stouts.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: "Craft Beer", icon: "🍺" },
              { name: "Lager", icon: "🍺" },
              { name: "Pilsner", icon: "🍺" },
              { name: "Stout", icon: "🍺" }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
                className="group"
              >
                <Card className="p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-wine text-sm">{category.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filterProductsByCategory((allProducts as any[]) || [], 'beer').slice(0, 8).map((product) => (
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
              </Suspense>
            ))}
          </div>
        </div>
      </section>


      {/* Footer CTA */}
      <section className="py-8 sm:py-12 md:py-16 bg-wine text-white" aria-label="Call to Action">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Order?
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Get your favorite drinks delivered in under 30 minutes. Fast, reliable, and always fresh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-wine hover:bg-white/90 text-sm sm:text-base">
              <Phone className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Call Us: +254 (712) 345678
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-wine text-sm sm:text-base">
              <MapPin className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              View Locations
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
});

Home.displayName = 'Home';

export default Home;