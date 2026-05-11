# FinanceApp Frontend

A modern personal finance dashboard built with Next.js 16, React 19, TypeScript, TailwindCSS, and React Query.

## Features

- 💳 **Dashboard** - Overview of balance, income, expenses with charts and trends
- 💰 **Transactions** - View, create, edit, and delete financial transactions with filtering and pagination
- 📊 **Budgets** - Create and monitor spending budgets with progress tracking
- ⚙️ **Settings** - User profile and preference management
- 🔐 **Authentication** - Secure login/register with JWT tokens and refresh token rotation
- 📱 **Responsive Design** - Mobile-first design with TailwindCSS
- 🎨 **Modern UI** - Built with shadcn/ui components and Radix UI primitives

## Tech Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 + shadcn/ui
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Validation**: Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns
- **Package Manager**: Bun

## Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (dashboard)/                  # Protected dashboard routes
│   │   ├── page.tsx                  # Dashboard homepage
│   │   ├── transactions/page.tsx      # Transactions list
│   │   ├── budgets/page.tsx          # Budgets management
│   │   ├── settings/page.tsx         # User settings
│   │   └── layout.tsx                # Dashboard layout with providers
│   ├── auth/                         # Authentication routes
│   │   ├── login/page.tsx            # Login page
│   │   ├── register/page.tsx         # Registration page
│   │   └── layout.tsx                # Auth layout
│   ├── layout.tsx                    # Root layout with QueryClient
│   └── globals.css                   # Global styles
├── components/
│   ├── ui/                           # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── table.tsx
│   ├── layout/                       # Layout components
│   │   ├── Sidebar.tsx              # Main navigation sidebar
│   │   ├── Topbar.tsx               # Top navigation bar
│   │   └── MainLayout.tsx           # Main layout wrapper
│   ├── cards/                        # Feature components
│   │   ├── KPICard.tsx              # Dashboard metric card
│   │   ├── BudgetCard.tsx           # Budget progress card
│   │   └── TransactionRow.tsx       # Transaction table row
│   ├── charts/                       # Data visualization
│   │   ├── ExpenseChart.tsx         # Pie chart for expense breakdown
│   │   └── TrendChart.tsx           # Line chart for trends
│   └── forms/                        # Form components
│       ├── TransactionForm.tsx      # Create/edit transactions
│       └── BudgetForm.tsx           # Create/edit budgets
└── lib/
    ├── api.ts                        # API client with axios
    ├── store.ts                      # Zustand stores (auth, ui)
    ├── hooks.ts                      # React Query custom hooks
    └── utils.ts                      # Utility functions
```

## Setup Instructions

### Prerequisites

- Node.js 18+ or Bun
- Backend running on http://localhost:3000 (see [backend README](../backend/README.md))
- npm or bun package manager

### Installation

1. **Install dependencies**:

   ```bash
   bun install
   # or
   npm install
   ```

2. **Configure environment variables**:
   Create `.env.local` file (already provided):

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

   Adjust `NEXT_PUBLIC_API_URL` if your backend runs on a different URL.

3. **Start development server**:

   ```bash
   bun run dev
   # or
   npm run dev
   ```

   The app will be available at `http://localhost:3000` by default.

## Usage

### Authentication Flow

1. **Register** - Go to `/auth/register` to create a new account
2. **Login** - Go to `/auth/login` with your credentials
3. **Access Dashboard** - After login, you'll be redirected to the dashboard

Access tokens are stored in localStorage and automatically refreshed when expired.

### Features Usage

#### Dashboard

- View balance, income, and expense KPIs
- See expense breakdown by category (pie chart)
- Monitor income vs expense trends
- View recent transactions
- Quick access to active budgets

#### Transactions

- **View** - List all transactions with pagination (20 per page)
- **Filter** - By type (income/expense/transfer), date range
- **Create** - Click "New Transaction" button
- **Edit** - Click on a transaction to edit (coming soon)
- **Delete** - Remove transactions with confirmation

#### Budgets

- **View** - Grid view of all budgets
- **Create** - Click "New Budget" to set spending limits
- **Monitor** - Progress bars show spending vs limits
- **Edit** - Click edit icon on budget card
- **Delete** - Remove budgets with confirmation

#### Settings

