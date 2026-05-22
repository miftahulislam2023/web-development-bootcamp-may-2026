# AppLayout.tsx Analysis

**Path**: `src/components/layout/AppLayout.tsx`

## Overview
`AppLayout` is the main wrapper component for the application. It structures the page with a sidebar (desktop), bottom navigation (mobile), ambient background, and the AI command bar.

## Detailed Code Analysis

### Imports
- `Sidebar`, `BottomNav`: Layout components.
- `AICommandBar`: The global AI command interface.

### Component: `AppLayout`
- **Background**:
    - `min-h-screen bg-background`.
    - **Ambient Orbs**: Two large blurred circles (`blur-3xl`) with primary colors, positioned top-left and bottom-right to create a glowing effect. `pointer-events-none` prevents them from blocking clicks.
- **Desktop Layout**:
    - Renders `<Sidebar />`.
    - `main` element has `md:ml-64` to account for the fixed sidebar width.
- **Mobile Layout**:
    - `pb-24` on `main` to prevent content from being hidden behind the fixed `BottomNav`.
    - Renders `<BottomNav />` which is visible only on mobile (controlled by CSS in `BottomNav`).
- **Content Area**:
    - Centered container (`max-w-6xl mx-auto`) with padding.
- **Global Elements**:
    - `<AICommandBar />` rendered globally to be accessible from anywhere.
