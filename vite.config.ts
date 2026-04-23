import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  /** Backend for local/preview; matches production rewrite in vercel.json unless overridden */
  const apiProxyTarget =
    env.VITE_DEV_API_PROXY_TARGET?.trim() || "http://159.203.188.25:3000";
  const apiProxy = {
    "/api": {
      target: apiProxyTarget,
      changeOrigin: true,
    },
  };

  return {
  server: {
    port: 5173,
    strictPort: false,
    proxy: apiProxy,
    // Disable caching in development
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`
    },
    // Force reload on file changes
    hmr: {
      overlay: true,
      port: 24678
    },
    // Disable file system caching
    fs: {
      strict: false,
      allow: ['..']
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force any import of @radix-ui/react-tooltip to the local no-op stub
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/stubs/radix-tooltip.tsx"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - keep React together to avoid multiple instances
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          'query-vendor': ['@tanstack/react-query'],
          'icons-vendor': ['lucide-react'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority']
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          const info = name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return `images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Add cache busting for development
    ...(mode === 'development' && {
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }),
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-toast'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Define global variables to ensure React is available
  define: {
    global: 'globalThis',
  },
  // Ensure React is available globally
  esbuild: {
    jsx: 'automatic',
  },
  preview: {
    proxy: apiProxy,
  },
};
});
