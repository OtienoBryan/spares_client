import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Development cache busting
if (import.meta.env.DEV) {
  // Clear all caches on development start
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
  
  // Disable service worker in development to prevent caching issues
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }
  
  // Add cache busting to all fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const [url, options = {}] = args;
    if (typeof url === 'string' && url.startsWith('/')) {
      const separator = url.includes('?') ? '&' : '?';
      const cacheBustedUrl = `${url}${separator}_cb=${Date.now()}`;
      return originalFetch(cacheBustedUrl, options);
    }
    return originalFetch(...args);
  };
} else {
  // Register service worker for caching and offline support in production
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