- **Profile** - Update first/last name
- **Notifications** - Toggle notification preferences
- **Preferences** - Currency and theme selection
- **Security** - Change password (link provided)

## API Integration

The frontend communicates with the backend API at `/api/v1/` with the following endpoints:

### Auth Endpoints

- `POST /auth/v1/register` - Register new user
- `POST /auth/v1/login` - Login user
- `POST /auth/v1/logout` - Logout user
- `GET /auth/v1/me` - Get current user profile
- `PATCH /auth/v1/me` - Update profile
- `POST /auth/v1/refresh` - Refresh access token

### Transaction Endpoints

- `GET /transactions/v1` - List transactions (paginated, filterable)
- `POST /transactions/v1` - Create transaction
- `GET /transactions/v1/:id` - Get transaction details
- `PATCH /transactions/v1/:id` - Update transaction
- `DELETE /transactions/v1/:id` - Delete transaction
- `GET /transactions/v1/summary` - Get transaction summary

### Category Endpoints

- `GET /categories/v1` - List categories
- `POST /categories/v1` - Create category

### Budget Endpoints

- `GET /budgets/v1` - List budgets
- `POST /budgets/v1` - Create budget
- `GET /budgets/v1/:id` - Get budget details
- `PATCH /budgets/v1/:id` - Update budget
- `DELETE /budgets/v1/:id` - Delete budget

## State Management

### Zustand Stores

**Auth Store** (`useAuthStore`):

```typescript
{
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login(email, password);
  register(email, firstName, lastName, password);
  logout();
  fetchUser();
  updateUser(data);
}
```

**UI Store** (`useUiStore`):

```typescript
{
  isDialogOpen: boolean;
  openDialog();
  closeDialog();
  isSidebarCollapsed: boolean;
  toggleSidebar();
}
```

### React Query Hooks

All data fetching is managed through React Query for automatic caching, refetching, and synchronization.

**Transactions**:

- `useTransactions(page, pageSize, filters)` - Fetch transactions
- `useTransaction(id)` - Fetch single transaction
- `useCreateTransaction()` - Create mutation
- `useUpdateTransaction()` - Update mutation
- `useDeleteTransaction()` - Delete mutation
- `useTransactionSummary(startDate, endDate)` - Get summary

**Categories**:

- `useCategories(type)` - List categories by type

**Budgets**:

- `useBudgets()` - List all budgets
- `useBudget(id)` - Get single budget
- `useCreateBudget()` - Create mutation
- `useUpdateBudget()` - Update mutation
- `useDeleteBudget()` - Delete mutation

## Building for Production

```bash
bun run build
# or
npm run build
```

Then start the production server:

```bash
bun run start
# or
npm start
```

## Environment Variables

| Variable              | Description     | Default                     |
| --------------------- | --------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Development Tips

1. **Hot Reload** - Changes to files automatically refresh the page
2. **Browser DevTools** - React DevTools extension available for debugging
3. **API Testing** - Use the Postman collection from backend for testing endpoints independently
4. **Type Safety** - TypeScript provides autocomplete and type checking
5. **Component Composition** - Components are small and reusable; check `components/ui/` and `components/cards/` for examples

## Troubleshooting

### API Connection Issues

If you see "Connection refused" errors:

1. Verify backend is running on port 3000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure backend .env has correct DATABASE_URL
4. Run `bun run db:migrate` in backend to ensure DB is ready

### Authentication Issues

- **Token expired**: Refresh token should auto-renew; check browser console
- **Login fails**: Verify credentials in Postman first
- **Session lost**: Check if localStorage is enabled in browser

### UI Components Not Displaying

- Verify TailwindCSS classes are generated: `npm run build`
- Check browser console for CSS load errors
- Ensure shadcn/ui components are imported correctly

## Contributing

1. Follow the component structure in `components/`
2. Use TypeScript for type safety
3. Implement hooks in `lib/hooks.ts`
4. Add API methods to `lib/api.ts`
5. Use Zustand for UI state, React Query for server state

## License

This project is part of the FinanceApp - a complete personal finance dashboard.

## Next Steps

- [ ] Email notifications on budget alerts
- [ ] Export transactions to CSV
- [ ] Multi-currency support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and insights
- [ ] Budget analytics and forecasting
- [ ] Receipt attachment system
