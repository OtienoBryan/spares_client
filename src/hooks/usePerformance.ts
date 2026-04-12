import { useEffect, useState, useRef } from "react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  isSlowConnection: boolean;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    isSlowConnection: false,
  });

  useEffect(() => {
    const startTime = performance.now();

    // Check connection speed
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowConnection = connection ? connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' : false;

    // Monitor memory usage
    const getMemoryUsage = () => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }
      return undefined;
    };

    const measureRenderTime = () => {
      const renderTime = performance.now() - startTime;
      setMetrics(prev => ({
        ...prev,
        loadTime: renderTime,
        renderTime,
        memoryUsage: getMemoryUsage(),
        isSlowConnection,
      }));
    };

    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(measureRenderTime);

    // Monitor performance entries
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          setMetrics(prev => ({
            ...prev,
            loadTime: entry.duration,
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'measure'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  return metrics;
};

export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, hasLoaded]);

  return { ref, isVisible, hasLoaded };
};

export default usePerformance;
