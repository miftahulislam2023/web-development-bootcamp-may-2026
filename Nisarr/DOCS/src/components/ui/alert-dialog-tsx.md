# alert-dialog.tsx Analysis

**Path**: `src/components/ui/alert-dialog.tsx`

## Overview
`AlertDialog` is a modal dialog that interrupts the user with important content and expects a response. It is built on `@radix-ui/react-alert-dialog`.

## Detailed Code Analysis

### Imports
- `@radix-ui/react-alert-dialog`: Primitives.
- `buttonVariants`: Reuses button styles.

### Components
- **`AlertDialog`**: Root.
- **`AlertDialogTrigger`**: Opens the dialog.
- **`AlertDialogContent`**:
    - Rendered in a `Portal` to break out of DOM hierarchy.
    - **Overlay**: `AlertDialogOverlay` (dimmed background).
    - **Animation**: Scale/fade in (`zoom-in-95`, `fade-in-0`).
    - **Position**: Fixed centered (`left-[50%] top-[50%]`).
- **`AlertDialogHeader/Footer`**:
    - Structural wrappers for layout (header: text center/left; footer: flex row/column).
- **`AlertDialogTitle/Description`**:
    - Standard typography styles.
- **`AlertDialogAction`**:
    - Primary action button (e.g., "Confirm").
    - Uses default button variant.
- **`AlertDialogCancel`**:
    - Cancel button.
    - Uses `outline` button variant.

### Key Logic
- Ensures focus management and prevents interaction outside the dialog (modal).
