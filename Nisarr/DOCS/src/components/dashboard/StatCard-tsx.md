# StatCard.tsx Analysis

**Path**: `src/components/dashboard/StatCard.tsx`

## Overview
`StatCard` is a reusable UI component for displaying a single statistic with an icon, value, label, and optional trend indicator.

## Detailed Code Analysis

### Imports
- `framer-motion`: Animations.
- `lucide-react`: Type definition `LucideIcon`.

### Props (`StatCardProps`)
- `title`, `value`: Main content.
- `subtitle`: Optional descriptive text.
- `icon`: The icon component to render.
- `trend`: Object with `value` (%) and `isPositive` boolean.
- `color`: Theme color variant (primary, success, warning, destructive).
- `delay`: Animation delay.

### Color Mapping
- `colorClasses` map defines CSS classes for icon backgrounds/text based on the `color` prop.

### Component: `StatCard`
- **Animation**: Standard slide-up entrance.
- **Top Row**:
    - **Icon**: Rendered inside a rounded container with the specified theme color.
    - **Trend Badge**: If `trend` exists, shows a small pill badge. Green for positive, red for negative (assuming `destructive` indicates negative sentiment, or vice versa depending on context, but code uses `destructive` for `!isPositive`).
- **Content**:
    - Large bold `value`.
    - Muted `title`.
    - Optional smaller `subtitle`.
