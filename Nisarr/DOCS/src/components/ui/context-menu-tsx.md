# context-menu.tsx Analysis

**Path**: `src/components/ui/context-menu.tsx`

## Overview
`ContextMenu` provides a menu triggered by a right-click (context menu event). Built on `@radix-ui/react-context-menu`.

## Detailed Code Analysis

### Components
- **`ContextMenu`**: Root.
- **`ContextMenuTrigger`**: The area that triggers the menu.
- **`ContextMenuContent`**: The menu popup.
    - `w-64` (standard width).
    - `z-50`.
    - Animations (fade, zoom).
- **`ContextMenuItem`**:
    - Selectable item.
    - `inset` prop allows alignment with items that have icons (adds `pl-8`).
- **`ContextMenuCheckboxItem` / `RadioItem`**:
    - Includes `ItemIndicator` (Check/Circle icon) absolutely positioned on the left (`left-2`).
- **`ContextMenuSub/SubTrigger/SubContent`**:
    - For nested submenus.

### Key Logic
- Handles right-click events automatically.
- Prevents the native browser context menu from appearing.
