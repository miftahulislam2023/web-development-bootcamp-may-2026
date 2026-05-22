# checkbox.tsx Analysis

**Path**: `src/components/ui/checkbox.tsx`

## Overview
`Checkbox` is a control that allows the user to toggle between checked and not checked. Built on `@radix-ui/react-checkbox`.

## Detailed Code Analysis

### Components
- **`Checkbox`**:
    - **Styles**:
        - `h-4 w-4` (small square).
        - `border-primary`.
        - `data-[state=checked]`: Background becomes primary, text becomes foreground.
    - **Indicator**: Renders `Check` icon when checked.

### Key Logic
- Uses `peer` class but mainly relies on Radix's `data-state` for styling.
