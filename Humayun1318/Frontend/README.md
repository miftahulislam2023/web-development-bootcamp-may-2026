# 💸 Personal Expense Tracker — Frontend

A modern, full-featured **personal finance management application** built with React 19 and TypeScript. It allows users to track income, expenses, and recurring transactions through an intuitive dashboard, while providing administrators with powerful tools to manage users, monitor the system, and control scheduled automation jobs.

> Built for individuals who want full visibility and control over their financial life — with a clean UI, role-based access, and smart automation under the hood.

---

## 🌐 Live Demo

```
Live URL: https://finance-tracking-client.vercel.app
Backend: https://expense-tracker-lemon-mu-31.vercel.app/api/v1
```

---

## ✨ Features at a Glance

### 🔐 Authentication
- 📧 Email & password login with JWT
- 🔑 Google OAuth login integration
- 🛡️ Role-based access control (Admin / User)
- ✅ Account verification status tracking
- 🔒 Protected routes with role guards

### 💰 User Dashboard
- 📊 Overview with income / expense / balance summary from API
- 🍩 Spending breakdown by category (charts)
- 📋 Full transaction management (create, edit, delete)
- 🔁 Recurring transaction management
- 🗂️ Category management (income & expense)
- 👤 Profile view & update (name, avatar URL)
- 🔐 Password change / set password (Google users)
- ⚙️ Account settings (delete account with confirmation)

### 🛠️ Admin Panel
- 📈 Analytics dashboard with user statistics
- 👥 All users table with search, filter by role & status
- 🎛️ Manage individual users (suspend / ban / activate)
- ⚙️ Manual cron job trigger with live result tracking
- 📦 Cron stats: total processed, created, failed

### 🔄 Automation & System
- ⏰ Recurring transaction system (daily / weekly / monthly / yearly)
- 🤖 Automated cron job that processes due recurrences daily
- 🛠️ Admin manual trigger with idempotent safety (no duplicate creation)

### 🎨 UI / UX
- 🌙 Dark / light theme toggle
- 📱 Fully responsive (mobile-first design)
- 🧩 Modular component architecture
- 🔔 Real-time toast notifications (Sonner)
- ♿ Accessible UI via Radix UI primitives
- 🔍 Table search, filter, and pagination across all main pages

---

## 🖼️ Screenshots

> Screenshots coming soon.

---

## 🧰 Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | Radix UI (shadcn/ui) |
| Icons | Lucide React |
| State Management | Redux Toolkit + RTK Query |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Notifications | Sonner |
| Theme | next-themes |

### Backend (separate repo)
| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Google OAuth |
| Scheduler | Node-cron |
| Validation | Zod |

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** v18+ or **Bun** v1+
- **npm**, **yarn**, or **bun**
- **Backend API** running locally or deployed
- A **Google OAuth** client ID (if using Google login)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Humayun1318/web-development-bootcamp-may-2026.git
cd Frontend
```

### 2. Install dependencies

```bash
# Using npm
npm install

# Using bun
bun install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your values (see Environment Setup below).

### 4. Start the development server

```bash
npm run dev
or bun run dev
```

The app will be running at `http://localhost:5173`

---

## 🔧 Environment Setup

Create a `.env` file in the root of the project:

```env
VITE_BASE_URL=http://localhost:5000/api/v1
```

### `.env.example`

```env
# Backend API base URL
# Local development
VITE_BASE_URL=http://localhost:5000/api/v1

# Production
# VITE_BASE_URL=https://your-backend-domain.com/api/v1
```

> ⚠️ The backend must be running and accessible at the `VITE_BASE_URL` for the app to work correctly.

---

## 📜 Available Scripts

```bash
# Start development server (hot reload)
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Run ESLint checks
bun run lint

```

---

## 📁 Project Structure

