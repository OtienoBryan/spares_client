import { Link } from "react-router-dom";
import { LayoutGrid, Building2, Droplet, MapPin, Settings, Factory } from "lucide-react";

interface ProductSpecsProps {
  product: any;
}

export const ProductSpecs = ({ product }: ProductSpecsProps) => {
  const specs = [
    {
      label: "Category",
      value: product.category?.name || "Automotive Parts",
      icon: <LayoutGrid className="h-4 w-4 text-muted-foreground" />,
      link: `/category/${product.category?.name?.toLowerCase().replace(/\s+/g, '-') || 'products'}`
    },
    {
      label: "Manufacturer",
      value: product.brand || "Authentic OEM",
      icon: <Factory className="h-4 w-4 text-muted-foreground" />,
      link: product.brand ? `/brands/${encodeURIComponent(product.brand)}` : null
    },
    {
      label: "Specifications",
      value: product.specifications || "Authentic OEM",
      icon: <Settings className="h-4 w-4 text-muted-foreground" />,
      link: null
    },
    {
      label: "Dimensions",
      value: product.dimensions || "Standard Fit",
      icon: <Droplet className="h-4 w-4 text-muted-foreground" />,
      link: null
    },
    {
      label: "Origin",
      value: product.origin || "Global",
      icon: <MapPin className="h-4 w-4 text-muted-foreground" />,
      link: product.origin ? `/origin/${encodeURIComponent(product.origin)}` : null
    }
  ];

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-3 text-sm">
      {specs.map((spec, index) => (
        <div key={index} className="min-w-0 rounded-xl border bg-white p-3">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
              {spec.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-muted-foreground">{spec.label}</div>
              <div className="font-semibold text-gray-900 truncate">
                {spec.link ? (
                  <Link to={spec.link} className="hover:text-primary hover:underline underline-offset-2">
                    {spec.value}
                  </Link>
                ) : (
                  spec.value
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
