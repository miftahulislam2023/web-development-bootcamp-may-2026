# carousel.tsx Analysis

**Path**: `src/components/ui/carousel.tsx`

## Overview
`Carousel` is a slideshow component for cycling through elements, built on `embla-carousel-react`.

## Detailed Code Analysis

### Imports
- `embla-carousel-react`: The core carousel library.
- `lucide-react`: Arrow icons.

### Context
- `CarouselContext`: Shares state (`api`, `scrollPrev`, `scrollNext`, `canScrollPrev`, `canScrollNext`) with children.

### Components
- **`Carousel`**: Root.
    - Initializes Embla carousel hook.
    - Handles keyboard navigation (Left/Right arrows).
    - Exposes API via `setApi` prop.
    - Updates scroll state on selection changes.
- **`CarouselContent`**: Container for slides.
    - `flex` layout for horizontal, `flex-col` for vertical.
- **`CarouselItem`**: Individual slide wrapper.
    - `min-w-0 shrink-0 grow-0 basis-full` (default 1 slide per view).
- **`CarouselPrevious/Next`**: Navigation buttons.
    - Absolute positioned by default (`-left-12`, `-right-12`).
    - Disables when scrolling is not possible.

### Key Logic
- Complex state management to sync React state with Embla's imperative API.
