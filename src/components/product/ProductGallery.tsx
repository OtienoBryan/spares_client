interface ProductGalleryProps {
  product: any;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export const ProductGallery = ({ product, selectedImage, setSelectedImage }: ProductGalleryProps) => {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div>
      <div className="bg-white border rounded-xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[520px]">
        <img
          src={images[selectedImage] || '/placeholder-product.jpg'}
          alt={product.name}
          className="max-h-[340px] sm:max-h-[420px] lg:max-h-[520px] w-auto object-contain"
          loading="eager"
        />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground text-center italic">
        * Image for illustration purposes only. Actual part may vary.
      </p>

      {images.length > 1 && (
        <div className="mt-3 sm:mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.slice(0, 5).map((image: string, index: number) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                selectedImage === index ? "border-primary" : "border-muted"
              }`}
              type="button"
            >
              <img
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className="h-full w-full object-contain bg-white"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
