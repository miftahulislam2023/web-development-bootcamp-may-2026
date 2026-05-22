# sonner.tsx Analysis

**Path**: `src/components/ui/sonner.tsx`

## Overview
`Sonner` is the toast provider component, wrapping the `sonner` library.

## Detailed Code Analysis

### Imports
- `sonner`: The toast library.
- `next-themes`: To sync toast theme with app theme.

### Component: `Toaster`
- Inherits theme from `next-themes`.
- **Styles (`toastOptions`)**:
    - `toast`: Background, border, shadow styles.
    - `description`: Muted text.
    - `actionButton`: Primary color.
    - `cancelButton`: Muted color.

### Key Logic
- Centralized configuration for application toasts.
