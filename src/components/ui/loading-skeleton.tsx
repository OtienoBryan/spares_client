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

export default Skeleton;
