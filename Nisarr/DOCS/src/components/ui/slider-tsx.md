# slider.tsx Analysis

**Path**: `src/components/ui/slider.tsx`

## Overview
`Slider` allows users to make selections from a range of values. Built on `@radix-ui/react-slider`.

## Detailed Code Analysis

### Components
- **`Slider`**: Root.
    - `relative flex w-full touch-none`.
    - **Track**: `h-2 w-full grow rounded-full bg-secondary`.
    - **Range**: `absolute h-full bg-primary`.
    - **Thumb**: `h-5 w-5 rounded-full border-2 border-primary bg-background`.

### Key Logic
- Handles drag interactions for selecting values.
