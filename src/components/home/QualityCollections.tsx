import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/data/products";

interface QualityCollectionsProps {
  allProducts: any[];
}

export const QualityCollections = ({ allProducts }: QualityCollectionsProps) => {
  // Helper function to safely filter products by category (legacy fallback)
  const filterProductsByCategory = (products: any[], categoryName: string) => {
    if (!products || !Array.isArray(products)) return [];
    return products.filter(p => 
      p && 
      p.category && 
      (typeof p.category === 'string' 
        ? p.category.toLowerCase().includes(categoryName.toLowerCase())
        : p.category.name?.toLowerCase().includes(categoryName.toLowerCase()))
    );
  };

  const collections = [
    {
      title: "Engine Components",
      description: "OEM pistons, gaskets, valves, and timing kits for peak performance.",
      image: "/engine-parts.jpg",
      products: filterProductsByCategory(allProducts, 'engine').slice(0, 3)
    },
    {
      title: "Suspension & Steering",
      description: "Shock absorbers, control arms, and steering racks for a smooth ride.",
      image: "/suspension-parts.jpg",
      products: filterProductsByCategory(allProducts, 'suspension').slice(0, 3)
    },
    {
      title: "Braking Systems",
      description: "High-performance brake pads, discs, and calipers for maximum safety.",
      image: "/brake-parts.jpg",
      products: filterProductsByCategory(allProducts, 'brake').slice(0, 3)
    }
  ];

  // If no products found for parts categories yet (migration in progress), 
  // fall back to whatever is available but keep the Parts-centric titles.
  const displayCollections = collections.map(col => ({
    ...col,
    products: col.products.length > 0 ? col.products : allProducts.slice(0, 3)
  }));

  return (
    <section className="py-6 sm:py-8 md:py-12 bg-background" aria-label="Quality Spares Collections">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2 sm:mb-3">
            Precision Quality Spares
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Explore our curated collections of genuine automotive components, ensuring your vehicle performs at its best on every journey.
          </p>
          <Button variant="outline" className="mt-2 sm:mt-3 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            View All Collections
            <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {displayCollections.map((section, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div 
                className="h-32 sm:h-40 md:h-44 bg-cover bg-center bg-muted" 
                style={{ backgroundImage: section.image ? `url(${section.image})` : 'none' }}
              >
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
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-muted rounded mx-auto mb-1 sm:mb-2 overflow-hidden flex items-center justify-center">
                         {product.image ? (
                           <img src={product.image} alt="" className="w-full h-full object-contain" />
                         ) : (
                           <span className="text-[10px]">Part</span>
                         )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate leading-tight">{product.name}</p>
                      {product.skus && product.skus.length > 0 ? (
                        <p className="text-[10px] sm:text-xs font-bold text-primary">{formatPrice(product.skus[0].price)}</p>
                      ) : (
                        <p className="text-[10px] sm:text-xs font-bold text-primary">{formatPrice(product.price)}</p>
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
  );
};
