/**
 * Development Cache Clearer
 * Run this script in browser console for immediate cache clearing
 * Usage: Copy and paste this entire script into browser console
 */

(function() {
  'use strict';
  
  console.log('🧹 Starting aggressive cache clearing...');
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      console.log('📦 Found caches:', cacheNames);
      return Promise.all(cacheNames.map(cacheName => {
        console.log('🗑️ Deleting cache:', cacheName);
        return caches.delete(cacheName);
      }));
    }).then(() => {
      console.log('✅ All caches cleared');
    }).catch(err => {
      console.error('❌ Cache clearing failed:', err);
    });
  }
  
  // Clear localStorage
  try {
    localStorage.clear();
    console.log('✅ localStorage cleared');
  } catch (e) {
    console.error('❌ localStorage clear failed:', e);
  }
  
  // Clear sessionStorage
  try {
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
  } catch (e) {
    console.error('❌ sessionStorage clear failed:', e);
  }
  
  // Clear IndexedDB
  if ('indexedDB' in window) {
    indexedDB.databases().then(databases => {
      console.log('🗄️ Found IndexedDB databases:', databases.map(db => db.name));
      return Promise.all(databases.map(db => {
        return new Promise((resolve, reject) => {
          const deleteReq = indexedDB.deleteDatabase(db.name);
          deleteReq.onsuccess = () => {
            console.log('🗑️ Deleted IndexedDB:', db.name);
            resolve(true);
          };
          deleteReq.onerror = () => {
            console.error('❌ Failed to delete IndexedDB:', db.name, deleteReq.error);
            reject(deleteReq.error);
          };
        });
      }));
    }).then(() => {
      console.log('✅ All IndexedDB databases cleared');
    }).catch(err => {
      console.error('❌ IndexedDB clearing failed:', err);
    });
  }
  
  // Unregister service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('🔧 Found service workers:', registrations.length);
      return Promise.all(registrations.map(registration => {
        console.log('🗑️ Unregistering service worker:', registration.scope);
        return registration.unregister();
      }));
    }).then(() => {
      console.log('✅ All service workers unregistered');
    }).catch(err => {
      console.error('❌ Service worker unregistration failed:', err);
    });
  }
  
  // Clear browser cache (if possible)
  if ('webkitStorageInfo' in window) {
    try {
      window.webkitStorageInfo.requestQuota(
        window.PERSISTENT,
        0,
        function() {
          console.log('✅ Browser storage quota cleared');
        },
        function(e) {
          console.error('❌ Browser storage clear failed:', e);
        }
      );
    } catch (e) {
      console.log('ℹ️ Browser storage API not available');
    }
  }
  
  // Force reload after a short delay
  setTimeout(() => {
    console.log('🔄 Reloading page...');
    window.location.reload(true);
  }, 1000);
  
  console.log('🎯 Cache clearing initiated. Page will reload in 1 second.');
})();
