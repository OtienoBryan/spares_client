// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/Benjamin%20Okwama/Documents/CLS2026/drinks_client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Benjamin%20Okwama/Documents/CLS2026/drinks_client/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Benjamin%20Okwama/Documents/CLS2026/drinks_client/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Benjamin Okwama\\Documents\\CLS2026\\drinks_client";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_DEV_API_PROXY_TARGET?.trim() || "http://159.203.188.25:3000";
  const apiProxy = {
    "/api": {
      target: apiProxyTarget,
      changeOrigin: true
    }
  };
  return {
    server: {
      port: 5173,
      strictPort: false,
      proxy: apiProxy,
      // Disable caching in development
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Last-Modified": (/* @__PURE__ */ new Date()).toUTCString(),
        "ETag": `"${Date.now()}"`
      },
      // Force reload on file changes
      hmr: {
        overlay: true,
        port: 24678
      },
      // Disable file system caching
      fs: {
        strict: false,
        allow: [".."]
      }
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        // Force any import of @radix-ui/react-tooltip to the local no-op stub
        "@radix-ui/react-tooltip": path.resolve(__vite_injected_original_dirname, "./src/stubs/radix-tooltip.tsx")
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks - keep React together to avoid multiple instances
            "vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-toast", "@radix-ui/react-tooltip"],
            "query-vendor": ["@tanstack/react-query"],
            "icons-vendor": ["lucide-react"],
            "utils-vendor": ["clsx", "tailwind-merge", "class-variance-authority"]
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split("/").pop() : "chunk";
            return `js/[name]-[hash].js`;
          },
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || "asset";
            const info = name.split(".");
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
      sourcemap: mode === "development",
      // Optimize chunk size
      chunkSizeWarningLimit: 1e3,
      // Add cache busting for development
      ...mode === "development" && {
        rollupOptions: {
          output: {
            entryFileNames: "js/[name]-[hash].js",
            chunkFileNames: "js/[name]-[hash].js",
            assetFileNames: "assets/[name]-[hash].[ext]"
          }
        }
      },
      // Enable minification
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: mode === "production"
        }
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "lucide-react",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-toast"
      ],
      exclude: ["@vite/client", "@vite/env"]
    },
    // Define global variables to ensure React is available
    define: {
      global: "globalThis"
    },
    // Ensure React is available globally
    esbuild: {
      jsx: "automatic"
    },
    preview: {
      proxy: apiProxy
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCZW5qYW1pbiBPa3dhbWFcXFxcRG9jdW1lbnRzXFxcXENMUzIwMjZcXFxcZHJpbmtzX2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmVuamFtaW4gT2t3YW1hXFxcXERvY3VtZW50c1xcXFxDTFMyMDI2XFxcXGRyaW5rc19jbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0JlbmphbWluJTIwT2t3YW1hL0RvY3VtZW50cy9DTFMyMDI2L2RyaW5rc19jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksIFwiXCIpO1xyXG4gIC8qKiBCYWNrZW5kIGZvciBsb2NhbC9wcmV2aWV3OyBtYXRjaGVzIHByb2R1Y3Rpb24gcmV3cml0ZSBpbiB2ZXJjZWwuanNvbiB1bmxlc3Mgb3ZlcnJpZGRlbiAqL1xyXG4gIGNvbnN0IGFwaVByb3h5VGFyZ2V0ID1cclxuICAgIGVudi5WSVRFX0RFVl9BUElfUFJPWFlfVEFSR0VUPy50cmltKCkgfHwgXCJodHRwOi8vMTU5LjIwMy4xODguMjU6MzAwMFwiO1xyXG4gIGNvbnN0IGFwaVByb3h5ID0ge1xyXG4gICAgXCIvYXBpXCI6IHtcclxuICAgICAgdGFyZ2V0OiBhcGlQcm94eVRhcmdldCxcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxyXG4gICAgcHJveHk6IGFwaVByb3h5LFxyXG4gICAgLy8gRGlzYWJsZSBjYWNoaW5nIGluIGRldmVsb3BtZW50XHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlLCBuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlLCBtYXgtYWdlPTAnLFxyXG4gICAgICAnUHJhZ21hJzogJ25vLWNhY2hlJyxcclxuICAgICAgJ0V4cGlyZXMnOiAnMCcsXHJcbiAgICAgICdMYXN0LU1vZGlmaWVkJzogbmV3IERhdGUoKS50b1VUQ1N0cmluZygpLFxyXG4gICAgICAnRVRhZyc6IGBcIiR7RGF0ZS5ub3coKX1cImBcclxuICAgIH0sXHJcbiAgICAvLyBGb3JjZSByZWxvYWQgb24gZmlsZSBjaGFuZ2VzXHJcbiAgICBobXI6IHtcclxuICAgICAgb3ZlcmxheTogdHJ1ZSxcclxuICAgICAgcG9ydDogMjQ2NzhcclxuICAgIH0sXHJcbiAgICAvLyBEaXNhYmxlIGZpbGUgc3lzdGVtIGNhY2hpbmdcclxuICAgIGZzOiB7XHJcbiAgICAgIHN0cmljdDogZmFsc2UsXHJcbiAgICAgIGFsbG93OiBbJy4uJ11cclxuICAgIH1cclxuICB9LFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCldLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgLy8gRm9yY2UgYW55IGltcG9ydCBvZiBAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCB0byB0aGUgbG9jYWwgbm8tb3Agc3R1YlxyXG4gICAgICBcIkByYWRpeC11aS9yZWFjdC10b29sdGlwXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc3R1YnMvcmFkaXgtdG9vbHRpcC50c3hcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAvLyBWZW5kb3IgY2h1bmtzIC0ga2VlcCBSZWFjdCB0b2dldGhlciB0byBhdm9pZCBtdWx0aXBsZSBpbnN0YW5jZXNcclxuICAgICAgICAgICd2ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICAndWktdmVuZG9yJzogWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JywgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCcsICdAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCddLFxyXG4gICAgICAgICAgJ3F1ZXJ5LXZlbmRvcic6IFsnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J10sXHJcbiAgICAgICAgICAnaWNvbnMtdmVuZG9yJzogWydsdWNpZGUtcmVhY3QnXSxcclxuICAgICAgICAgICd1dGlscy12ZW5kb3InOiBbJ2Nsc3gnLCAndGFpbHdpbmQtbWVyZ2UnLCAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5J11cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAoY2h1bmtJbmZvKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBmYWNhZGVNb2R1bGVJZCA9IGNodW5rSW5mby5mYWNhZGVNb2R1bGVJZCA/IGNodW5rSW5mby5mYWNhZGVNb2R1bGVJZC5zcGxpdCgnLycpLnBvcCgpIDogJ2NodW5rJztcclxuICAgICAgICAgIHJldHVybiBganMvW25hbWVdLVtoYXNoXS5qc2A7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBuYW1lID0gYXNzZXRJbmZvLm5hbWUgfHwgJ2Fzc2V0JztcclxuICAgICAgICAgIGNvbnN0IGluZm8gPSBuYW1lLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgICBjb25zdCBleHQgPSBpbmZvW2luZm8ubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICBpZiAoL1xcLihjc3MpJC8udGVzdChuYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGNzcy9bbmFtZV0tW2hhc2hdLiR7ZXh0fWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoL1xcLihwbmd8anBlP2d8c3ZnfGdpZnx0aWZmfGJtcHxpY28pJC9pLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBpbWFnZXMvW25hbWVdLVtoYXNoXS4ke2V4dH1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvW25hbWVdLVtoYXNoXS4ke2V4dH1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIEVuYWJsZSBzb3VyY2UgbWFwcyBmb3IgYmV0dGVyIGRlYnVnZ2luZ1xyXG4gICAgc291cmNlbWFwOiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnLFxyXG4gICAgLy8gT3B0aW1pemUgY2h1bmsgc2l6ZVxyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxyXG4gICAgLy8gQWRkIGNhY2hlIGJ1c3RpbmcgZm9yIGRldmVsb3BtZW50XHJcbiAgICAuLi4obW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiB7XHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgLy8gRW5hYmxlIG1pbmlmaWNhdGlvblxyXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcclxuICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICBkcm9wX2NvbnNvbGU6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiBtb2RlID09PSAncHJvZHVjdGlvbicsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbXHJcbiAgICAgICdyZWFjdCcsXHJcbiAgICAgICdyZWFjdC1kb20nLFxyXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXHJcbiAgICAgICdAdGFuc3RhY2svcmVhY3QtcXVlcnknLFxyXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcclxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLFxyXG4gICAgICAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnLFxyXG4gICAgICAnQHJhZGl4LXVpL3JlYWN0LXRvYXN0J1xyXG4gICAgXSxcclxuICAgIGV4Y2x1ZGU6IFsnQHZpdGUvY2xpZW50JywgJ0B2aXRlL2VudiddXHJcbiAgfSxcclxuICAvLyBEZWZpbmUgZ2xvYmFsIHZhcmlhYmxlcyB0byBlbnN1cmUgUmVhY3QgaXMgYXZhaWxhYmxlXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcclxuICB9LFxyXG4gIC8vIEVuc3VyZSBSZWFjdCBpcyBhdmFpbGFibGUgZ2xvYmFsbHlcclxuICBlc2J1aWxkOiB7XHJcbiAgICBqc3g6ICdhdXRvbWF0aWMnLFxyXG4gIH0sXHJcbiAgcHJldmlldzoge1xyXG4gICAgcHJveHk6IGFwaVByb3h5LFxyXG4gIH0sXHJcbn07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdXLFNBQVMsY0FBYyxlQUFlO0FBQzlZLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFFBQU0saUJBQ0osSUFBSSwyQkFBMkIsS0FBSyxLQUFLO0FBQzNDLFFBQU0sV0FBVztBQUFBLElBQ2YsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsY0FBYztBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQUVBLFNBQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE9BQU87QUFBQTtBQUFBLE1BRVAsU0FBUztBQUFBLFFBQ1AsaUJBQWlCO0FBQUEsUUFDakIsVUFBVTtBQUFBLFFBQ1YsV0FBVztBQUFBLFFBQ1gsa0JBQWlCLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQUEsUUFDeEMsUUFBUSxJQUFJLEtBQUssSUFBSSxDQUFDO0FBQUEsTUFDeEI7QUFBQTtBQUFBLE1BRUEsS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBLFFBQ1QsTUFBTTtBQUFBLE1BQ1I7QUFBQTtBQUFBLE1BRUEsSUFBSTtBQUFBLFFBQ0YsUUFBUTtBQUFBLFFBQ1IsT0FBTyxDQUFDLElBQUk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLGlCQUFpQixnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sT0FBTztBQUFBLElBQzlFLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQTtBQUFBLFFBRXBDLDJCQUEyQixLQUFLLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsTUFDcEY7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUE7QUFBQSxZQUVaLFVBQVUsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsWUFDbkQsYUFBYSxDQUFDLDBCQUEwQixpQ0FBaUMseUJBQXlCLHlCQUF5QjtBQUFBLFlBQzNILGdCQUFnQixDQUFDLHVCQUF1QjtBQUFBLFlBQ3hDLGdCQUFnQixDQUFDLGNBQWM7QUFBQSxZQUMvQixnQkFBZ0IsQ0FBQyxRQUFRLGtCQUFrQiwwQkFBMEI7QUFBQSxVQUN2RTtBQUFBLFVBQ0EsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixrQkFBTSxpQkFBaUIsVUFBVSxpQkFBaUIsVUFBVSxlQUFlLE1BQU0sR0FBRyxFQUFFLElBQUksSUFBSTtBQUM5RixtQkFBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQixDQUFDLGNBQWM7QUFDN0Isa0JBQU0sT0FBTyxVQUFVLFFBQVE7QUFDL0Isa0JBQU0sT0FBTyxLQUFLLE1BQU0sR0FBRztBQUMzQixrQkFBTSxNQUFNLEtBQUssS0FBSyxTQUFTLENBQUM7QUFDaEMsZ0JBQUksV0FBVyxLQUFLLElBQUksR0FBRztBQUN6QixxQkFBTyxxQkFBcUIsR0FBRztBQUFBLFlBQ2pDO0FBQ0EsZ0JBQUksdUNBQXVDLEtBQUssSUFBSSxHQUFHO0FBQ3JELHFCQUFPLHdCQUF3QixHQUFHO0FBQUEsWUFDcEM7QUFDQSxtQkFBTyx3QkFBd0IsR0FBRztBQUFBLFVBQ3BDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQTtBQUFBLE1BRUEsV0FBVyxTQUFTO0FBQUE7QUFBQSxNQUVwQix1QkFBdUI7QUFBQTtBQUFBLE1BRXZCLEdBQUksU0FBUyxpQkFBaUI7QUFBQSxRQUM1QixlQUFlO0FBQUEsVUFDYixRQUFRO0FBQUEsWUFDTixnQkFBZ0I7QUFBQSxZQUNoQixnQkFBZ0I7QUFBQSxZQUNoQixnQkFBZ0I7QUFBQSxVQUNsQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLFFBQVE7QUFBQSxNQUNSLGVBQWU7QUFBQSxRQUNiLFVBQVU7QUFBQSxVQUNSLGNBQWMsU0FBUztBQUFBLFVBQ3ZCLGVBQWUsU0FBUztBQUFBLFFBQzFCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUyxDQUFDLGdCQUFnQixXQUFXO0FBQUEsSUFDdkM7QUFBQTtBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLElBQ1Y7QUFBQTtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsS0FBSztBQUFBLElBQ1A7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNBLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
