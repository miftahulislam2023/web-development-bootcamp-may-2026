# ExpenseChart.tsx Analysis

**Path**: `src/components/dashboard/ExpenseChart.tsx`

## Overview
`ExpenseChart` renders a pie chart showing the distribution of monthly expenses. It uses `recharts` for visualization and displays the total expense amount.

## Detailed Code Analysis

### Imports
- `framer-motion`: For entrance animations.
- `recharts`: Library for charts (`PieChart`, `Pie`, `Cell`, etc.).

### Interfaces
- `ExpenseData`: Shape of a single data point (`name`, `value`, `color`).
- `ExpenseChartProps`: Props containing `data` array and `total` number.

### Component: `ExpenseChart`
- **Animation**: Slides up and fades in with a 0.4s delay.
- **Header**: Shows title "Monthly Expenses" and the formatted total amount (e.g., `৳5,000`).
- **Chart**:
    - Wrapped in `ResponsiveContainer` to fit the parent div.
    - `PieChart` with an inner radius to create a donut chart style.
    - **Data Mapping**: Maps `data` to `Cell` components, assigning specific colors.
    - **Tooltip**: Custom styled tooltip with card-like appearance (`hsl(var(--card))`).
    - **Legend**: Located at the bottom, displays category names.

### Key Details
- Uses `toLocaleString()` for currency formatting.
- The chart has a `paddingAngle` to separate segments visually.
