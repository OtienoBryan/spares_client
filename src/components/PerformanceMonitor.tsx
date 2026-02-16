import { useEffect, useState } from "react";
import { usePerformance } from "@/hooks/usePerformance";

interface PerformanceMonitorProps {
  showMetrics?: boolean;
}

export const PerformanceMonitor = ({ showMetrics = false }: PerformanceMonitorProps) => {
  const metrics = usePerformance();
  const [isVisible, setIsVisible] = useState(showMetrics);

  useEffect(() => {
    // Show performance warning for slow connections
    if (metrics.isSlowConnection) {
      console.warn('Slow connection detected. Consider enabling performance optimizations.');
    }

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }
  }, [metrics]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Load Time: {metrics.loadTime.toFixed(2)}ms</div>
        <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
        {metrics.memoryUsage && (
          <div>Memory: {metrics.memoryUsage.toFixed(2)}MB</div>
        )}
        <div>Slow Connection: {metrics.isSlowConnection ? 'Yes' : 'No'}</div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-white/60 hover:text-white"
      >
        ×
      </button>
    </div>
  );
};

export default PerformanceMonitor;
