import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { productSlug } from "@/lib/utils";
import { COMPANY_NAME } from "@/config/site";

interface CategorySeoProps {
  categoryDisplayName: string;
  categorySlug: string | undefined;
  products: any[];
}

export const CategorySeo = ({ categoryDisplayName, categorySlug, products }: CategorySeoProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const categoryStructuredData = useMemo(() => {
    const categoryUrl = `${baseUrl}/category/${categorySlug?.toLowerCase()}`;
    
    const productSchemas = products.slice(0, 20).map((product, index) => {
      const productImages = product.images && product.images.length > 0
        ? product.images.filter(Boolean)
        : (product.image ? [product.image] : []);

      const productUrl = `${baseUrl}/product/${productSlug(product)}`;
      return {
        "@type": "Product",
        "@id": productUrl,
        "name": product.name,
        "url": productUrl,
        "description": product.description || `${product.name} - Quality ${categoryDisplayName.toLowerCase()} spare component. Genuine parts available at ${COMPANY_NAME}.`,
        ...(productImages.length > 0 && { "image": productImages }),
        "brand": {
          "@type": "Brand",
          "name": product.brand || COMPANY_NAME
        },
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
        },
        "category": categoryDisplayName
      };
    });

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${categoryDisplayName} - Genuine Spare Parts | ${COMPANY_NAME}`,
      "description": `Browse our collection of ${categoryDisplayName.toLowerCase()}. ${products.length} quality spare parts available with fast delivery across Kenya. Shop automotive components online at ${COMPANY_NAME}.`,
      "url": categoryUrl,
      "mainEntity": {
        "@type": "ItemList",
        "name": `${categoryDisplayName} Spare Parts Collection`,
        "numberOfItems": products.length,
        "itemListElement": productSchemas.map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": product
        }))
      },
      "publisher": {
        "@type": "Organization",
        "name": COMPANY_NAME,
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      }
    };
  }, [categoryDisplayName, products, categorySlug, baseUrl]);

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
          "name": categoryDisplayName,
          "item": `${baseUrl}/category/${categorySlug?.toLowerCase()}`
        }
      ]
    };
  }, [categoryDisplayName, categorySlug, baseUrl]);

  return (
    <Helmet>
      <title>{`${categoryDisplayName} - Genuine Spare Parts | ${COMPANY_NAME}`}</title>
      <meta name="description" content={`Browse our collection of ${categoryDisplayName.toLowerCase()}. ${products.length} quality spare parts available at ${COMPANY_NAME} Kenya. Genuine automotive components with fast delivery in Nairobi and across Kenya.`} />
      <meta name="keywords" content={`${categoryDisplayName.toLowerCase()}, ${categoryDisplayName.toLowerCase()} Kenya, spare parts Nairobi, genuine car parts, automotive components, ${COMPANY_NAME}, car maintenance Kenya`} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={`${baseUrl}/category/${categorySlug?.toLowerCase()}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={`${categoryDisplayName} - Genuine Spare Parts | ${COMPANY_NAME}`} />
      <meta property="og:description" content={`Explore our range of ${categoryDisplayName.toLowerCase()} at ${COMPANY_NAME}. Quality spare parts for your vehicle with fast delivery.`} />
      <meta property="og:image" content={`${baseUrl}/logo.png`} />
      <meta property="og:url" content={`${baseUrl}/category/${categorySlug?.toLowerCase()}`} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${categoryDisplayName} - Genuine Spare Parts | ${COMPANY_NAME}`} />
      
      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(categoryStructuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
    </Helmet>
  );
};
