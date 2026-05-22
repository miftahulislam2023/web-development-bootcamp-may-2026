# navigation-menu.tsx Analysis

**Path**: `src/components/ui/navigation-menu.tsx`

## Overview
`NavigationMenu` is a collection of links for navigating websites. Built on `@radix-ui/react-navigation-menu`.

## Detailed Code Analysis

### Components
- **`NavigationMenu`**: Root.
    - Includes `NavigationMenuViewport` automatically.
- **`NavigationMenuList`**: Container for items.
- **`NavigationMenuItem`**: Individual item.
- **`NavigationMenuTrigger`**: Button with a chevron that opens content.
- **`NavigationMenuContent`**:
    - The mega-menu style content.
    - Animations handled by data attributes (`data-[motion]`).
- **`NavigationMenuLink`**: Link component.
- **`NavigationMenuViewport`**:
    - The standard container that animates width/height to fit the active content.
    - `absolute left-0 top-full`.
- **`NavigationMenuIndicator`**:
    - Small arrow/line indicating active item.

### Key Logic
- Complex orchestration of layout to ensure the viewport transitions smoothly between different sized content panes.
