class ResourcePreloader {
  private preloadedResources = new Set<string>();
  private preloadQueue: string[] = [];

  // Preload critical images
  preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map(url => this.preloadImage(url))
    );
  }

  private preloadImage(url: string): Promise<void> {
    if (this.preloadedResources.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedResources.add(url);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // Preload critical routes
  async preloadRoute(routePath: string): Promise<void> {
    try {
      // Dynamic import to trigger route preloading
      await import(`../pages/${routePath}.tsx`);
    } catch (error) {
      console.warn(`Failed to preload route: ${routePath}`, error);
    }
  }

  // Preload critical routes in background
  preloadCriticalRoutes(): void {
    const criticalRoutes = [
      'Home',
      'Category', 
      'Product',
      'Cart'
    ];

    // Use requestIdleCallback for non-blocking preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        criticalRoutes.forEach(route => {
          this.preloadRoute(route);
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        criticalRoutes.forEach(route => {
          this.preloadRoute(route);
        });
      }, 100);
    }
  }

  // Preload fonts
  preloadFonts(fontUrls: string[]): void {
    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Preload critical API data
  async preloadApiData(apiCalls: (() => Promise<any>)[]): Promise<void> {
    try {
      await Promise.allSettled(apiCalls.map(call => call()));
    } catch (error) {
      console.warn('Failed to preload API data:', error);
    }
  }

  // Get preload status
  isPreloaded(url: string): boolean {
    return this.preloadedResources.has(url);
  }

  // Clear preload cache
  clearCache(): void {
    this.preloadedResources.clear();
    this.preloadQueue = [];
  }
}

export const resourcePreloader = new ResourcePreloader();

// Critical images to preload
export const CRITICAL_IMAGES = [
  '/logo.png',
  '/placeholder.svg',
  // Add other critical images here
];

// Critical routes to preload
export const CRITICAL_ROUTES = [
  'Home',
  'Category',
  'Product',
  'Cart'
];

export default resourcePreloader;
