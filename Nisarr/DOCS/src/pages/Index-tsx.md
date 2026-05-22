# Index.tsx Analysis

**Path**: `src/pages/Index.tsx`

## Overview
`Index` is the main dashboard page of the LifeOS application. It aggregates key information like tasks, habits, expenses, and AI insights.

## Detailed Code Analysis

### Imports
- **Icons**: `Wallet`, `ListTodo`, `Target`, `TrendingUp`, `CalendarDays` (Lucide React).
- **Components**:
    - `AppLayout`: Main wrapper.
    - `StatCard`, `TaskList`, `HabitTracker`, `ExpenseChart`, `AIBriefing`: specific dashboard widgets.
- **Hooks**: `useTheme` for dark mode handling.
- **Libraries**: `framer-motion` for page entry animations.

### Mock Data
- `mockTasks`: Array of tasks with status, priority, due dates.
- `mockHabits`: Habits with streaks and completion status.
- `mockExpenses`: Categorized expense data for the chart.
- `mockInsights`: AI-generated summary, tips, and alerts.
- *Note*: Comments indicate this data will be replaced with real data from Turso.

### Component Structure
1.  **Theme Initialization**: Sets the document class based on the theme context.
2.  **Date Display**: Formats current date (e.g., "Friday, October 27, 2023").
3.  **Header**:
    - Greeting ("Good afternoon, Adnan").
    - Date with icon.
4.  **Stats Grid** (`grid-cols-2 lg:grid-cols-4`):
    - Four `StatCard` components (Budget, Tasks, Habits, Study Progress).
    - Staggered animations via `delay` prop.
5.  **Main Content Grid** (`lg:grid-cols-3`):
    - **Left Column (span-2)**:
        - `TaskList`: List of active tasks.
        - Sub-grid with `HabitTracker` and `ExpenseChart`.
    - **Right Column**:
        - `AIBriefing`: AI insights card.
        - **Quick Actions**: A manual grid of buttons ("Add Expense", "New Task", etc.) styled as a glassmorphic card.

### Key Logic
- **Layout**: Responsive grid layout (stack on mobile, multi-column on desktop).
- **Animations**: Extensive use of `framer-motion` for a smooth, "premium" feel.
- **Composition**: Heavy reliance on specialized sub-components (`StatCard`, etc.) to keep the page file clean.
