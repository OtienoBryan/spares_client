import { useEffect } from 'react';
import { apiService } from '@/services/api';

const Sitemap = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const baseUrl = window.location.origin;
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Fetch all data
        const [products, categories] = await Promise.all([
          apiService.getProducts().catch(() => []),
          apiService.getCategories().catch(() => [])
        ]);

        // Extract unique brands and origins from products
        const brands = new Set<string>();
        const origins = new Set<string>();
        
        (products || []).forEach((product: any) => {
          if (product.brand) {
            brands.add(product.brand);
          }
          if (product.origin) {
            origins.add(product.origin);
          }
        });

        // Build sitemap XML
        const urls: string[] = [];

        // Static pages - high priority
        urls.push(`  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

        urls.push(`  <url>
    <loc>${baseUrl}/offers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

        urls.push(`  <url>
    <loc>${baseUrl}/featured</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

        urls.push(`  <url>
    <loc>${baseUrl}/brands</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

        urls.push(`  <url>
    <loc>${baseUrl}/origin</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

        urls.push(`  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);

        // Category pages - high priority
        (categories || []).forEach((category: any) => {
          if (category.name) {
            urls.push(`  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(category.name.toLowerCase())}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
          }
        });

        // Brand pages - medium-high priority
        Array.from(brands).forEach((brand) => {
          urls.push(`  <url>
    <loc>${baseUrl}/brands/${encodeURIComponent(brand)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
        });

        // Origin pages - medium-high priority
        Array.from(origins).forEach((origin) => {
          urls.push(`  <url>
    <loc>${baseUrl}/origin/${encodeURIComponent(origin)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
        });

        // Product pages - highest priority
        (products || []).forEach((product: any) => {
          if (product.id && product.isActive !== false) {
            urls.push(`  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
          }
        });

        // Generate XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;

        // Create a response with XML content type
        const response = new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
          },
        });

        // For client-side rendering, we'll use document.write or create a download
        // Since we can't set headers in React, we'll create a downloadable file
        const blob = new Blob([xml], { type: 'application/xml; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sitemap.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        // Fallback to basic sitemap
        const baseUrl = window.location.origin;
        const currentDate = new Date().toISOString().split('T')[0];
        const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/offers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/featured</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/brands</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/origin</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
        const blob = new Blob([fallbackXml], { type: 'application/xml; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sitemap.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    };

    generateSitemap();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Generating Sitemap...</h1>
      <p>Please wait while we generate your sitemap XML file.</p>
    </div>
  );
};

export default Sitemap;
