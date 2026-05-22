# LifeOS PWA Configuration

## Overview
LifeOS is configured as a Progressive Web App (PWA) with offline support, installability, and caching strategies.

## Files Involved
- `vite.config.ts` - VitePWA plugin configuration
- `index.html` - Manifest link and PWA meta tags
- `public/logo-192.png` - App icon (192x192)
- `public/logo-512.png` - App icon (512x512)

## Features

### Manifest
- **Name**: LifeOS - Personal Command Center
- **Short Name**: LifeOS
- **Theme Color**: #00D4AA (Teal)
- **Background Color**: #0A0E1A (Dark)
- **Display**: Standalone (no browser UI)
- **Orientation**: Portrait

### Icons
- 192x192 PNG for home screen
- 512x512 PNG for splash screen
- Maskable icon for Android adaptive icons

### Service Worker (Workbox)
- **Precaching**: All JS, CSS, HTML, images, fonts
- **Navigation Fallback**: `index.html` for SPA offline routing
- **Font Caching**: Google Fonts cached for 1 year (CacheFirst)
- **API Caching**: Groq API with NetworkFirst strategy (1 day cache)

## PWA Meta Tags (index.html)
```html
<meta name="theme-color" content="#00D4AA" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="LifeOS" />
<link rel="manifest" href="/manifest.webmanifest" />
```

## Testing PWA
1. Build the app: `npm run build`
2. Serve with `npm run preview`
3. Open Chrome DevTools > Application > Manifest
4. Check "Service Workers" tab for registration status

## Installation
Users will see "Install" prompt on supported browsers when visiting the app.
