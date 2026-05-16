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

### 🏠 Dashboard Overview
- **Financial Summary Cards**: View current balance, total income, total expenses, and savings rate at a glance
- **Visual Analytics**: Income vs. Expense comparison with progress bars
- **Recent Transactions**: Quick access to your latest financial activities
- **Quick Actions**: Fast navigation to add transactions or manage categories

### 💳 Transaction Management
- **Add Transactions**: Record income and expenses with amount, date, category, and description
- **Edit & Delete**: Full CRUD operations on all transactions
- **Smart Filtering**: Filter transactions by type (income/expense) or view all
- **Detailed History**: Comprehensive transaction list with search and sort capabilities

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
- **Custom REST API** - Backend API hosted at `cashnivo.vercel.app`

### UI Components & Icons
- **[Lucide React 1.14.0](https://lucide.dev/)** - Beautiful, consistent icons
- **[React Icons 5.6.0](https://react-icons.github.io/react-icons/)** - Additional icon library
- **[FontAwesome 7.2.0](https://fontawesome.com/)** - Comprehensive icon set

### Data Visualization
- **[Recharts 3.8.1](https://recharts.org/)** - Composable charting library for React

### User Feedback
- **[React Toastify 11.1.0](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- **[SweetAlert2 11.26.24](https://sweetalert2.github.io/)** - Beautiful alert modals

### Development Tools
- **[ESLint 10.2.1](https://eslint.org/)** - Code linting and quality
- **[Vite Plugin React 6.0.1](https://github.com/vitejs/vite-plugin-react)** - React Fast Refresh

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
   - Check your current balance and savings rate
   - Analyze income vs. expense trends
   - Review recent transactions

5. **Manage Transactions**
   - Navigate to the Transactions page
   - Filter by type (all, income, or expense)
   - Edit or delete transactions as needed
   - Track your complete financial history

### Key Pages

- **`/`** - Landing page with features and call-to-action
- **`/login`** - User authentication
- **`/register`** - New user registration
- **`/dashboard/dashboardhome`** - Main dashboard with financial overview
- **`/dashboard/add-transaction`** - Add new income or expense
- **`/dashboard/transactions`** - View and manage all transactions
- **`/dashboard/categories`** - Manage income and expense categories
- **`/dashboard/profile`** - User profile management
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
│   │   ├── DashboardHome/     # Main dashboard
│   │   ├── AddTransaction.jsx # Add transaction form
│   │   └── Transactions/      # Transaction list
│   ├── Pages/                 # Public pages
│   │   ├── Home/              # Landing page components
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── CTABanner.jsx
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

Cashnivo integrates with a custom REST API hosted at `https://cashnivo.vercel.app`. The API provides endpoints for:

### Transactions
- `GET /transactions?email={userEmail}` - Fetch all transactions for a user
- `POST /transactions` - Create a new transaction
- `PUT /transactions/{id}` - Update an existing transaction
- `DELETE /transactions/{id}` - Delete a transaction

### Categories
- `GET /categories?email={userEmail}` - Fetch all categories for a user
- `GET /categories?type={income|expense}&email={userEmail}` - Fetch categories by type
- `POST /categories` - Create a new category
- `PUT /categories/{id}` - Update a category
- `DELETE /categories/{id}` - Delete a category

### Users
- `GET /users/role/{email}` - Fetch user role information

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

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

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
