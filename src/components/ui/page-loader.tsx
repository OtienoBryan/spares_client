import { LoadingGear } from "./lottie-loader";

interface PageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const PageLoader = ({ 
  message = "Calibrating systems...", 
  size = "md" 
}: PageLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <LoadingGear size={size === "lg" ? "xl" : size} className="text-primary" />
      <div className="text-center">
        <p className="text-lg font-bold text-gray-900">{message}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">Precision Parts Kenya</p>
      </div>
    </div>
  );
};

export default PageLoader;
