# tabs.tsx Analysis

**Path**: `src/components/ui/tabs.tsx`

## Overview
`Tabs` allows content to be organized into sections, with one section visible at a time. Built on `@radix-ui/react-tabs`.

## Detailed Code Analysis

### Components
- **`Tabs`**: Root.
- **`TabsList`**:
    - Container for triggers.
    - `bg-muted`.
    - `inline-flex`.
- **`TabsTrigger`**:
    - The clickable tab.
    - Active state: `bg-background`, `shadow-sm`, `text-foreground`.
- **`TabsContent`**:
    - The content panel.
    - `mt-2`.

### Key Logic
- Keyboard navigation (arrows) between tabs.
