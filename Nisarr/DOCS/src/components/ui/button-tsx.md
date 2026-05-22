# button.tsx Analysis

**Path**: `src/components/ui/button.tsx`

## Overview
`Button` is the primary interactive element.

## Detailed Code Analysis

### Imports
- `Radix Slot`: For `asChild` prop (allows rendering a `Link` or other component as a button).
- `cva`: Variants.

### Variants (`buttonVariants`)
- **Types**: Default, Destructive, Outline, Secondary, Ghost, Link.
- **Sizes**: Default, SM, LG, Icon.
- **Base Styles**: Flex, centered, rounded-md, focus ring styles.

### Component: `Button`
- **Props**: `asChild` boolean.
- **Logic**: If `asChild`, renders `Slot`; otherwise `button`.
- Use standard HTML button attributes (`disabled`, `type`, etc.).
