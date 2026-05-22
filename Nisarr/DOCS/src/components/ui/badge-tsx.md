# badge.tsx Analysis

**Path**: `src/components/ui/badge.tsx`

## Overview
`Badge` displays a small tag or status indicator.

## Detailed Code Analysis

### Imports
- `cva`: For variant management.

### Variants (`badgeVariants`)
- **Default**: Primary color.
- **Secondary**: Secondary color.
- **Destructive**: Error/Red color.
- **Outline**: Border only.
- **Base Styles**: Rounded full, small text (`text-xs`), bold (`font-semibold`).

### Component: `Badge`
- Simple wrapper around a `div`.
- Applies variants using `cva`.
