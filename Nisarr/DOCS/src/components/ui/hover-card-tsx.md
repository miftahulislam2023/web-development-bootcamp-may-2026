# hover-card.tsx Analysis

**Path**: `src/components/ui/hover-card.tsx`

## Overview
`HoverCard` allows sighted users to preview content available behind a link. Built on `@radix-ui/react-hover-card`.

## Detailed Code Analysis

### Components
- **`HoverCard`**: Root.
- **`HoverCardTrigger`**: The element that triggers the card on hover.
- **`HoverCardContent`**:
    - The preview content.
    - `w-64` width.
    - Animations (fade/zoom).
    - `z-50`.

### Key Logic
- triggered by hover with a slight delay (default in Radix).
