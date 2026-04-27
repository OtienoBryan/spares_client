import React from "react";
import { LucideIcon } from "lucide-react";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  lottieData?: any;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon: Icon,
  lottieData,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4", className)}>
      <div className="mb-6 flex justify-center">
        {lottieData ? (
          <div className="w-48 h-48 sm:w-64 sm:h-64">
            <Lottie animationData={lottieData} loop={true} />
          </div>
        ) : Icon ? (
          <div className="p-4 rounded-full bg-muted/50">
            <Icon className="w-12 h-12 text-muted-foreground" />
          </div>
        ) : null}
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="min-w-[140px]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
