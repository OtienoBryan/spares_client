import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "avatar" | "button";
}

export const Skeleton = ({ className, variant = "default" }: SkeletonProps) => {
  const variants = {
    default: "h-4 w-full",
    card: "h-48 w-full",
    text: "h-4 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
  };

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        variants[variant],
        className
      )}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-4">
    <Skeleton variant="card" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton variant="button" />
  </div>
);

export const CategorySkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/4" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const HomePageSkeleton = () => (
  <div className="space-y-8">
    {/* Hero Section Skeleton */}
    <div className="relative h-96 bg-muted rounded-lg animate-pulse" />
    
    {/* Categories Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton variant="avatar" className="mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* Featured Products Skeleton */}
    <CategorySkeleton />
  </div>
);

export const ProductPageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span>/</span>
        <Skeleton className="h-4 w-24" />
        <span>/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {/* Image Skeleton */}
        <div className="space-y-2 sm:space-y-3">
          <Skeleton className="aspect-square w-full max-w-[400px] mx-auto rounded-lg" />
          <div className="grid grid-cols-4 sm:grid-cols-3 gap-1 sm:gap-2 max-w-[280px] md:max-w-[320px] mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-6 sm:mt-8 md:mt-12 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  </div>
);

export const OrdersSkeleton = () => (
  <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-10 w-36" />
    </div>
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 flex justify-between items-start animate-pulse bg-white/50">
          <div className="space-y-3 flex-1">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-muted rounded" />
              <div className="h-10 w-32 bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <div className="h-6 w-20 bg-muted rounded ml-auto" />
            <div className="h-8 w-24 bg-muted rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
