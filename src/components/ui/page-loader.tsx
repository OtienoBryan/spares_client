import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const PageLoader = ({ 
  message = "Loading...", 
  size = "md" 
}: PageLoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default PageLoader;
