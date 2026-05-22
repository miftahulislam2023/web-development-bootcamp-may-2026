# calendar.tsx Analysis

**Path**: `src/components/ui/calendar.tsx`

## Overview
`Calendar` is a date picker component built on `react-day-picker`.

## Detailed Code Analysis

### Imports
- `react-day-picker`: Core logic.
- `lucide-react`: Navigation icons.
- `buttonVariants`: To style the calendar days/buttons.

### Component: `Calendar`
- **Props**: Extends `DayPicker` props.
- **Logic**:
    - Wraps `DayPicker`.
    - **Styles (`classNames`)**:
        - Extensive custom styling to match the system theme.
        - Maps `DayPicker` classes (like `day`, `day_selected`, `nav_button`) to Tailwind classes.
        - `day_selected`: Uses primary color.
        - `day_today`: Uses accent color.
    - **Components**: Replaces default icons (`IconLeft`, `IconRight`) with Lucide icons.
