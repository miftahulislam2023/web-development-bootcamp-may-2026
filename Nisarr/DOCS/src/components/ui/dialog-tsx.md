# dialog.tsx Analysis

**Path**: `src/components/ui/dialog.tsx`

## Overview
`Dialog` is a window overlaid on either the primary window or another dialog window, rendering the content underneath inert. Built on `@radix-ui/react-dialog`.

## Detailed Code Analysis

### Components
- **`Dialog`**: Root.
- **`DialogTrigger`**: Opens the dialog.
- **`DialogContent`**:
    - Rendered in a `Portal`.
    - Centered fixed position (`left-[50%] top-[50%]`).
    - **Close Button**: `X` icon in the top right corner.
- **`DialogOverlay`**:
    - Semi-transparent backdrop (`bg-black/80`).
- **`DialogHeader/Footer`**:
    - Structural wrappers for consistent layout.
- **`DialogTitle`**: H2 equivalent for accessibility.
- **`DialogDescription`**: Description text.

### Key Logic
- Manages focus trap (user cannot tab outside).
- Handles ESC key to close.
