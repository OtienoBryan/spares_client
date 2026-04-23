import { Link } from "react-router-dom";

export interface ShopByPartsItem {
  key: string;
  label: string;
  to: string;
  imageSrc: string;
}

interface ShopByPartsSectionProps {
  items: ShopByPartsItem[];
}

export function ShopByPartsSection({ items }: ShopByPartsSectionProps) {
  return (
    <section className="border-b border-border bg-background py-8 sm:py-10 md:py-12" aria-label="Shop by parts">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="mb-6 text-left text-lg font-bold uppercase tracking-wide text-primary sm:mb-8 sm:text-xl md:text-2xl">
          Shop by parts
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6 lg:gap-8">
          {items.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="group flex flex-col items-center text-center touch-manipulation"
              aria-label={`Shop ${item.label}`}
            >
              <div className="flex h-28 w-full items-center justify-center rounded-lg bg-white p-2 shadow-sm ring-1 ring-border/60 transition group-hover:shadow-md group-active:scale-[0.98] sm:h-32 md:h-36">
                <img
                  src={item.imageSrc}
                  alt=""
                  role="presentation"
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder-product.jpg";
                  }}
                />
              </div>
              <span className="mt-2 text-[11px] font-semibold uppercase leading-tight text-foreground sm:text-xs md:text-sm">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
