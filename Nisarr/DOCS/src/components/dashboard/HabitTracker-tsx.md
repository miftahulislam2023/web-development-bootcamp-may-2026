# HabitTracker.tsx Analysis

**Path**: `src/components/dashboard/HabitTracker.tsx`

## Overview
`HabitTracker` lists daily habits, allowing users to toggle their completion status. It tracks streaks and visualizes progress for the day.

## Detailed Code Analysis

### Imports
- `framer-motion`: Animations.
- `lucide-react`: Icons (`Flame`, `Check`, `X`).

### Interfaces
- `Habit`: Represents a single habit (`id`, `name`, `streak`, `completedToday`).
- `HabitTrackerProps`: Props with `habits` list and `onToggle` callback.

### Component: `HabitTracker`
- **Header**: Shows "Today's Habits" and a counter (e.g., "2/5 done").
- **List**:
    - Iterates over `habits`.
    - **Animation**: Staggered entrance for each item (`delay: 0.1 * index`).
- **Item Structure**:
    - **Toggle Button**:
        - clickable area.
        - Stylized based on `completedToday` (Green if done, muted if not).
        - Displays `Check` or `X`.
    - **Name**: Truncated text, strikethrough if completed.
    - **Streak**: Displays flame icon and streak count in warning (orange) color.

### Interaction
- `onToggle(habit.id)` is called when the button is clicked.
