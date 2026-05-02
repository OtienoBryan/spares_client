import { useState } from "react";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  product: any;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export const ProductGallery = ({ product, selectedImage, setSelectedImage }: ProductGalleryProps) => {
  const [zoomed, setZoomed] = useState(false);

  // Build the full ordered image list:
  // [mainImage, ...secondaryImages sorted by sortOrder]
  const secondaryUrls: string[] = (product.productImages ?? [])
    .slice()
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
    .map((img: any) => img.url)
    .filter(Boolean);

  const allImages: string[] = [
    ...(product.image ? [product.image] : []),
    ...secondaryUrls,
  ];

  // Fallback to legacy product.images JSON if productImages relation absent
  const images: string[] =
    allImages.length > 0
      ? allImages
      : (product.images?.filter(Boolean) ?? [product.image].filter(Boolean));

  const src = images[selectedImage] || "/placeholder-product.jpg";

  const hasDiscount =
    product.originalPrice && product.originalPrice > (product.price || 0);
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleSelect = (i: number) => {
    setSelectedImage(i);
    setZoomed(false);
  };

  return (
    <div className="space-y-3 lg:sticky lg:top-24">
      {/* ── Main image ── */}
      <div
        onClick={() => setZoomed(v => !v)}
        className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center cursor-zoom-in group shadow-sm"
        style={{ minHeight: 340 }}
      >
        {discountPct > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {discountPct}% OFF
          </span>
        )}
        <span className="absolute top-3 right-3 z-10 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
          OEM
        </span>

        <img
          src={src}
          alt={product.name}
          className={`object-contain transition-transform duration-300 select-none px-6 py-6 ${
            zoomed ? "scale-150" : "scale-100 group-hover:scale-[1.04]"
          }`}
          style={{ maxHeight: 420, width: "100%" }}
          loading="eager"
          draggable={false}
        />

        {!zoomed && (
          <div className="absolute bottom-3 right-3 bg-black/25 backdrop-blur-sm text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn className="h-4 w-4" />
          </div>
        )}

        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full pointer-events-none">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ── Thumbnail strip (shown when > 1 image) ── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              className={`relative shrink-0 h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-xl border-2 overflow-hidden bg-white transition-all ${
                selectedImage === i
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              title={i === 0 ? "Main image" : `View ${i}`}
            >
              <img
                src={img}
                alt={`${product.name} view ${i + 1}`}
                className="h-full w-full object-contain p-1.5"
                loading="lazy"
              />
              {/* "Main" label on first thumb */}
              {i === 0 && (
                <span className="absolute bottom-0.5 left-0 right-0 text-center text-[8px] font-bold text-primary/70 leading-none">
                  MAIN
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Secondary images row (shown only when secondary images exist) ── */}
      {secondaryUrls.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            More Views
          </p>
          <div className="grid grid-cols-3 gap-2">
            {secondaryUrls.map((url, i) => {
              const globalIndex = i + 1; // secondary images start at index 1 (after main)
              const isActive = selectedImage === globalIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(globalIndex)}
                  className={`aspect-square rounded-xl border-2 overflow-hidden bg-white transition-all hover:shadow-md ${
                    isActive
                      ? "border-primary ring-2 ring-primary/20 shadow-md"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.name} view ${globalIndex + 1}`}
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-muted-foreground italic">
        * Image for illustration only. Actual part may vary.
      </p>
    </div>
  );
};
