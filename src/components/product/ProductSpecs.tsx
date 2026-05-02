import { Link } from "react-router-dom";
import { LayoutGrid, Factory } from "lucide-react";

interface ProductSpecsProps {
  product: any;
}

export const ProductSpecs = ({ product }: ProductSpecsProps) => {
  const specs = [
    {
      label: "Category",
      value: product.category?.name || "Automotive Parts",
      icon: LayoutGrid,
      link: `/category/${product.category?.name?.toLowerCase().replace(/\s+/g, "-") || "parts"}`,
    },
    {
      label: "Brand / Manufacturer",
      value: product.brand || "Genuine OEM",
      icon: Factory,
      link: product.brand ? `/brands/${encodeURIComponent(product.brand)}` : null,
    },
  ].filter(s => s.value);

  if (specs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      {specs.map(({ label, value, icon: Icon, link }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
          <div className="shrink-0 h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {link ? (
                <Link to={link} className="hover:text-primary hover:underline underline-offset-2 transition-colors">
                  {value}
                </Link>
              ) : value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
