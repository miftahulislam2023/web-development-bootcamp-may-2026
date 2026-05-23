# 💰 Cashnivo - Personal Finance Tracker

<div align="center">

![Cashnivo Logo](public/logo.png)

**A modern, intuitive expense tracking application that helps you take control of your finances**

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.13.0-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.5.19-5A0EF8?style=flat&logo=daisyui&logoColor=white)](https://daisyui.com/)

<div align="center">
<a href="https://expensetracker-2ab95.web.app/" target="_blank">

![Live Demo](https://img.shields.io/badge/CASHNIVO-LIVE%20DEMO-6366F1?style=for-the-badge&logo=firefox-browser&logoColor=white&labelColor=111827)

</a>
</div>


</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Software Architecture](#software-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

**Cashnivo** is a comprehensive personal finance management application designed to help individuals track their income and expenses effortlessly. Built with modern web technologies, it provides an intuitive dashboard with real-time insights into your financial health, customizable categories, and detailed transaction history.

### Why Cashnivo?

- **Simple & Intuitive**: Clean, modern interface that makes financial tracking effortless
- **Real-time Insights**: Instant visualization of your spending patterns and savings rate
- **Fully Customizable**: Create categories that match your lifestyle
- **Secure Authentication**: Firebase-powered authentication with Google Sign-In support
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Data Persistence**: Cloud-based storage ensures your data is always accessible

---

## ✨ Key Features

### 🏠 User Dashboard & Landing Preview Overview

#### 👤 Authenticated User Dashboard
- **Financial Summary Cards**: View current balance, total income, total expenses, and savings rate at a glance.
- **Income vs Expense Chart (last 3 months)**: Interactive `BarChart` comparing monthly income against expenses.
- **Expense Breakdown Chart**: Interactive `PieChart` showing a breakdown of expenses by category.
- **Recent Transactions**: Scrollable, responsive list of the latest financial transactions.
- **Insights & Quick Actions**: Smart automated feedback (e.g., daily average expenses, savings messages) and navigation shortcuts to add transactions or manage categories.

#### 📈 Landing Page Dashboard Preview
- **Financial Overview Pie Chart**: Current month Income vs. Expense visualization with percentage breakdown.
- **Expense Breakdown by Category Bar Chart**: Displays category-wise expense trends for the last 2 months:
  - **Desktop**: Vertical bars with optimized spacing.
  - **Mobile**: Horizontal bars for better readability.
- **Transaction Summary Card**: Displays quick stats (Total Transactions, Income Entries, Expense Entries) with calculated average values.

### 💳 Transaction Management
- **Add Transactions**: Record income and expenses with amount, date, category, and description
- **Edit & Delete**: Full CRUD operations on all transactions
- **Smart Filtering**: Filter transactions by type (income/expense) or view all
- **Pagination**: Browse transactions with 10 items per page for better performance
- **Detailed History**: Comprehensive transaction list with search and sort capabilities
- **Dark Mode**: Full dark theme support for comfortable viewing

### 📁 Category Management
- **Custom Categories**: Create unlimited custom categories for both income and expenses
- **System Defaults**: Pre-configured categories to get started quickly
- **Edit & Remove**: Full control over your custom categories
- **Type-Specific**: Separate category management for income and expenses

### 🔐 Authentication & Security
- **Email/Password Authentication**: Secure user registration and login
- **Google Sign-In**: One-click authentication with Google
- **Password Recovery**: Forgot password functionality
- **Protected Routes**: Private dashboard accessible only to authenticated users
- **User Profiles**: Personalized experience with user-specific data

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch-friendly interfaces
- **Tablet Support**: Adaptive layouts for medium-sized screens
- **Desktop Experience**: Full-featured interface for larger displays
- **Dark Mode Ready**: Built with DaisyUI themes for easy theme switching

### 🎨 User Experience
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Smooth loading indicators for async operations
- **Error Handling**: Graceful error messages and fallbacks
- **Dark Mode**: Complete dark theme support with theme persistence
- **Responsive Charts**: Interactive data visualizations that adapt to screen size
- **Accessibility**: WCAG-compliant components and semantic HTML

---

## 🛠️ Tech Stack

### Frontend
- **[React 19.2.5](https://react.dev/)** - Modern UI library with latest features
- **[Vite 8.0.10](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[React Router 7.15.0](https://reactrouter.com/)** - Client-side routing and navigation
- **[TailwindCSS 4.3.0](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DaisyUI 5.5.19](https://daisyui.com/)** - Beautiful component library for Tailwind

### Backend & Services
- **[Firebase 12.13.0](https://firebase.google.com/)** - Authentication and hosting
- **[Axios 1.16.0](https://axios-http.com/)** - HTTP client for API requests
- **Custom REST API** - REST API backend endpoints for transaction, category, and user management

### UI Components & Icons
- **[Lucide React 1.14.0](https://lucide.dev/)** - Beautiful, consistent icons
- **[React Icons 5.6.0](https://react-icons.github.io/react-icons/)** - Additional icon library
- **[FontAwesome 7.2.0](https://fontawesome.com/)** - Comprehensive icon set

### Data Visualization
- **[Recharts 3.8.1](https://recharts.org/)** - Composable charting library for React
  - Pie charts for financial overview
  - Bar charts for category expense breakdown
  - Responsive and interactive visualizations

### User Feedback
- **[React Toastify 11.1.0](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- **[SweetAlert2 11.26.24](https://sweetalert2.github.io/)** - Beautiful alert modals

### Development Tools
- **[ESLint 10.2.1](https://eslint.org/)** - Code linting and quality
- **[Vite Plugin React 6.0.1](https://github.com/vitejs/vite-plugin-react)** - React Fast Refresh

---

## 🏗️ Software Architecture

### Architecture Overview

Cashnivo follows a **Component-Based Architecture** with clear separation of concerns, built on modern React patterns and best practices.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  (React Components, Pages, UI Components)                   │
├─────────────────────────────────────────────────────────────┤
│                    State Management Layer                     │
│  (Context API - AuthProvider, Local State)                  │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                       │
│  (Utilities, Data Calculations & Aggregations)              │
├─────────────────────────────────────────────────────────────┤
│                    API Integration Layer                      │
│  (Axios Client, Firebase Auth SDK)                          │
├─────────────────────────────────────────────────────────────┤
│                    External Services                          │
│  (Firebase Authentication, REST API, ImgBB)                 │
└─────────────────────────────────────────────────────────────┘
```

### Layer Descriptions

#### 1. **Presentation Layer**
The UI layer composed of React components organized by feature:

- **Pages**: Public-facing pages (Home, Login, Register, About, Contact)
- **Dashboard Components**: Protected dashboard pages (DashboardHome, Transactions, Categories)
- **Reusable Components**: Shared UI components (Navbar, Footer, Aside, DashboardLayout)
- **Styling**: TailwindCSS utility classes + DaisyUI components for consistent design

**Key Components:**
- `Navbar.jsx` - Navigation with theme toggle and user menu
- `DashboardLayout.jsx` - Protected dashboard wrapper with sidebar
- `DashboardPreview.jsx` - Landing page dashboard preview with charts
- `Transactions.jsx` - Transaction list with pagination and filtering

#### 2. **State Management Layer**
Uses React Context API for global state management:

- **AuthProvider**: Manages user authentication state and Firebase auth operations
- **Local Component State**: useState for component-specific state (forms, filters, pagination)
- **Theme State**: localStorage-based theme persistence (light/dark mode)

**Data Flow:**
```
User Action → Component State Update → Re-render → UI Update
                    ↓
            Context Update (if global) → All Consumers Re-render
```

#### 3. **Business Logic Layer**
Contains application logic and data processing integrated within page layouts and providers:

- **Data Calculations**: Financial summaries, category breakdowns, insights calculations (daily averages, top categories) processed inside page components.
- **Formatting Utilities**: Internationalization formatting for currencies (`Intl.NumberFormat`) and dates.
- **Data Aggregation**: Monthly data aggregation for Recharts components.
- **Validation**: Form validation (e.g., transaction input forms) and data integrity checks.

**Example Logic:**
```javascript
// Calculate financial stats
const stats = transactions.reduce((acc, t) => {
  const amt = parseFloat(t.amount) || 0;
  if (t.type === 'income') acc.totalIncome += amt;
  else if (t.type === 'expense') acc.totalExpense += amt;
  return acc;
}, { totalIncome: 0, totalExpense: 0, balance: 0 });
```

#### 4. **API Integration Layer**
Handles external API communication directly within components:

- **Axios HTTP Client**: Used directly inside page/dashboard components with REST API endpoints.
- **Firebase SDK**: Authentication and user state subscriptions.
- **Error Handling & Feedback**: Toast notifications (`react-toastify`) and modals (`sweetalert2`) for graceful UX updates.

**API Endpoints:**
- Transactions: CRUD operations
- Categories: Management and filtering
- Users: Profile and role information

#### 5. **External Services**
Third-party and backend services integrated into the application:

- **Firebase Authentication**: User registration, login, password recovery
- **Firebase Hosting**: Application deployment and CDN
- **Custom REST API**: Backend API hosting transactions and category data
- **Google OAuth**: Social authentication
- **ImgBB API**: Image hosting service for custom user avatars

### Data Flow Architecture

#### User Authentication Flow
```
User Input (Login/Register)
    ↓
Firebase Auth Service
    ↓
AuthProvider Context Update
    ↓
Protected Routes Validation
    ↓
Dashboard Access
```

#### Transaction Management Flow
```
User Action (Add/Edit/Delete)
    ↓
Form Validation
    ↓
API Request (Axios)
    ↓
Backend Processing
    ↓
Response Handling
    ↓
Local State Update
    ↓
UI Re-render + Toast Notification
```

#### Data Visualization Flow
```
Fetch Transactions from API
    ↓
Data Aggregation & Processing
    ↓
Category Breakdown Calculation
    ↓
Monthly Statistics Compilation
    ↓
Recharts Component Rendering
    ↓
Interactive Charts Display
```

### Component Hierarchy

```
App
├── RootLayout
│   ├── Navbar
│   ├── Routes
│   │   ├── Home
│   │   │   ├── Hero
│   │   │   ├── Features
│   │   │   ├── HowItWorks
│   │   │   ├── DashboardPreview (with Charts)
│   │   │   └── CTABanner
│   │   ├── Login
│   │   ├── Register
│   │   ├── Categories
│   │   ├── AboutUs
│   │   ├── ContactUs
│   │   └── TermsConditions
│   └── Footer
└── PrivateRoute
    └── DashboardLayout
        ├── Aside (Sidebar)
        ├── Dashboard Routes
        │   ├── DashboardHome
        │   │   ├── FinancialSummary
        │   │   ├── InsightsActions
        │   │   └── RecentTransactions
        │   ├── AddTransaction
        │   ├── Transactions (with Pagination)
        │   └── Categories
        └── Navbar
```

### Design Patterns Used

#### 1. **Context API Pattern**
Used for global state management (authentication):
```javascript
const { user } = useContext(AuthContext);
```

#### 2. **Context Provider Pattern**
Encapsulates global authentication states and methods, exposing them via `AuthContext.Provider` for direct consumption using standard React `useContext(AuthContext)` syntax.

#### 3. **Compound Components Pattern**
Dashboard components work together:
- `DashboardHome` + `FinancialSummary` + `InsightsActions` + `RecentTransactions`

#### 4. **Controlled Components Pattern**
Form inputs with state management:
```javascript
const [formData, setFormData] = useState({});
const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
```

#### 5. **Higher-Order Component Pattern**
PrivateRoute wrapper for protected pages:
```javascript
<PrivateRoute><DashboardLayout /></PrivateRoute>
```

### Responsive Design Architecture

- **Mobile-First Approach**: Base styles for mobile, enhanced for larger screens
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Adaptive Charts**: Recharts components respond to container width
- **Flexible Layouts**: CSS Grid and Flexbox for responsive positioning

**Example:**
```javascript
// Desktop: Vertical bars | Mobile: Horizontal bars
<div className="hidden lg:block">
  {/* Desktop Chart */}
</div>
<div className="lg:hidden">
  {/* Mobile Chart */}
</div>
```

### Security Architecture

- **Authentication**: Firebase handles secure user authentication
- **Protected Routes**: PrivateRoute component prevents unauthorized access
- **Environment Variables**: Sensitive data stored in `.env.local`
- **HTTPS**: All API communications encrypted
- **User-Specific Data**: Transactions and categories filtered by user email

### Performance Optimization

- **Code Splitting**: React Router enables automatic code splitting
- **Lazy Loading**: Components loaded on-demand
- **Memoization**: React.memo for preventing unnecessary re-renders
- **Efficient State Updates**: Minimal re-renders through proper state management
- **Pagination**: Transaction list paginated (10 items/page) for better performance
- **Vite Optimization**: Fast build and HMR during development

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** for version control
- A **Firebase account** for authentication setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cashnivo.git
   cd cashnivo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key for authentication | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project identifier | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket URL | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase application ID | Yes |

---

## 📖 Usage

### Getting Started with Cashnivo

1. **Create an Account**
   - Navigate to the registration page
   - Sign up with email/password or use Google Sign-In
   - Complete your profile setup

2. **Set Up Categories**
   - Go to the Categories page
   - Use default categories or create custom ones
   - Organize categories by income and expense types

3. **Add Your First Transaction**
   - Click "Add Transaction" from the dashboard
   - Select transaction type (income or expense)
   - Enter amount, date, category, and optional description
   - Save to record the transaction

4. **Monitor Your Finances**
   - View your dashboard for real-time financial overview
   - Check the Financial Overview pie chart for current month breakdown
   - Analyze expense trends with the Category Breakdown chart
   - Review your current balance and savings rate
   - Check recent transactions

5. **Manage Transactions**
   - Navigate to the Transactions page
   - Filter by type (all, income, or expense)
   - Browse through paginated results (10 items per page)
   - Edit or delete transactions as needed
   - Track your complete financial history

6. **Explore Analytics**
   - View Financial Overview with current month Income vs. Expense pie chart
   - Analyze Expense Breakdown by Category with responsive bar charts
   - Check Transaction Summary for quick statistics
   - Monitor your savings rate and financial health

### Key Pages

- **`/`** - Landing page with features and call-to-action
- **`/login`** - User authentication
- **`/register`** - New user registration
- **`/dashboard/dashboardhome`** - Main dashboard with financial overview, charts, and insights
- **`/dashboard/add-transaction`** - Add new income or expense
- **`/dashboard/transactions`** - View and manage all transactions with pagination
- **`/dashboard/categories`** - Manage income and expense categories
- **`/dashboard/Profile`** - User profile management
- **`/about-us`** - About the application
- **`/contact`** - Contact information
- **`/terms-conditions`** - Terms and conditions

---

## 📁 Project Structure

```
cashnivo/
├── public/                      # Static assets
│   ├── icons.svg               # SVG icon sprites
│   └── logo.png                # Application logo
├── src/
│   ├── assets/                 # Image assets
│   │   ├── Hero.png
│   │   ├── logo.png
│   │   └── error-404.png
│   ├── Components/             # Reusable components
│   │   ├── Aside/             # Sidebar component
│   │   ├── DashboardLayout/   # Dashboard wrapper
│   │   ├── Footer/            # Footer component
│   │   └── Navbar/            # Navigation bar
│   ├── Dashboard/             # Dashboard pages
│   │   ├── DashboardHome/     # Main dashboard with analytics
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── FinancialSummary.jsx
│   │   │   ├── InsightsActions.jsx
│   │   │   └── RecentTransactions.jsx
│   │   ├── AddTransaction.jsx # Add transaction form
│   │   └── Transactions/      # Transaction list with pagination
│   ├── Pages/                 # Public pages
│   │   ├── Home/              # Landing page components
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── CTABanner.jsx
│   │   │   ├── DashboardPreview.jsx  # Dashboard preview with charts
│   │   │   └── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Categories.jsx
│   │   ├── Profile.jsx
│   │   ├── AboutUs.jsx
│   │   ├── ContactUs.jsx
│   │   ├── TermsConditions.jsx
│   │   ├── Forgetpassword.jsx
│   │   └── ErrorPage.jsx
│   ├── Provider/              # Context providers
│   │   └── AuthProvider.jsx   # Authentication context
│   ├── firebase/              # Firebase configuration
│   │   └── firebase.config.js
│   ├── routes/                # Route definitions
│   │   ├── routes.jsx
│   │   └── PrivateRoute.jsx
│   ├── RootLayout/            # Root layout wrapper
│   ├── App.jsx                # Main app component
│   ├── App.css                # App-specific styles
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── .env.local                 # Environment variables (not in repo)
├── .firebaserc                # Firebase project config
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── firebase.json              # Firebase hosting config
├── index.html                 # HTML entry point
├── package.json               # Project dependencies
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation
```

---

## 🔌 API Integration

Cashnivo integrates with a custom REST API hosted at your server domain (e.g. `https://api.yourdomain.com`) as well as third-party services. The API provides endpoints for:

### Transactions
- `GET /transactions?email={userEmail}` - Fetch all transactions for a user
- `POST /transactions` - Create a new transaction
- `PUT /transactions/{id}` - Update an existing transaction
- `DELETE /transactions/{id}` - Delete a transaction

### Categories
- `GET /categories?email={userEmail}` - Fetch all categories for a user (returns default + user custom categories)
- `GET /categories?type={income|expense}&email={userEmail}` - Fetch categories by type for a user
- `POST /categories` - Create a new custom category
- `PUT /categories/{id}` - Update a custom category name
- `DELETE /categories/{id}` - Delete a custom category

### Users
- `POST /users` - Saves or updates user registration details
- `PUT /users/{email}` - Updates user profile details (displayName, photoURL)
- `GET /users/role/{email}` - Fetch user role information

### Analytics & System Stats
- `GET /stats` - Fetch overall stats (total transactions, users count, active entries) used in landing page Hero section

### Third-Party Services
- **ImgBB API** (`https://api.imgbb.com`): Used in the user profile component to upload custom user avatar images.

### Request/Response Format

**Example Transaction Object:**
```json
{
  "_id": "unique_id",
  "type": "expense",
  "amount": 50.00,
  "category": "Groceries",
  "date": "2026-05-16",
  "description": "Weekly grocery shopping",
  "email": "user@example.com",
  "createdAt": "2026-05-16T10:30:00.000Z"
}
```

**Example Category Object:**
```json
{
  "_id": "unique_id",
  "name": "Groceries",
  "type": "expense",
  "email": "user@example.com",
  "isDefault": false,
  "createdAt": "2026-05-16T10:30:00.000Z"
}
```

---

## 🌐 Deployment

### Firebase Hosting

This project is configured for deployment on Firebase Hosting.

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not already done)**
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Alternative Deployment Options

- **Vercel**: Connect your GitHub repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use `gh-pages` package for deployment

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Update documentation for any new features
- Add tests for new functionality when applicable
- Ensure all tests pass before submitting PR
- Keep pull requests focused on a single feature/fix

---

## 📧 Contact

**Project Maintainer**: Siratim Mustakim Chowdhury

- 📧 Email: [chowdhurysiratimmustakim@gmail.com](mailto:chowdhurysiratimmustakim@gmail.com)
- 🐙 GitHub: [@SiratimMChy](https://github.com/SiratimMChy)
- 💼 LinkedIn: [Siratim Mustakim Chowdhury](https://www.linkedin.com/in/siratim-mustakim-chowdhury/)


---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/) - Comprehensive React guides
- [Vite Documentation](https://vitejs.dev/) - Fast build tool documentation
- [Firebase Documentation](https://firebase.google.com/docs) - Authentication and hosting
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Beautiful Tailwind components
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [React Router](https://reactrouter.com/) - Client-side routing
- [Recharts](https://recharts.org/) - Data visualization library

---

<div align="center">

**Made with ❤️ by Siratim Mustakim Chowdhury**

⭐ Star this repository if you find it helpful!

</div>
