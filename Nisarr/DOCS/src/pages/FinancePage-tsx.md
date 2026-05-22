# FinancePage.tsx

## Overview
The Finance page provides comprehensive income and expense tracking with date range filtering, trend visualization, and AI-powered entry management.

## Features

### View Modes
- **Daily**: Single day view with pie chart for expense category breakdown
- **Weekly**: 7-day range with line chart showing income/expense trends
- **Monthly**: Full month view with daily breakdown line chart  
- **Yearly**: 12-month view with monthly data points
- **Custom**: User-defined date range
- **All Time**: All entries across all dates

### Date Controls
- Uses shadcn/ui Calendar component in Popover for consistent website-native date picking
- Navigation arrows for quick period changes
- Quick buttons: "Today", "This Week", "This Month", "This Year"

### Charts
- **Daily View**: Pie chart showing expenses grouped by category
- **Other Views**: Line chart with two trend lines (Income = green, Expense = red)
  - X-axis shows day numbers (1-31) or weekday names or month abbreviations
  - Hoverable data points with tooltips

### Entry Management
- Add new income/expense entries via dialog
- Edit existing entries (pencil icon in history modal)
- Delete entries (trash icon)
- AI can add/edit/delete entries via chat commands

### AI Integration Actions
- `ADD_EXPENSE`: Add expense entry with amount, category, description, date
- `ADD_INCOME`: Add income entry with amount, category, description, date
- `EDIT_EXPENSE` / `EDIT_INCOME`: Modify existing entries by ID
- `DELETE_EXPENSE` / `DELETE_INCOME`: Remove entries by ID

## Key Components Used
- `useFinance` hook for data management (entries, addEntry, updateEntry, deleteEntry)
- `Calendar` and `Popover` from shadcn/ui for date selection
- `LineChart`, `PieChart` from recharts for visualization
- `Tabs` for view mode selection

## Categories
**Expense**: Food, Transport, Rent, Bills, Shopping, Entertainment, Health, Education, Other
**Income**: Salary, Freelance, Business, Gift, Investment, Other

> When selecting "Other", a text input appears to enter a custom category name.

## Budget & Savings Goals
- Create budget goals (monthly/weekly/yearly spending limits)
- Create savings goals with target amounts
- Track progress with visual progress bars
- Edit goal targets via popover buttons
- Dashboard cards show budget remaining and total savings
- **Sorting**: Sort goals by Date (newest first) or Amount (highest first)

### Savings Transaction History
- Click "Total Savings" card to view full transaction history
- Each deposit/withdrawal is logged with date, amount, and description
- **Edit** any transaction (change type, amount, date, description)
- **Delete** transactions with automatic balance reversal

### Balance Calculation
`Available Balance = Total Income - Total Expenses`
(Savings are tracked separately and not subtracted from balance)

## Special Items (2026-02-09)
Track one-time or unusual transactions separately from regular entries:

- **Mark as Special**: Toggle in entry dialog when adding income/expense
- **Collapsible Section**: Shows special income, expenses, and balance
- **Include in Totals**: Toggle to optionally include special items in main stats
- **Visual Indicators**: Star icon for special items

### AI Actions for Special Items
- `ADD_SPECIAL_EXPENSE`: Add special expense
- `ADD_SPECIAL_INCOME`: Add special income  
- `ADD_SPECIAL_BUDGET`: Create special budget goal
- `ADD_SPECIAL_SAVINGS`: Create special savings goal
- `TOGGLE_SPECIAL`: Toggle special status on existing entry

## PDF Export (2026-02-09)
Download transaction history as PDF from any History modal:
- Income History, Expense History, All Transactions
- Savings History with deposit/withdrawal breakdown
- Auto-generated summary with totals

## Key Components Used
- `useFinance` hook: entries, addEntry, updateEntry, deleteEntry
- `useBudget` hook: budgets, savingsGoals, addToSavings, updateSavingsTransaction
- `Calendar` + `Popover` from shadcn/ui for date selection
- `LineChart`, `PieChart` from recharts for visualization
- `Tabs` for view mode selection
- `jsPDF` + `jspdf-autotable` for PDF generation

## Mobile Optimization (2026-02-09)
All cards and modals are mobile-responsive:

### Responsive Cards
- **Smaller padding**: `p-3 sm:p-5` for compact mobile view
- **Smaller text**: `text-lg sm:text-2xl` for amounts, `text-xs sm:text-sm` for labels
- **Reduced gaps**: `gap-2 sm:gap-4` between grid items
- **Truncated text**: Long names/descriptions use `truncate` class

### Responsive Rows
- **Goals list**: Stacks vertically on xs screens (`flex-col xs:flex-row`)
- **Transaction items**: `min-w-0 flex-1` prevents overflow, text truncates

### Bottom Sheet Modals
History and Savings History modals use mobile-friendly bottom sheet pattern:
- Slides up from bottom on mobile (`items-end sm:items-center`)
- Handle bar for drag indication (`sm:hidden`)
- Rounded top corners on mobile (`rounded-t-2xl sm:rounded-xl`)
- Spring animation for smooth transitions

