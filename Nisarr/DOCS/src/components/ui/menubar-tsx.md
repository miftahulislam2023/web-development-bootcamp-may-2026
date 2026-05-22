# menubar.tsx Analysis

**Path**: `src/components/ui/menubar.tsx`

## Overview
`Menubar` provides a visually persistent menu bar, similar to a desktop application's top menu. Built on `@radix-ui/react-menubar`.

## Detailed Code Analysis

### Components
- **`Menubar`**: Root container. Flex row.
- **`MenubarMenu`**: Wrapper for a menu item and its trigger.
- **`MenubarTrigger`**: The button in the bar (e.g., "File", "Edit").
- **`MenubarContent`**: The dropdown that appears.
- **`MenubarItem`**, **`MenubarCheckboxItem`**, **`MenubarRadioItem`**: Menu content items. Exactly analogous to ContextMenu/DropdownMenu items.
- **`MenubarShortcut`**: For keyboard commands.

### Key Logic
- Managing focus and open state across strictly horizontal top-level items and vertical sub-items.
