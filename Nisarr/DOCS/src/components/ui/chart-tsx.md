# chart.tsx Analysis

**Path**: `src/components/ui/chart.tsx`

## Overview
`Chart` is a comprehensive wrapper around `recharts` to provide consistent theming and tooltips.

## Detailed Code Analysis

### Config
- `THEMES`: Mappings for light/dark mode css selectors.
- `ChartConfig`: Type definition for chart configuration (colors, labels, icons).

### Components
- **`ChartContainer`**:
    - Generates a unique ID for the chart.
    - **`ChartStyle`**: Inject CSS variables for colors based on the config. This allows `recharts` (which uses inline styles/SVG) to respect Tailwind/CSS variable themes.
    - Sets default styles for Recharts elements (grid lines, specific cursor styles).
- **`ChartTooltip`**: Wrapper for Recharts tooltip.
- **`ChartTooltipContent`**:
    - **Custom Logic**: Formats tooltip content based on `ChartConfig`.
    - Handles `labelFormatter`, `formatter`, `indicator` styles (dot, line, dashed).
    - Renders a styled grid of items.
- **`ChartLegend`**: Wrapper.
- **`ChartLegendContent`**:
    - Custom legend rendering matching the config.

### Key Logic
- The `ChartStyle` component dynamically generates a `<style>` block to map user-defined config keys (e.g. `desktop`) to CSS variables (e.g. `--color-desktop`) scoped to the chart ID.
