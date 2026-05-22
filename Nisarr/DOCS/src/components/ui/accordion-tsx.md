# accordion.tsx Analysis

**Path**: `src/components/ui/accordion.tsx`

## Overview
`Accordion` is a vertically stacked set of interactive headings that each reveal a section of content. It is built on top of `@radix-ui/react-accordion`.

## Detailed Code Analysis

### Imports
- `@radix-ui/react-accordion`: The headless accessible primitive.
- `lucide-react`: `ChevronDown` icon.
- `cn`: Utility for class merging.

### Components
- **`Accordion`**: Root component (alias for `AccordionPrimitive.Root`).
- **`AccordionItem`**:
    - Wraps a single accordion section.
    - Adds bottom border styles.
- **`AccordionTrigger`**:
    - The clickable header.
    - **Animation**: Chevron rotates 180 degrees using tailwind selectors `[&[data-state=open]>svg]:rotate-180`.
    - **Styles**: Flex layout with hover underline.
- **`AccordionContent`**:
    - The collapsible panel.
    - **Animation**: Open/close animations (`animate-accordion-up`, `animate-accordion-down`) based on `data-state`.
    - `overflow-hidden` ensures smooth height transition.

### Key Logic
- Uses Radix UI for accessibility (keyboard nav, ARIA attributes).
- Relies on `data-state` attributes for styling state changes.
