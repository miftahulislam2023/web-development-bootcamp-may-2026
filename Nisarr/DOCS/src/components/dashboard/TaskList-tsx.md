# TaskList.tsx Analysis

**Path**: `src/components/dashboard/TaskList.tsx`

## Overview
`TaskList` displays a list of tasks due for the current day. It supports task prioritization visuals and completion toggling.

## Detailed Code Analysis

### Imports
- `framer-motion`: Animations.
- `lucide-react`: Icons (`Circle`, `CheckCircle2`, `Clock`, `AlertTriangle`).

### Interfaces
- `Task`: Task data (`id`, `title`, `status`, `priority`, `dueDate`).
- `TaskListProps`: List of `tasks` and `onToggle` handler.

### Helpers
- `priorityColors`: Maps priority levels to text colors (low: muted, medium: warning, high: destructive).

### Component: `TaskList`
- **Header**: "Due Today" and completion count.
- **Empty State**: If no tasks, shows a celebratory message.
- **List Items**:
    - **Animation**: Staggered entrance.
    - **Styles**: Row layout, hover effect. Dims opacity if task is done.
    - **Checkbox**: Button triggering `onToggle`.
        - `CheckCircle2` (Success color) if done.
        - `Circle` (Muted) if todo.
    - **Content**:
        - Title (line-through if done).
        - Due Date (optional) with Clock icon.
    - **Priority**:
        - Shows `AlertTriangle` if priority is high.
        - Colored based on priority.

### Key Logic
- Filters locally for display count (`t.status === "done"`).
- Handles empty array gracefully.
