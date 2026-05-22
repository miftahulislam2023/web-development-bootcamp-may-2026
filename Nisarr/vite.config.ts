import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";
import vercel from "vite-plugin-vercel";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: "frontend/web-app/public",
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api/auth": { target: "http://localhost:4001", changeOrigin: true },
      "/api/data": { target: "http://localhost:4002", changeOrigin: true },
      "/api/ai":   { target: "http://localhost:4002", changeOrigin: true },
      "/api/health": { target: "http://localhost:4002", changeOrigin: true },
    },
  },
  plugins: [
    react(),
    vercel(),
    mode === "development" && componentTagger(),
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
          {
            src: "logo.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development for testing
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10000000,
        skipWaiting: true,       // New SW activates immediately (no waiting)
        clientsClaim: true,      // New SW takes control of all tabs instantly
        cleanupOutdatedCaches: true, // Remove old cache entries automatically
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "index.html", // SPA fallback for offline navigation
        navigateFallbackDenylist: [/^\/api/], // Don't fallback API routes
        runtimeCaching: [
          // ── Google Fonts (CSS) — Cache forever ──
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── Google Fonts (Files) — Cache forever ──
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── Groq AI API — Network first, cache fallback ──
          {
            urlPattern: /^https:\/\/api\.groq\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "groq-api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 10,
            },
          },
          // ── Turso Database API — Stale while revalidate ──
          {
            urlPattern: /^https:\/\/.*\.turso\.io\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "turso-db-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 10,
            },
          },
          // ── ImgBB Uploaded Images — Cache for 1 year ──
          {
            urlPattern: /^https:\/\/i\.ibb\.co\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "imgbb-images-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ── External Images (general) — Cache 30 days ──
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "external-images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/web-app/src"),
    },
  },
}));
