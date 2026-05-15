# Personal Expense Tracker

A full-stack personal expense tracking application built with Next.js 15, featuring user authentication, income/expense management, monthly statistics, and interactive charts.

## Live Demo

[Add your deployed URL here]

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router for server-side rendering and routing
- **React 18** - UI library for building component-based interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Chart.js & react-chartjs-2** - Interactive data visualization for financial charts
- **date-fns** - Modern date utility library for formatting and manipulation

### Backend
- **Next.js API Routes** - Serverless API endpoints for backend logic
- **Prisma ORM** - Type-safe database client and schema management
- **PostgreSQL (NeonDB)** - Cloud-based relational database

### Authentication
- **bcryptjs** - Password hashing for secure storage
- **jsonwebtoken (JWT)** - Token-based authentication
- **cookie** - HTTP cookie management for session handling

### Development Tools
- **TypeScript** - Static type checking
- **Turbopack** - Fast development server (Next.js 16+)

## Core Features

### 1. User Authentication System
- **Registration**: Users can create accounts with name, email, and password
- **Login**: Secure authentication with JWT tokens stored in HTTP-only cookies
- **Profile Management**: Users can update their display name
- **Protected Routes**: Middleware/proxy guards authenticated pages

**Implementation Details:**
- Passwords are hashed using bcryptjs before storing in database
- JWT tokens are generated upon login/registration and stored in HTTP-only cookies
- Proxy middleware checks for valid tokens before allowing access to protected routes
- API routes validate user sessions before processing requests

### 2. Income Management
- **Add Income**: Record income with amount, source, and date
- **Edit Income**: Modify existing income records
- **Delete Income**: Remove income entries
- **Monthly Filtering**: View income by specific month/year or custom date ranges

**Implementation Details:**
- Income data is stored in PostgreSQL with user association
- Prisma ORM handles database operations with type safety
- API endpoints support CRUD operations with session validation
- Each income record is linked to the authenticated user via userId

### 3. Expense Management
- **Add Expense**: Record expenses with amount, description, category, and date
- **Edit Expense**: Modify expense details
- **Delete Expense**: Remove expense entries
- **Category Management**: Users can create custom categories
- **Monthly Filtering**: Filter expenses by month/year or date ranges

**Implementation Details:**
- Categories are stored in a separate table and can be dynamically created
- Expenses include category field for better organization
- API endpoints support filtering by date ranges and categories
- Real-time updates after CRUD operations

### 4. Dashboard Analytics
- **Total Income**: Sum of all income for selected period
- **Total Expenses**: Sum of all expenses for selected period
- **Remaining Balance**: Income minus expenses calculation
- **Average Expense**: Average expense per transaction
- **Filter Options**: Month/Year or custom date range filtering

**Implementation Details:**
- Dashboard components use React hooks (useState, useEffect, useMemo)
- Real-time calculations update when filters change
- Data is fetched from API endpoints and processed client-side
- Optimized re-renders with useMemo to prevent unnecessary calculations

### 5. Monthly Statistics Page
- **Bar Chart**: Visual comparison of income, expenses, and savings by month
- **Line Chart**: Trend visualization with interactive points
- **Yearly Summary**: Total income, expenses, and savings for selected year
- **Monthly Breakdown**: Detailed income and expense overview by month
- **Savings Tracking**: Monthly savings calculation (Income - Expenses)
- **Filter Options**: Month/Year or custom date range

**Implementation Details:**
- Chart.js library provides interactive and responsive charts
- Two chart types (bar and line) with toggle functionality
- Data is processed monthly using JavaScript date methods
- Charts update dynamically when filters change
- Custom tooltips show exact values in BDT currency

### 6. Data Filtering System
- **Month/Year Filter**: Select specific month and year
- **Date Range Filter**: Custom start and end dates
- **Real-time Updates**: All components update when filters change

**Implementation Details:**
- Filters are managed with React state
- Data filtering happens client-side for immediate feedback
- Memoized calculations prevent performance issues
- Consistent filter experience across dashboard and stats pages

### 7. Responsive Design
- **Professional Color Scheme**: Gradient backgrounds with modern design
- **Mobile-Friendly**: Responsive layout that works on all screen sizes
- **Clean UI**: White cards with subtle shadows for content separation

**Implementation Details:**
- CSS-in-JS with inline styles for component-specific styling
- Flexbox and Grid layouts for responsive design
- Consistent button and input styling across all pages
- Hover effects and transitions for better user experience

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  expenses  Expense[]
  incomes   Income[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}