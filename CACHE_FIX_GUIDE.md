# Cache Fix Guide - Development

## Problem
When refreshing the site during development, changes don't load immediately and require a hard reload.

## Solutions Implemented

### 1. Vite Configuration Updates
- Added cache-busting headers to development server
- Enabled HMR (Hot Module Replacement) overlay
- Added `--force` flag to dev script

### 2. HTML Meta Tags
- Added cache prevention meta tags to `index.html`
- Prevents browser caching of the HTML document

### 3. Development Scripts
Updated `package.json` with new scripts:
```bash
npm run dev          # Normal dev with --force flag
npm run dev:clean    # Clear Vite cache and start
npm run dev:clear    # Clear all caches and start
```

### 4. DevTools Component
- Added floating dev tools in bottom-right corner (development only)
- Provides cache clearing and force reload buttons
- Only visible in development mode

### 5. Cache Busting Utility
- Created `src/utils/cacheBuster.ts` for programmatic cache clearing
- Can be used throughout the app for cache management

## How to Use

### 🚀 Quick Fix (Most Common)
1. Use the **DevTools** component (floating button in bottom-right)
2. Click **"Clear All Cache"** then **"Force Reload"**
3. If still having issues, try **"Nuclear Option"**

### 💻 Console Script (Immediate Fix)
1. Open browser console (F12 → Console tab)
2. Copy and paste the entire content of `public/dev-cache-clear.js`
3. Press Enter - page will automatically reload

### 🔧 Manual Fix
1. **Hard Refresh**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear Browser Cache**: 
   - Chrome: F12 → Network tab → "Disable cache" checkbox
   - Firefox: F12 → Network tab → Settings → "Disable HTTP Cache"

### 🖥️ Development Server Fix
```bash
# Stop the dev server (Ctrl+C)
npm run dev:clean    # Clear Vite cache and restart
# OR
npm run dev:clear    # Clear all caches and restart
```

### 🌐 Browser Developer Tools
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 🧪 Nuclear Option (Last Resort)
1. Use DevTools component → "Nuclear Option" button
2. OR run in console: `localStorage.clear(); sessionStorage.clear(); location.reload();`
3. OR use incognito/private browsing mode

## Prevention Tips

1. **Keep DevTools Open**: Keep browser dev tools open with "Disable cache" checked
2. **Use DevTools Component**: Use the floating dev tools for quick cache clearing
3. **Regular Restarts**: Restart dev server periodically with `npm run dev:clean`
4. **Browser Settings**: Configure browser to not cache during development

## Technical Details

### Cache Headers Added
```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### Vite Configuration
- Development server now sends no-cache headers
- HMR overlay enabled for better error visibility
- Force flag added to bypass Vite's internal cache

### Browser Cache Types
- **HTTP Cache**: Prevented by meta tags and server headers
- **Service Worker Cache**: Cleared by DevTools component
- **Vite Cache**: Cleared by `--force` flag and dev scripts

## Troubleshooting

### Still Having Issues?
1. Try incognito/private browsing mode
2. Clear all browser data for localhost
3. Restart browser completely
4. Use `npm run dev:clear` to reset everything

### For Production
- These cache-busting measures only apply in development
- Production builds use proper caching strategies for performance
- No impact on production performance or caching