```
Frontend/
├── public/                           # Static public assets
└── src/
    ├── assets/                       # Icons, images, SVGs
    │
    ├── components/                   # Reusable shared components
    │   ├── layout/                   # Layout wrappers
    │   │   ├── AuthLayout.tsx        # Layout for auth pages
    │   │   ├── CommonLayout.tsx      # Shared base layout
    │   │   ├── DashboardLayout.tsx   # Dashboard shell (sidebar + content)
    │   │   └── ModeToggler.tsx       # Dark / light theme toggle button
    │   ├── modules/                  # Feature UI modules
    │   │   ├── Authentication/       # Login, Register forms
    │   │   └── dashboard/
    │   │       ├── admin/            # Admin-specific modules
    │   │       │   ├── analytics/    # StatCard, AnalyticsPage module
    │   │       │   ├── users/        # UsersTable, UsersFilters, UserActionModal
    │   │       │   └── cron/         # CronJobPage module
    │   │       └── user/             # User-specific modules
    │   │           ├── category/     # CategoryTable, AddEditCategoryModal, DeleteModal
    │   │           ├── insight/      # Financial insight components
    │   │           ├── overview/     # Dashboard overview / charts
    │   │           ├── privacy/      # ChangePasswordForm, SetPasswordForm
    │   │           ├── profile/      # ProfileInfoCard, UpdateProfileForm
    │   │           ├── recurring/    # RecurringTable, Modals, Filters
    │   │           └── transaction/  # TransactionTable, Modals, Filters, RecurringFormFields
    │   │   └── DashboardNavbar.tsx   # Top navbar for dashboard
    │   ├── HomePage/                 # Landing / home page components
    │   └── ui/                       # Base UI primitives (shadcn/ui)
    │       ├── app-sidebar.tsx       # Application sidebar component
    │       ├── Loading.tsx           # Global loading spinner
    │       └── ReusablePagination.tsx # Shared pagination used across all tables
    │
    ├── config/                       # App-level config (base URL, env vars)
    ├── constants/                    # Role enums, fixed app constants
    ├── context/                      # React Context providers (User, Theme)
    ├── hooks/                        # Custom hooks (useUser, useTheme)
    │
    ├── lib/                          # Core service layer
    │   ├── axios.ts                  # Axios instance with interceptors
    │   └── utils.ts                  # Shared utility functions
    │
    ├── pages/                        # Route-level page components
    │   ├── dashboard/
    │   │   ├── Admin/
    │   │   │   ├── AllUsersPage.tsx
    │   │   │   ├── AnalyticsPage.tsx
    │   │   │   └── CronJobPage.tsx
    │   │   └── User/
    │   │       ├── CategoryPage.tsx
    │   │       ├── InsightPage.tsx
    │   │       ├── Overview.tsx
    │   │       ├── PrivacyPage.tsx
    │   │       ├── ProfilePage.tsx
    │   │       ├── RecurringPage.tsx
    │   │       ├── SettingsPage.tsx
    │   │       └── TransactionPage.tsx
    │   ├── Homepage.tsx
    │   ├── Login.tsx
    │   ├── NotFoundPage.tsx
    │   ├── Register.tsx
    │   └── UnauthorizedPage.tsx
    │
    ├── providers/                    # App-level providers (Redux, Theme, etc.)
    │
    ├── redux/                        # State management
    │   ├── features/
    │   │   ├── admin/                # admin.api.ts
    │   │   ├── auth/                 # auth.api.ts
    │   │   ├── category/             # category.api.ts
    │   │   ├── recurring/            # recurring.api.ts
    │   │   ├── transactions/         # transaction.api.ts
    │   │   └── user/                 # user.api.ts
    │   ├── axiosBaseQuery.ts         # RTK Query base query with Axios
    │   ├── baseApi.ts                # Root API slice definition
    │   ├── hook.ts                   # Typed Redux hooks (useAppDispatch, useAppSelector)
    │   └── store.ts                  # Redux store configuration
    │
    ├── routes/                       # Route configuration & guards
    ├── types/                        # Global TypeScript type definitions
    ├── utils/                        # Helper / formatting functions
    │
    ├── App.tsx                       # Root app component with router
    ├── index.css                     # Global styles + Tailwind directives
    ├── main.tsx                      # App entry point
    └── vite-env.d.ts                 # Vite environment type declarations
```

---

## 🗺️ Routing Structure

```
/                          → Landing / redirect
/login                     → Login page (email + Google)
/register                  → Registration page

/user/                     → User dashboard layout (protected)
  dashboard                → Overview: charts, summary, spending
  transactions             → Transaction list (CRUD + filters)
  recurrences              → Recurring schedules (CRUD + filters)
  categories               → Category management (CRUD)
  profile                  → Profile view + update
  privacy                  → Change / set password
  settings                 → Account settings (delete)

/admin/                    → Admin layout (protected, admin only)
  analytics                → System analytics dashboard
  all-users                → User management table
  cron-job                 → Manual cron job trigger

/404                       → Not found page
/unauthorized              → Unauthorized access page
```

---

## 🧩 Feature Breakdown

### 🔐 A. Authentication

The auth system supports two login methods:

- **Email & Password** — standard JWT-based authentication
- **Google OAuth** — users can sign in with their Google account

After login, the backend returns a JWT which is stored and sent with every subsequent API request via Axios interceptors.

