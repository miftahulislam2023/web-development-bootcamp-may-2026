# radio-group.tsx Analysis

**Path**: `src/components/ui/radio-group.tsx`

## Overview
`RadioGroup` is a set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time. Built on `@radix-ui/react-radio-group`.

## Detailed Code Analysis

### Components
- **`RadioGroup`**: Root.
    - `grid gap-2`.
- **`RadioGroupItem`**:
    - The actual circular button.
    - `aspect-square h-4 w-4 rounded-full`.
    - `Indicator` renders a `Circle` icon (`fill-current`).

### Key Logic
- Manages single selection state within a group.
- Fully accessible via keyboard.
