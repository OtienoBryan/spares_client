import { Suspense, lazy, ComponentType } from "react";
import { PageLoader } from "@/components/ui/page-loader";
import { HomePageSkeleton } from "@/components/ui/loading-skeleton";

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  message?: string;
}

export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallbackMessage?: string,
  useSkeleton?: boolean
) => {
  const LazyComponent = lazy(importFunc);
  
  const fallback = useSkeleton ? <HomePageSkeleton /> : <PageLoader message={fallbackMessage} />;
  
  return (props: P) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const LazyWrapper: React.FC<LazyWrapperProps & { children: React.ReactNode }> = ({ 
  children, 
  fallback,
  message = "Loading page..." 
}) => {
  return (
    <Suspense fallback={fallback || <PageLoader message={message} />}>
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
