# dropdown-menu.tsx Analysis

**Path**: `src/components/ui/dropdown-menu.tsx`

## Overview
`DropdownMenu` displays a list of options to a user, triggered by a button. Built on `@radix-ui/react-dropdown-menu`.

## Detailed Code Analysis

### Components
- **`DropdownMenu`**: Root.
- **`DropdownMenuTrigger`**: Button that opens the menu.
- **`DropdownMenuContent`**:
    - The menu popup.
    - `sideOffset` controls distance from trigger.
- **`DropdownMenuItem`**:
    - Clickable item.
    - `inset` support.
- **`DropdownMenuCheckboxItem` / `RadioItem`**:
    - Selection states with icons.
- **`DropdownMenuShortcut`**:
    - Displays keyboard shortcuts (e.g., "⌘+S").

### Key Logic
- Similar structure to ContextMenu but triggered by a left click on a specific element rather than a right click.
