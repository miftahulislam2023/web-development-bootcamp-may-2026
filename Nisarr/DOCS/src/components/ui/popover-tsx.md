# popover.tsx Analysis

**Path**: `src/components/ui/popover.tsx`

## Overview
`Popover` displays rich content in a portal, triggered by a button. Built on `@radix-ui/react-popover`.

## Detailed Code Analysis

### Components
- **`Popover`**: Root.
- **`PopoverTrigger`**: Trigger element.
- **`PopoverContent`**:
    - `w-72` default width.
    - `sideOffset=4`.
    - Shadows and borders.
    - Animations (zoom/fade).

### Key Logic
- Similar to Tooltip but clickable and can contain interactive content.
- Similar to Dialog but non-modal (usually) and anchored to a trigger.
