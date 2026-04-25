import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { productSlug } from "@/lib/utils";
import {
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_TAGLINE,
  CONTACT_PHONE_DISPLAY,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
} from "@/config/site";

interface HomeSeoProps {
  featuredProducts: any[];
}

export const HomeSeo = ({ featuredProducts }: HomeSeoProps) => {
  const siteUrl = useMemo(() => {
    const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();
    if (configuredUrl) {
      return configuredUrl.replace(/\/+$/, '');
    }
    return typeof window !== 'undefined' ? window.location.origin.replace(/\/+$/, '') : '';
  }, []);

  const canonicalUrl = `${siteUrl}/`;

  // Generate enhanced structured data for the website
  const structuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE_DEFAULT_TITLE,
      "alternateName": COMPANY_SHORT_NAME,
      "description": SITE_DEFAULT_DESCRIPTION,
      "url": canonicalUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${canonicalUrl}?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": COMPANY_NAME,
        "url": canonicalUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/icon.svg`,
          "width": 512,
          "height": 512
        }
      },
      "inLanguage": "en-KE",
      "isAccessibleForFree": true
    };
  }, [canonicalUrl, siteUrl]);

  const organizationData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": COMPANY_NAME,
      "legalName": COMPANY_NAME,
      "description": COMPANY_TAGLINE,
      "url": canonicalUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/icon.svg`,
        "width": 512,
        "height": 512
      },
      "image": `${siteUrl}/icon.svg`,
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": CONTACT_PHONE_DISPLAY,
          "contactType": "customer service",
          "availableLanguage": ["English", "Swahili"],
          "areaServed": "KE",
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "09:00",
            "closes": "21:00"
          }
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KE",
        "addressLocality": "Nairobi",
        "addressRegion": "Nairobi County"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Kenya"
      },
      "knowsAbout": [
        "Automotive spare parts",
        "OEM parts",
        "Car parts Kenya",
        "Auto parts Nairobi",
        "Genuine spares"
      ]
    };
  }, [canonicalUrl, siteUrl]);

  const localBusinessData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "AutoPartsStore",
      "name": COMPANY_NAME,
      "url": canonicalUrl,
      "image": `${siteUrl}/icon.svg`,
      "telephone": CONTACT_PHONE_DISPLAY,
      "priceRange": "$$",
      "areaServed": "Kenya",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KE",
        "addressLocality": "Nairobi",
      }
    };
  }, [canonicalUrl, siteUrl]);

  const featuredProductsStructuredData = useMemo(() => {
    if (!featuredProducts || featuredProducts.length === 0) return null;
    
    const products = featuredProducts.slice(0, 12);
    
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Featured Spare Parts — ${COMPANY_NAME}`,
      "description": `Handpicked automotive spares and OEM parts from ${COMPANY_NAME}`,
      "numberOfItems": products.length,
      "itemListElement": products.map((product, index) => {
        const categoryName = typeof product.category === 'object'
          ? (product.category?.name || 'Automotive Parts')
          : (product.category || 'Automotive Parts');

        const images = product.images && product.images.length > 0
          ? product.images.filter(Boolean)
          : (product.image ? [product.image] : []);

        const productUrl = `${siteUrl}/product/${productSlug(product)}`;
        const productSchema: any = {
          "@type": "Product",
          "@id": productUrl,
          "name": product.name,
          "url": productUrl,
          "description": product.description || `${product.name} — ${categoryName} from ${COMPANY_NAME}. Fast delivery in Kenya.`,
          ...(images.length > 0 && { "image": images }),
          "brand": {
            "@type": "Brand",
            "name": product.brand || COMPANY_NAME
          },
          "category": categoryName,
          "sku": product.id?.toString() || "",
          "offers": {
            "@type": "Offer",
            "price": (product.price ?? 0).toString(),
            "priceCurrency": "KES",
            "availability": (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "url": productUrl,
            "seller": {
              "@type": "Organization",
              "name": COMPANY_NAME
            }
          }
        };

        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": productSchema
        };
      })
    };
  }, [featuredProducts, siteUrl]);

  const faqStructuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How fast is delivery for spare parts in Kenya?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${COMPANY_NAME} delivers spare parts as quickly as possible across Nairobi and Kenya. We offer same-day delivery options for most parts within Nairobi.`
          }
        },
        {
          "@type": "Question",
          "name": "Do you sell genuine OEM parts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we prioritize quality OEM and genuine spare parts. We specify brands and technical specifications for every part in our inventory."
          }
        },
        {
          "@type": "Question",
          "name": "Can I verify parts by SKU or part number?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. You can search by part name or brand, or message us on WhatsApp with your specific part number for verification."
          }
        }
      ]
    };
  }, []);

  return (
    <Helmet>
      <title>{SITE_DEFAULT_TITLE}</title>
      <meta name="description" content={SITE_DEFAULT_DESCRIPTION} />
      <meta name="keywords" content={`auto parts Kenya, spare parts Nairobi, car parts, OEM parts, genuine parts, ${COMPANY_SHORT_NAME}, WhatsApp parts order, car maintenance`} />
      <meta name="author" content={COMPANY_NAME} />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="KE" />
      <meta name="geo.placename" content="Nairobi" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={SITE_DEFAULT_TITLE} />
      <meta property="og:description" content={SITE_DEFAULT_DESCRIPTION} />
      <meta property="og:image" content={`${siteUrl}/icon.svg`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={COMPANY_NAME} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={import.meta.env.VITE_TWITTER_HANDLE?.trim() || ""} />
      <meta name="twitter:title" content={SITE_DEFAULT_TITLE} />
      <meta name="twitter:description" content={SITE_DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={`${siteUrl}/icon.svg`} />
      
      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(organizationData)}</script>
      <script type="application/ld+json">{JSON.stringify(localBusinessData)}</script>
      {featuredProductsStructuredData && (
        <script type="application/ld+json">{JSON.stringify(featuredProductsStructuredData)}</script>
      )}
      <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
    </Helmet>
  );
};
