import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { productSlug } from "@/lib/utils";
import { formatPrice } from "@/data/products";
import { COMPANY_NAME, SITE_DEFAULT_TITLE } from "@/config/site";

interface ProductSeoProps {
  product: any;
}

export const ProductSeo = ({ product }: ProductSeoProps) => {
  const baseUrl = (import.meta.env.VITE_SITE_URL?.trim() ||
    (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/+$/, "");
  const productUrl = `${baseUrl}/product/${productSlug(product)}`;
  
  const categoryName = typeof product.category === 'object'
    ? (product.category?.name || 'Automotive Parts')
    : (product.category || 'Automotive Parts');

  const productImages = product.images && product.images.length > 0
    ? product.images.filter(Boolean)
    : (product.image ? [product.image] : []);

  const structuredData = useMemo(() => {
    const productSchema: any = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": productUrl,
      "name": product.name,
      "description": product.description || `${product.name} - Quality ${categoryName.toLowerCase()} spare component for your vehicle. Genuine ${product.brand || 'parts'} available at ${COMPANY_NAME}. Fast delivery across Kenya.`,
      ...(productImages.length > 0 && { "image": productImages }),
      "brand": {
        "@type": "Brand",
        "name": product.brand || COMPANY_NAME
      },
      "category": categoryName,
      "sku": product.id?.toString() || "",
      "url": productUrl,
      "offers": {
        "@type": "Offer",
        "price": (product.price ?? 0).toString(),
        "priceCurrency": "KES",
        "availability": (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": productUrl,
        "seller": {
          "@type": "Organization",
          "name": COMPANY_NAME,
          "url": baseUrl
        }
      }
    };

    if (product.rating) {
      productSchema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1,
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    return productSchema;
  }, [product, productUrl, categoryName, productImages, baseUrl]);

  const breadcrumbStructuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryName,
          "item": `${baseUrl}/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": productUrl
        }
      ]
    };
  }, [product, categoryName, productUrl, baseUrl]);

  const faqStructuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Is this part compatible with my vehicle?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `This ${product.name} is a high-quality component. We recommend verifying fitment by contacting us on WhatsApp with your vehicle VIN or part number before ordering.`
          }
        },
        {
          "@type": "Question",
          "name": `How long does delivery take for spare parts?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${COMPANY_NAME} offers fast delivery across Nairobi and Kenya. Most parts are delivered within 24 hours depending on your location.`
          }
        }
      ]
    };
  }, [product]);

  return (
    <Helmet>
      <title>{`${product.name} - ${product.brand || 'Genuine Part'} | ${COMPANY_NAME}`}</title>
      <meta name="description" content={`Buy ${product.name} by ${product.brand || 'OEM'} online at ${COMPANY_NAME} Kenya. Genuine ${categoryName.toLowerCase()} available for your vehicle. Fast delivery in Nairobi and across Kenya.`} />
      <meta name="keywords" content={`${product.name}, ${product.brand}, ${categoryName}, spare parts Kenya, car parts Nairobi, genuine auto parts, ${COMPANY_NAME}`} />
      <meta property="og:title" content={`${product.name} | ${COMPANY_NAME}`} />
      <meta property="og:description" content={`Get genuine ${product.name} at ${COMPANY_NAME}. Fast delivery and guaranteed quality for your automotive needs.`} />
      <meta property="og:image" content={productImages[0] || `${baseUrl}/icon.svg`} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:type" content="product" />
      
      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
    </Helmet>
  );
};
