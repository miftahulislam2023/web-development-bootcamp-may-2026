# PWA Configuration

## Overview
LifeOS is configured as a Progressive Web App (PWA) with offline support and installability.

## Configuration Files

### vite.config.ts
Uses `vite-plugin-pwa` with:
- Auto-update service worker
- Workbox caching for fonts and static assets
- Manifest configuration

### public/_redirects
Netlify SPA routing fallback.

### vercel.json
Vercel SPA routing rewrites.

## PWA Assets
- `logo-512.png` - Main app icon (512x512)
- `logo-192.png` - Medium icon (192x192)
- `apple-touch-icon.png` - iOS icon (180x180)
- `favicon.ico` - Browser favicon

## Manifest Settings
```json
{
  "name": "LifeOS - Personal Command Center",
  "short_name": "LifeOS",
  "theme_color": "#00D4AA",
  "background_color": "#0A0E1A",
  "display": "standalone"
}
```

## Testing PWA
1. Build: `npm run build`
2. Preview: `npm run preview`
3. Open in Chrome, check for install button in address bar
4. Use Chrome DevTools > Application > Service Workers to inspect
