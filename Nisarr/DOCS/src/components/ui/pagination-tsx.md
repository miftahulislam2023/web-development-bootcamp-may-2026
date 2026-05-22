# pagination.tsx Analysis

**Path**: `src/components/ui/pagination.tsx`

## Overview
`Pagination` displays a list of page numbers and navigation arrows.

## Detailed Code Analysis

### Components
- **`Pagination`**: Root (`nav` element).
- **`PaginationContent`**: `ul` container.
- **`PaginationItem`**: `li` wrapper.
- **`PaginationLink`**:
    - Uses `buttonVariants`.
    - `isActive` prop highlights the current page (`variant: "outline"`).
    - otherwise `ghost` variant.
- **`PaginationPrevious/Next`**:
    - Pre-configured links with `ChevronLeft`/`ChevronRight` icons.
- **`PaginationEllipsis`**:
    - Renders `MoreHorizontal`.
    - Text "More pages" is screen-reader only.

### Key Logic
- purely presentational set of components for building pagination interfaces.
