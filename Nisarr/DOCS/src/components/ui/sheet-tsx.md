# sheet.tsx Analysis

**Path**: `src/components/ui/sheet.tsx`

## Overview
`Sheet` extends the Dialog component to display content that complements the main screen, often sliding in from the side. Built on `@radix-ui/react-dialog`.

## Detailed Code Analysis

### Variants (`sheetVariants`)
- **Movements**:
    - `top`, `bottom`, `left`, `right` (default).
    - Defines entry/exit animations (slide-in/slide-out).

### Components
- **`Sheet`**: Root (alias for Dialog).
- **`SheetTrigger`**: Opens the sheet.
- **`SheetContent`**:
    - Uses `sheetVariants`.
    - Fixed positioning based on `side`.
    - Includes Close button (`X`).
- **`SheetOverlay`**: Backdrop.

### Key Logic
- Reuses Dialog primitives but changes the visual presentation to a drawer/sidebar interaction model.
