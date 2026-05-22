import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3001,
    headers: { "Cross-Origin-Opener-Policy": "same-origin-allow-popups" },
    hmr: { overlay: false },
    proxy: {
      "/api/auth": { target: "http://localhost:4001", changeOrigin: true },
      "/api/data": { target: "http://localhost:4002", changeOrigin: true },
      "/api/ai":   { target: "http://localhost:4002", changeOrigin: true },
      "/api/health": { target: "http://localhost:4002", changeOrigin: true },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.svg", "favicon.ico", "favicon-32.png", "favicon-16.png", "apple-touch-icon.png", "logo-192.png", "logo-512.png"],
      manifest: {
        name: "LifeSolver - Personal Command Center",
        short_name: "LifeSolver",
        description: "Your AI-powered personal productivity and life management system",
        theme_color: "#0A0E1A",
        background_color: "#0A0E1A",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "logo-192.png", sizes: "192x192", type: "image/png" },
          { src: "logo-512.png", sizes: "512x512", type: "image/png" },
          { src: "logo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      devOptions: { enabled: true },
      workbox: {
        maximumFileSizeToCacheInBytes: 10000000,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, handler: "CacheFirst", options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 }, cacheableResponse: { statuses: [0, 200] } } },
          { urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i, handler: "CacheFirst", options: { cacheName: "gstatic-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 }, cacheableResponse: { statuses: [0, 200] } } },
          { urlPattern: /^https:\/\/i\.ibb\.co\/.*/i, handler: "CacheFirst", options: { cacheName: "imgbb-images-cache", expiration: { maxEntries: 200, maxAgeSeconds: 365 * 24 * 60 * 60 }, cacheableResponse: { statuses: [0, 200] } } },
          { urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i, handler: "CacheFirst", options: { cacheName: "external-images-cache", expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }, cacheableResponse: { statuses: [0, 200] } } },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));
