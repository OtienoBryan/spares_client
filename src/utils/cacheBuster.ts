/**
 * Cache busting utility for development
 * Helps prevent browser caching issues during development
 */

// Add timestamp to URLs to prevent caching
export const addCacheBuster = (url: string): string => {
  if (import.meta.env.DEV) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}`;
  }
  return url;
};

// Clear browser cache programmatically (for development)
export const clearBrowserCache = (): void => {
  if (import.meta.env.DEV && 'caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
};

// Force reload with cache clearing
export const forceReload = (): void => {
  if (import.meta.env.DEV) {
    clearBrowserCache();
    window.location.reload();
  }
};

// Add cache-busting to image sources
export const getImageWithCacheBuster = (src: string): string => {
  return addCacheBuster(src);
};
