# drawer.tsx Analysis

**Path**: `src/components/ui/drawer.tsx`

## Overview
`Drawer` is a touch-friendly bottom sheet component, often used on mobile. Built on `vaul`.

## Detailed Code Analysis

### Imports
- `vaul`: The drawer library.

### Components
- **`Drawer`**: Root.
    - `shouldScaleBackground`: Effect that scales the background content slightly when open.
- **`DrawerContent`**:
    - Fixed at bottom.
    - Rounded top corners.
    - **Handle**: Small gray bar (`w-[100px]`) at the top to indicate draggability.
- **`DrawerOverlay`**: Backdrop.

### Key Logic
- Designed for mobile-first experiences.
- Supports dragging to dismiss.
