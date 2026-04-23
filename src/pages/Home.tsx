import { useState, useEffect, useMemo, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useProducts, useFeaturedProducts, useCategories, useSearchProductsDebounced, usePopularParts } from "@/hooks/useApi";
import { LoadingWave, LoadingNetworkError } from "@/components/ui/lottie-loader";
import { useNetworkStatus, isNetworkError } from "@/hooks/useNetworkStatus";
import { HeroWithFinder } from "@/components/home/HeroWithFinder";
import { SystemDiscovery } from "@/components/home/SystemDiscovery";
import { HomeSeo } from "@/components/home/HomeSeo";
import { OffersSection } from "@/components/home/OffersSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { PopularSparesSection } from "@/components/home/PopularSparesSection";
import { QualityCollections } from "@/components/home/QualityCollections";
import { ContactCta } from "@/components/home/ContactCta";
import {
  COMPANY_NAME,
} from "@/config/site";
import { WHATSAPP_ORDER_NUMBER } from "@/lib/whatsapp";
import type { Category } from "@/services/api";

const Home = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Read search query from URL parameters
  const urlSearchParams = new URLSearchParams(location.search);
  const urlSearchQuery = urlSearchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const { addToCart } = useCart();
  const { isOnline } = useNetworkStatus();
  
  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Data fetching
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: featuredProducts, loading: featuredLoading, error: featuredError } = useFeaturedProducts();
  const { data: allProducts, error: productsError } = useProducts();
  const { data: popularParts, loading: popularPartsLoading, error: popularPartsError } = usePopularParts();
  
  // Search logic
  const { data: searchResults } = useSearchProductsDebounced(
    searchQuery.length > 2 ? searchQuery : '', 
    300
  );

  // Offers filtration
  const offersOfTheWeek = useMemo(() => 
    (allProducts as any[])?.filter(product => 
      product && (product.isOnOffer === 1 || product.isOnOffer === "1" || product.isOnOffer === true)
    ).slice(0, 12) || [],
    [allProducts]
  );
  
  // Brand search detection
  const allBrands = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];
    const brands = new Set<string>();
    (allProducts as any[]).forEach((product: any) => {
      if (product.brand) brands.add(product.brand.toLowerCase());
    });
    return Array.from(brands);
  }, [allProducts]);

  const isBrandSearch = useMemo(() => {
    if (!searchQuery) return false;
    return allBrands.includes(searchQuery.toLowerCase().trim());
  }, [searchQuery, allBrands]);

  const displayProducts = useMemo(() => {
    if (!searchQuery) return (featuredProducts as any[])?.slice(0, 12) || [];
    if (isBrandSearch) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      return (allProducts as any[]).filter((p: any) => 
        p.brand && p.brand.toLowerCase() === lowerQuery
      ).slice(0, 12);
    }
    return (searchResults as any[])?.slice(0, 12) || [];
  }, [searchQuery, searchResults, featuredProducts, isBrandSearch, allProducts]);

  const brandName = useMemo(() => {
    if (!isBrandSearch) return null;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return (allProducts as any[])?.find((p: any) => p.brand?.toLowerCase() === lowerQuery)?.brand || searchQuery;
  }, [isBrandSearch, searchQuery, allProducts]);

  // Loading and Error states
  if (categoriesLoading && !categories) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingWave size="xl" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-4">Calibrating Systems...</h1>
        </div>
      </div>
    );
  }

  const hasNetworkError = !isOnline || 
    isNetworkError(productsError) || 
    isNetworkError(featuredError) || 
    isNetworkError(categoriesError);

  if (hasNetworkError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingNetworkError size="xl" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-4">Connection Error</h1>
          <p className="text-muted-foreground mb-4">Unable to connect to Precision Parts servers.</p>
          <button onClick={() => window.location.reload()} className="bg-primary text-white px-6 py-2 rounded-lg">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeSeo featuredProducts={featuredProducts || []} />
      
      <Navigation />

      <HeroWithFinder
        companyName={COMPANY_NAME}
        title="Genuine Parts. Precision Fit."
        subtitle="OEM-quality spares — search, order by phone, or checkout online."
        imageSrc="/hero-parts.png"
        imageAlt="Precision Parts Kenya - Automotive Spares"
        whatsappNumber={WHATSAPP_ORDER_NUMBER}
      />

      <SystemDiscovery />

      <OffersSection 
        products={offersOfTheWeek} 
        addToCart={addToCart} 
      />

      <FeaturedSection 
        products={displayProducts} 
        addToCart={addToCart}
        loading={featuredLoading}
        error={featuredError}
        isBrandSearch={isBrandSearch}
        brandName={brandName}
        searchQuery={searchQuery}
        onClearSearch={() => {
          setSearchQuery("");
          navigate('/');
        }}
      />

      <PopularSparesSection 
        products={popularParts || []} 
        addToCart={addToCart}
        loading={popularPartsLoading}
        error={popularPartsError}
      />

      <QualityCollections allProducts={allProducts || []} />

      <ContactCta />

      <Footer />
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
