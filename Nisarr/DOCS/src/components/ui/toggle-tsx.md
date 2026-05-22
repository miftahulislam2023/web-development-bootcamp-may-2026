# toggle.tsx Analysis

**Path**: `src/components/ui/toggle.tsx`

## Overview
`Toggle` is a two-state button that can be either on or off. Built on `@radix-ui/react-toggle`.

## Detailed Code Analysis

### Variants (`toggleVariants`)
- **Default**: Transparent background.
- **Outline**: Bordered.
- **States**: `data-[state=on]`: `bg-accent text-accent-foreground`.

### Component: `Toggle`
- Root primitive.
- Applies variants.

### Key Logic
- Simple toggle button interaction.
