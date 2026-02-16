import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { clearBrowserCache, forceReload } from '@/utils/cacheBuster';

/**
 * Development tools component for cache management
 * Only shows in development mode
 */
export const DevTools = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const handleClearCache = async () => {
    // Clear all types of cache
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    }
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear IndexedDB
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases();
        await Promise.all(databases.map(db => {
          return new Promise((resolve, reject) => {
            const deleteReq = indexedDB.deleteDatabase(db.name!);
            deleteReq.onsuccess = () => resolve(true);
            deleteReq.onerror = () => reject(deleteReq.error);
          });
        }));
      } catch (e) {
        console.log('IndexedDB clear failed:', e);
      }
    }
    
    alert('All caches cleared! Refresh the page to see changes.');
  };

  const handleForceReload = () => {
    forceReload();
  };

  const handleNuclearOption = () => {
    // Nuclear option - clear everything and reload
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => caches.delete(cacheName));
      });
    }
    
    localStorage.clear();
    sessionStorage.clear();
    
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    
    // Force reload with cache bypass
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white/90 text-black hover:bg-white"
        >
          Dev Tools
        </Button>
      ) : (
        <div className="bg-white/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg space-y-2 min-w-[200px]">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-800">Dev Tools</h3>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              aria-label="Close dev tools"
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={handleClearCache}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              Clear All Cache
            </Button>
            
            <Button
              onClick={handleForceReload}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              Force Reload
            </Button>
            
            <Button
              onClick={handleNuclearOption}
              size="sm"
              variant="destructive"
              className="w-full text-xs"
            >
              Nuclear Option
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              Normal Reload
            </Button>
          </div>
          
          <div className="text-xs text-gray-600 pt-2 border-t">
            <p>Use these tools when changes don't appear after refresh.</p>
          </div>
        </div>
      )}
    </div>
  );
};
