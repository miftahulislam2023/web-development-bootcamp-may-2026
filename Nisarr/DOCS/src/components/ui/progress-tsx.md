# progress.tsx Analysis

**Path**: `src/components/ui/progress.tsx`

## Overview
`Progress` displays an indicator showing the completion progress of a task. Built on `@radix-ui/react-progress`.

## Detailed Code Analysis

### Components
- **`Progress`**: Root.
    - `h-4 w-full`: Standard size.
    - `bg-secondary`: Track color.
    - `overflow-hidden`: Masks the indicator.
- **Indicator**:
    - `bg-primary`: Fill color.
    - `transform: translateX(-${100 - (value || 0)}%)`: Animates the bar width by translating a full-width element.

### Key Logic
- Uses negative generic translation for performant animation of the progress bar fill.
