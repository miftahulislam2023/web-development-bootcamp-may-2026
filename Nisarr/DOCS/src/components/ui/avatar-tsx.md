# avatar.tsx Analysis

**Path**: `src/components/ui/avatar.tsx`

## Overview
`Avatar` is an image element with a fallback for representing a user. Built on `@radix-ui/react-avatar`.

## Detailed Code Analysis

### Components
- **`Avatar`**: Root container.
    - Rounded full (circle).
    - `overflow-hidden` to clip image.
- **`AvatarImage`**: The `img` element.
    - `aspect-square` ensures 1:1 ratio.
- **`AvatarFallback`**: Rendered when image fails to load.
    - Centered content (initials or icon).
    - `bg-muted` background.

### Key Logic
- Handles image loading state automatically (shows fallback while loading or on error).
