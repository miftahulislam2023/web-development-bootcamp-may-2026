# breadcrumb.tsx Analysis

**Path**: `src/components/ui/breadcrumb.tsx`

## Overview
`Breadcrumb` displays the current page's location within a hierarchy.

## Detailed Code Analysis

### Imports
- `Radix Slot`: For polymorphism (`asChild`).
- `lucide-react`: `ChevronRight`, `MoreHorizontal`.

### Components
- **`Breadcrumb`**: `nav` wrapper. `aria-label="breadcrumb"`.
- **`BreadcrumbList`**: `ol` (ordered list). Flex container.
- **`BreadcrumbItem`**: `li`. Inline flex.
- **`BreadcrumbLink`**: `a` (anchor) or Slot. Hover effects.
- **`BreadcrumbPage`**: `span`. Represents current page (not clickable, normal font weight, foreground color). `aria-current="page"`.
- **`BreadcrumbSeparator`**: `li`. Renders `ChevronRight` (or children) between items. Small size (`size-3.5`).
- **`BreadcrumbEllipsis`**: `span`. Renders `MoreHorizontal` for truncated paths. `sr-only` text "More" for accessibility.

### Key Logic
- Semantic HTML (`nav`, `ol`, `li`) for accessibility.
