# switch.tsx Analysis

**Path**: `src/components/ui/switch.tsx`

## Overview
`Switch` is a control that allows the user to toggle between checked and not checked. Built on `@radix-ui/react-switch`.

## Detailed Code Analysis

### Component: `Switch`
- **Root**:
    - `w-11 h-6`.
    - `data-[state=checked]:bg-primary`.
    - `data-[state=unchecked]:bg-input`.
- **Thumb**:
    - `h-5 w-5`.
    - `translate-x-5` when checked.

### Key Logic
- Standard toggle architecture.
