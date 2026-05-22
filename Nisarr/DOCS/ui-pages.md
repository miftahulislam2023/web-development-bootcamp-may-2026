# UI Pages Architecture

## Overview
All pages use `AppLayout` wrapper, `framer-motion` animations, `SEO` component, and the glass-card design system.

## Pages

### Dashboard (`src/pages/Index.tsx`)
- **Role**: Main overview with analytics from all modules
- **Data Sources**: `useFinance`, `useBudget`, `useTasks`, `useHabits`, `useStudy`, `useNotes`
- **Features**:
  - Time-aware greeting
  - Primary stats: Balance, Budget Left, Total Savings, Pending Tasks
  - Activity Overview with mini progress rings (tasks, habits, study, notes)
  - Monthly spending pie chart with category breakdown & MoM trend
  - Study progress bars by subject
  - Recent tasks and habits summaries
  - Recent transactions feed

### Study Page (`src/pages/StudyPage.tsx`)
- **Data Source**: `useStudy` hook
- **Features**:
  - Stats grid (subjects, chapters, progress, completed)
  - Circular progress indicator (overall study progress)
  - Subject cards with color-coded headers and chapter lists
  - Inline progress sliders per chapter
  - Focus Timer with Pomodoro technique
  - AI study tips via `getStudyTips()` from Groq
  - Add/delete chapters, schedule chapters as tasks

### Notes Page (`src/pages/NotesPage.tsx`)
- **Data Source**: `useNotes` hook
- **Features**:
  - Stats: Total Notes, Tags Used, This Week
  - Tag filter pills for quick filtering
  - Search bar (searches title, content, tags)
  - Note pinning (persisted to localStorage)
  - Markdown editor with live preview (react-markdown + remark-gfm)
  - Color-coded tags with deterministic hash coloring
  - Card grid with gradient fade-out on content overflow

### Habits Page (`src/pages/HabitsPage.tsx`)
- **Data Source**: `useHabits` hook
- **Features**:
  - Completion ring showing today's progress
  - Stats: Active Habits, Done Today, Best Streak, Completion %
  - Sorted list (uncompleted first, then by streak desc)
  - Streak flame with intensity levels (color changes at 7, 14, 30 days)
  - Weekly visual heat map (7-day calendar squares)
  - One-click complete button with animated state

### Finance Page (`src/pages/FinancePage.tsx`)
- **Data Source**: `useFinance`, `useBudget` hooks
- **Features**: Income/expense tracking, budget management, savings goals

### Tasks Page (`src/pages/TasksPage.tsx`)
- **Data Source**: `useTasks`, `useTaskIntegration` hooks
- **Features**: Task management with priorities, due dates, duration tracking

### Inventory Page (`src/pages/InventoryPage.tsx`)
- **Data Source**: `useInventory` hook
- **Features**: Item tracking with categories and quantities

### Settings Page (`src/pages/SettingsPage.tsx`)
- **Features**: Theme selection, profile settings, data management

## Shared Design Patterns
- `glass-card` CSS class for card containers
- `text-gradient` for accent text
- `bg-gradient-to-br` for stat card backgrounds
- `framer-motion` for entry animations
- Consistent color tokens: primary, success, warning, destructive
- Badge components for status indicators
- Empty state patterns with icons and CTA buttons