Role-based route protection works as follows:
- `/user/*` routes → accessible to users with role `"user"`
- `/admin/*` routes → accessible only to users with role `"admin"`
- Unauthorized access → redirected to `/unauthorized`

Google-only users (no local password) see a **"Set Password"** section in the Privacy page instead of "Change Password," allowing them to add email/password login to their account.

---

### 💰 B. User Dashboard

#### Overview Page
- Income, expense, and current balance fetched from the API
- Visual charts for spending category breakdown
- Quick summary cards

#### Transaction Management
- Full CRUD with a clean table UI
- Columns: Category, Type, Amount, Date, Payment Method, Tags, Recurring badge, Actions
- **Filters:** search, type (income/expense), category, payment method, date range
- **Sorting:** by date or amount (asc/desc)
- **Pagination:** reusable component used across all tables
- Create a transaction and optionally make it recurring simultaneously
- When "Make Recurring" is checked, a second API call creates the recurrence schedule automatically

#### Category Management
- Manage income and expense categories
- System categories (created by admin/seed) are differentiated from user-created ones
- Color picker for custom category colors
- Badges for type (income = green, expense = red) and source (System / Custom)

#### Recurring Transaction Management
- Separate management page for recurring schedules
- Each recurrence document drives automatic transaction creation via cron job
- Fields: frequency (daily/weekly/monthly/yearly), interval, nextDueDate, endDate
- Active/inactive status management

#### Profile Management
- View all user info: name, email, role, status, verified state, timezone, currency, login method
- Update name and avatar URL
- Currency shown as **read-only** — changing it would affect display of all past transactions

#### Privacy & Security
- **Local users:** Change password form (current + new + confirm)
- **Google-only users:** Set password form (new + confirm + info notice)
- Auth provider auto-detected from `user.auths` array

#### Account Settings
- Delete account with email confirmation guard
- User must type their email address to enable the delete button

---

### 🛠️ C. Admin Panel

#### Analytics Dashboard
Summary stat cards showing:
- Total users
- Active users
- Suspended users
- Banned users
- Total admins
- System status (healthy / warning / error)

#### All Users Management
- Full table of all registered users
- **Filters:** search by name or email, filter by role, filter by status
- **Columns:** Avatar, Name, Email, Role, Status (with colored badges), Joined date, Manage button
- **Manage Modal:** View full user details + update status (active / suspended / banned)
- Pagination with the shared `ReusablePagination` component

#### Cron Job Control
- Manual trigger button for the recurring transaction processor
- Displays live result after each run:
  - ✅ Processed count
  - ✅ Created count
  - ❌ Failed count
- Safe to run multiple times — already-processed recurrences are skipped
- Use case: recover from a missed or failed scheduled job

---

### 🔄 D. Recurring Transaction System

The system has its own `Recurring` collection in the database. Each document represents a scheduled pattern:

```
Recurring {
  categoryId, type, amount, paymentMethod,
  frequency, interval, nextDueDate, endDate,
  isActive
}
```

The **cron job** runs daily and:
1. Finds all active recurrences where `nextDueDate <= today`
2. Creates a `Transaction` for each
3. Advances `nextDueDate` by `interval × frequency`

Admins can manually trigger this process from the Cron Job page if the scheduler was missed.

---

## 🔌 API Integration

All API calls are made using **RTK Query** with Axios as the base client.

```ts
// src/config/index.ts
const config = {
  baseUrl: import.meta.env.VITE_BASE_URL,
};
```

### Authentication Flow
1. User logs in → backend returns JWT token
2. Token stored (cookie / localStorage)
3. Axios interceptor attaches token to every request header
4. On 401 response → user redirected to login

### RTK Query Features Used
- Automatic caching and cache invalidation
- `providesTags` / `invalidatesTags` for keeping data fresh after mutations
- Loading and error states out of the box
- No manual `useEffect` data fetching

---

## 🗃️ State Management

| Layer | Tool | Purpose |
|---|---|---|
| Server state | RTK Query | API data fetching, caching, mutations |
| Global store | Redux Toolkit | Store configuration |
| Auth/User data | React Context + `useUser` hook | Access user info anywhere |
| Theme | React Context + `useTheme` hook | Dark/light mode toggle |
| Form state | React Hook Form | Controlled form fields |
| UI state | Local `useState` | Modals, pagination, filters |

---

## ✅ Form Validation

All forms use **React Hook Form** + **Zod** following a consistent pattern:

```ts
const schema = z.object({
  name: z.string().min(3, "Name too short"),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Must be > 0"),
});

const form = useForm({ resolver: zodResolver(schema) });
```

