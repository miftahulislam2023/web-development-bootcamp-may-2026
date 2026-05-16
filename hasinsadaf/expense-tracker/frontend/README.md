# FinanceFlow Frontend

A modern, responsive web application for personal finance management and expense tracking. Built with Next.js 16, React 19, Tailwind CSS v4, and Radix UI components for a polished, accessible user experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Project Structure](#project-structure)
- [Styling & Design System](#styling--design-system)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Performance](#performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 📊 Overview

FinanceFlow is a modern personal finance management application that helps users track expenses, manage budgets, and visualize their spending patterns. The frontend provides an intuitive, user-friendly interface with comprehensive financial insights and data visualization.

### Key Capabilities

- **Dashboard**: Real-time financial overview with key metrics
- **Expense Tracking**: Easy expense recording with categorization
- **Budget Management**: Set and monitor monthly spending limits
- **Analytics**: Visual spending trends and category distribution
- **User Management**: Secure authentication and profile management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Built-in dark theme support

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.6 | React framework & routing |
| React | 19.2.4 | UI library |
| Tailwind CSS | 4 | Utility-first CSS framework |
| Radix UI | Latest | Headless component library |
| React Hot Toast | 2.6.0 | Toast notifications |
| Recharts | 3.8.1 | Data visualization |
| ESLint | 9 | Code quality & linting |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Backend API**: Running backend server (see [Backend README](../backend/README.md))

Verify installations:
```bash
node --version    # Should be v18.0.0+
npm --version     # Should be v9.0.0+
git --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your backend URL:

```env
# Backend API URL (must match your backend server)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL | ✅ Yes |

### Backend API Connection

The frontend connects to the backend API using the `NEXT_PUBLIC_BACKEND_URL` environment variable. Ensure the backend is running before starting the frontend.

**Local Development:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Production:**
```env
NEXT_PUBLIC_BACKEND_URL=https://api.financeflow.com
```

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

Opens at `http://localhost:3000`

Hot reload enabled - changes update instantly without refresh.

### Production Build

```bash
npm run build
npm start
```

### Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint -- --fix
```

## ✨ Features

### 🏠 Dashboard
- **Summary Cards**: Total expenses, transaction count, top category, average transaction
- **Budget Alerts**: Visual alerts when budgets exceed thresholds
- **Recent Transactions**: Latest 5 expenses at a glance
- **Budget Overview**: Category-wise spending vs. limits
- **Charts**: Monthly spending trends and category distribution
- **Right Panel**: Detailed breakdowns for each metric

### 💰 Expenses
- **Add Expenses**: Quick expense recording with category selection
- **Expense List**: Sortable, paginated list of all expenses
- **Search & Filter**: Find expenses by date, category, or amount
- **Edit/Delete**: Modify or remove existing expenses
- **Confirmation Dialogs**: Prevent accidental deletions
- **Date Filtering**: View expenses by month or date range

### 🎯 Budget Management
- **Set Budgets**: Define monthly spending limits per category
- **Budget Tracking**: Visual progress bars showing spend vs. limit
- **Status Badges**: "On Track", "Near Limit", "Over Budget" indicators
- **Upsert Logic**: Update or create budgets automatically
- **Budget History**: View and manage multiple budget periods
- **Delete Budgets**: Remove old or unnecessary budget limits

### 👤 Profile Management
- **View Profile**: See user information and account details
- **Edit Profile**: Update display name and personal information
- **Account Info**: View member since date and account status
- **Dropdown Menu**: Quick access to profile and logout

### 🌓 Theme Management
- **Light/Dark Mode**: Toggle between themes
- **Persistent Theme**: Theme preference saved locally
- **System Preference**: Respects OS dark mode setting
- **CSS Variables**: Dynamic theme switching

### 📊 Analytics & Insights
- **Monthly Spending Trends**: Line chart of spending over time
- **Category Distribution**: Pie chart showing expense breakdown
- **Spending Metrics**: Average transaction, total, and counts
- **Category Leaders**: Identify top spending categories
- **Budget Compliance**: Track budget adherence

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
├── src/
│   ├── app/
│   │   ├── api/                     # Optional: Client-side API layer
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   ├── register/
│   │   │   │   └── page.jsx
│   │   │   └── change-password/
│   │   │       └── page.jsx
│   │   ├── dashboard/
│   │   │   └── page.jsx             # Main dashboard
│   │   ├── expenses/
│   │   │   └── page.jsx             # Expense management
│   │   ├── budget/
│   │   │   └── page.jsx             # Budget management
│   │   ├── profile/
│   │   │   └── page.jsx             # User profile
│   │   ├── layout.jsx               # Root layout
│   │   ├── page.jsx                 # Home page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── Navbar.jsx               # Sidebar navigation
│   │   ├── ThemeToggle.jsx          # Dark mode toggle
│   │   ├── LoadingSpinner.jsx       # Loading state
│   │   ├── ErrorMessage.jsx         # Error display
│   │   ├── CategoryChart.jsx        # Pie chart for categories
│   │   ├── MonthlyChart.jsx         # Line chart for trends
│   │   ├── ExpenseForm.jsx          # Expense form
│   │   ├── ExpenseList.jsx          # Expenses table
│   │   ├── Pagination.jsx           # Table pagination
│   │   ├── SortableHeader.jsx       # Sortable column headers
│   │   ├── ProfilePanel.jsx         # Profile sidebar panel
│   │   ├── RightPanel.jsx           # Right sidebar container
│   │   ├── ChangePasswordForm.jsx   # Password change form
│   │   └── Other components...
│   └── lib/
│       ├── api.js                   # API helper functions
│       ├── theme.js                 # Theme utilities
│       └── Other utilities...
├── next.config.mjs                  # Next.js configuration
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.mjs               # PostCSS configuration
├── package.json
└── .env.local
```

## 🎨 Styling & Design System

### Tailwind CSS v4

The project uses Tailwind CSS v4 for utility-first styling:

- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Built-in light/dark theme support
- **Custom Colors**: Extended color palette for finance app
- **Typography**: Optimized fonts and sizes
- **Spacing**: Consistent 4px grid system

### CSS Variables

Dynamic theming through CSS variables:

```css
--bg: Main background color
--bg-surface: Surface background (cards, panels)
--border: Border color
--text-primary: Main text color
--text-secondary: Secondary text color
--color-primary: Primary brand color
--color-danger: Danger/error color
--color-warning: Warning color
```

### Component Styling

Components use className-based Tailwind utilities:

```jsx
<button className="btn btn-primary flex items-center gap-2">
  <Icon /> Action
</button>
```

Reusable classes defined in globals.css:
- `.btn` - Button base styles
- `.btn-primary` - Primary button variant
- `.btn-danger` - Danger button variant
- `.card` - Card container
- `.input` - Form input
- `.label` - Form label

## 🔄 State Management

### React Hooks

Uses React hooks for component state:

- **useState**: Local component state
- **useEffect**: Side effects (API calls, event listeners)
- **useCallback**: Memoized callbacks
- **useMemo**: Memoized values

### Context API

Global state for:
- Theme preference
- User authentication
- Loading states

### Custom Hooks

Reusable logic:
- `useAuth()` - Authentication state
- `useTheme()` - Theme switching
- `useFetch()` - Data fetching

## 🔗 API Integration

### API Layer

Centralized API functions in `lib/api.js`:

```javascript
// Authentication
export async function loginUser(email, password)
export async function registerUser(name, email, password)
export async function changePassword(oldPassword, newPassword)

// Profile
export async function getProfile()
export async function updateProfile(data)

// Expenses
export async function getExpenses()
export async function createExpense(data)
export async function updateExpense(id, data)
export async function deleteExpense(id)

// Categories
export async function getCategories()

// Budgets
export async function getBudgets()
export async function saveBudget(data)
export async function updateBudget(id, data)
export async function deleteBudget(id)
```

### Error Handling

Centralized error handling with user-friendly messages:

```javascript
async function requireOk(res, fallback) {
  if (res.ok) return;
  if (res.status === 401) clearToken(); // Redirect to login
  const msg = await readErrorMessage(res, fallback);
  throw new Error(msg);
}
```

### Authentication Tokens

JWT token management:

```javascript
// Get token from cookie/localStorage
function getToken() { ... }

// Save token after login
function saveToken(token) { ... }

// Clear token on logout
function clearToken() { ... }

// Automatically add to API requests
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}
```

## ⚡ Performance

### Optimizations

✅ **Code Splitting**
- Route-based code splitting with Next.js
- Components loaded on-demand

✅ **Image Optimization**
- Automatic image optimization
- Responsive image serving

✅ **Caching**
- Browser caching for static assets
- HTTP caching headers

✅ **Lazy Loading**
- Lazy component loading
- Intersection Observer for visibility

✅ **Memoization**
- React.memo for component memoization
- useMemo for expensive computations

✅ **Bundle Size**
- Tree shaking for unused code
- Minification in production

### Lighthouse Scores Target

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 🚢 Deployment

### Deployment Options

#### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

Benefits:
- Zero-config deployment
- Automatic CI/CD
- Global CDN
- Preview deployments

#### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### Option 3: Traditional Hosting

```bash
# Build
npm run build

# Output in .next directory ready to serve
# Deploy to your hosting with appropriate Node.js support
```

#### Option 4: Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package* ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup for Production

```env
NEXT_PUBLIC_BACKEND_URL=https://api.financeflow.com
NODE_ENV=production
```

### Pre-deployment Checklist

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] Build completes without errors (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Test locally with production build
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] API rate limiting in place
- [ ] Analytics/monitoring set up

## 👥 Contributing

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Install and start**
   ```bash
   npm install
   npm run dev
   ```

3. **Make changes** and test

4. **Run linter**
   ```bash
   npm run lint -- --fix
   ```

5. **Commit**
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guide

- Use functional components with hooks
- camelCase for variables and functions
- PascalCase for components and classes
- Descriptive names (avoid `a`, `b`, `temp`)
- Add JSDoc comments for complex functions
- Max line length: 100 characters
- Use const by default, let for reassignment

### Component Structure

```jsx
'use client'; // Mark as client component if needed

import { useState, useEffect } from 'react';
import { Icon } from '@radix-ui/react-icons';

/**
 * Component description
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Setup
  }, []);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Connection Error
```
Failed to fetch from backend
```

**Solution:**
- Ensure backend is running (`npm run dev` in backend directory)
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Verify backend port (default: 3001)

#### 2. Authentication Not Working
```
401 Unauthorized error
```

**Solution:**
- Clear browser cookies
- Logout and login again
- Check JWT token in browser DevTools Storage
- Verify backend JWT_SECRET is configured

#### 3. Styling Issues (Tailwind not applying)
```
Classes not showing styles
```

**Solution:**
```bash
# Rebuild Tailwind
npm run build

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### 4. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3002
```

#### 5. Module Not Found Errors
```
Module not found: Can't resolve '@/components/Component'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear cache
rm -rf .next
npm run dev
```

### Debugging

#### Browser DevTools

1. Open DevTools (F12)
2. Network tab: Check API requests
3. Application tab: Check tokens and storage
4. Console tab: Check for errors

#### Enable Verbose Logging

```bash
DEBUG=* npm run dev
```

#### Check Network Requests

```bash
curl -i -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/expenses
```

## 📊 Performance Metrics

Monitor performance with:

- **Lighthouse**: Built into Chrome DevTools
- **Web Vitals**: Next.js automatically tracks
- **Sentry**: Error tracking and monitoring
- **Vercel Analytics**: If deployed to Vercel

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Radix UI](https://radix-ui.com) - Component library
- [Recharts](https://recharts.org) - Charting library
- [React Hot Toast](https://react-hot-toast.com) - Notifications

---

**Last Updated**: May 16, 2026
**Version**: 1.0.0
**Status**: Production Ready
