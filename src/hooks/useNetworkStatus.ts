import { useState, useEffect } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType?: string;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: undefined
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine;
      
      // Check connection speed if available
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      const isSlowConnection = connection ? 
        (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') : 
        false;
      
      const connectionType = connection ? connection.effectiveType : undefined;

      setNetworkStatus({
        isOnline,
        isSlowConnection,
        connectionType
      });
    };

    // Initial check
    updateNetworkStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Listen for connection changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}

// Helper function to check if an error is network-related
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorName = error.name?.toLowerCase() || '';
  
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('failed to fetch') ||
    errorName.includes('network') ||
    errorName.includes('timeout') ||
    error.code === 'NETWORK_ERROR' ||
    error.code === 'TIMEOUT'
  );
}