- Validation runs on submit and on blur
- Errors shown inline under each field via `<FormMessage />`
- All schemas live in dedicated `*.schema.ts` files where applicable

---

## 🎨 Styling Approach

- **Tailwind CSS** utility-first for all styles
- **shadcn/ui** component library (built on Radix UI primitives)
- **Dark mode** via `next-themes` — toggled globally
- Consistent design tokens: spacing, border radius, color palette
- All form inputs share the same `h-9 w-full` sizing for visual consistency
- Mobile-first responsive breakpoints throughout

---

## ⚡ Performance Optimizations

- **Code splitting** with `React.lazy` + `Suspense` for route-level components
- **RTK Query caching** — avoids redundant API calls for same data
- **Pagination** on all data-heavy tables — no large list rendering
- Selective re-renders with proper Redux selector usage
- Vite's fast HMR during development
- Production build outputs to `dist/` with tree-shaking and minification

---

## 🚢 Deployment

Build the project for production:

```bash
bun run build
```

The output will be in the `dist/` folder. Deploy it to any static hosting platform:

| Platform | Notes |
|---|---|
| **Vercel** | Recommended — automatic CI/CD from GitHub |
| **Netlify** | Drag and drop `dist/` or connect repo |
| **Render** | Use static site deployment |

> ⚠️ **Important:** Set `VITE_BASE_URL` as an environment variable in your deployment platform. The backend API must be running and accessible from the deployed frontend domain.

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| `VITE_BASE_URL is undefined` | Make sure `.env` file exists and variable starts with `VITE_` |
| CORS errors in browser | Configure CORS on backend to allow your frontend domain |
| Google login not working | Verify Google OAuth client ID and redirect URIs are set correctly |
| Port 5173 already in use | Run `npx kill-port 5173` or change port in `vite.config.ts` |
| Node version mismatch | Use `nvm use 18` or check `.nvmrc` if present |
| RTK Query not refreshing | Check `invalidatesTags` in mutation matches `providesTags` in query |
| Blank page after build | Check `base` option in `vite.config.ts` if deployed to a subdirectory |

---

## 🏗️ Best Practices Implemented

- ✅ **TypeScript strict mode** — full type safety across the codebase
- ✅ **Feature-based modular architecture** — each feature owns its files
- ✅ **Zod + React Hook Form** — type-safe, validated forms everywhere
- ✅ **RTK Query** — smart server state caching and invalidation
- ✅ **Reusable components** — `ReusablePagination`, `StatCard`, shared modals
- ✅ **Role-based route protection** — admin and user routes fully guarded
- ✅ **Accessible UI** — Radix UI primitives with proper ARIA attributes
- ✅ **Consistent form sizing** — `h-9 w-full` across all inputs and selects
- ✅ **Error handling** — toast notifications for all API success/failure states
- ✅ **Responsive design** — mobile-first layout throughout

---

## 🧪 Testing

| Type | Current Status |
|---|---|
| TypeScript | ✅ Strict mode enabled |
| Linting | ✅ ESLint configured |
| Unit Tests | 🔲 Recommended: Jest + React Testing Library |
| Integration Tests | 🔲 Recommended: MSW for API mocking |
| E2E Tests | 🔲 Recommended: Playwright or Cypress |

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: add your feature description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Open a Pull Request on GitHub
```

Please follow the existing code style — ESLint will catch most issues.

---

## 🔗 Useful Links

| Resource | Link |
|---|---|
| React Docs | https://react.dev |
| Tailwind CSS | https://tailwindcss.com/docs |
| Redux Toolkit | https://redux-toolkit.js.org |
| RTK Query | https://redux-toolkit.js.org/rtk-query/overview |
| React Router v7 | https://reactrouter.com |
| React Hook Form | https://react-hook-form.com |
| Zod | https://zod.dev |
| shadcn/ui | https://ui.shadcn.com |
| Radix UI | https://www.radix-ui.com |
| Lucide Icons | https://lucide.dev |
| Sonner | https://sonner.emilkowal.ski |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for personal or commercial projects.

---

## 🙋 Support

- **Found a bug?** Open an issue on GitHub
- **Feature request?** Open a discussion or issue with the `enhancement` label
- **Questions?** Reach out via GitHub issues

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful, accessible component system
- [Radix UI](https://www.radix-ui.com) for the unstyled primitive components
- [Vercel](https://vercel.com) for seamless deployment
- All open-source contributors whose libraries made this project possible

---

## Author

**Humayun Kabir**

---