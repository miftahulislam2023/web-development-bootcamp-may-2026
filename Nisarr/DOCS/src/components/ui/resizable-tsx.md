# resizable.tsx Analysis

**Path**: `src/components/ui/resizable.tsx`

## Overview
`Resizable` allows for resizable panels and layouts. Built on `react-resizable-panels`.

## Detailed Code Analysis

### Imports
- `react-resizable-panels`: Core functionality.
- `lucide-react`: `GripVertical` icon for the handle.

### Components
- **`ResizablePanelGroup`**:
    - Container for panels.
    - Handles direction (`vertical`/`horizontal`) via data attribute for styling.
- **`ResizablePanel`**:
    - The content area that gets resized.
- **`ResizableHandle`**:
    - The interactive divider.
    - `withHandle` prop: Renders a small grip icon (`GripVertical`) in the center of the handle.
    - Styles include a pseudo-element (`after`) to increase the hit area for easier dragging.

### Key Logic
- Declarative layout of resizable areas.
