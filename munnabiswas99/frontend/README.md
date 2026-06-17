# Personal Expense Tracker Frontend

## Project Overview

Personal Expense Tracker is a full-stack web application designed to help users manage their personal finances efficiently. Users can create wallets, add transactions, monitor balances, track income and expenses, and visualize financial activities through a clean dashboard.

---

# Live Project

Frontend Live URL:
https://personal-expense-tracker-a4828.web.app

## Demo Account

You can use the following demo account to test the application:

### Demo User
- Email: demo.expense.tracker@gmail.com
- Password: Demo@1234

---

# Features

## Authentication
- User registration with Firebase Authentication
- User login/logout
- Google Sign-in support

## User Profile
- View profile information
- Edit profile
- Upload profile image using ImgBB
- Sync profile updates with Firebase and MongoDB

## Wallet Management
- Create multiple wallets
- Store wallet type and account number
- Real-time wallet balance updates
- Prevent negative wallet balance

## Transaction Management
- Add transactions
- Edit transactions
- Delete transactions

### Transaction Categories
- Income
- Expense
- Investment
- Savings

## Dashboard
- Total Income
- Total Expense
- Total Savings
- Total Investment
- Recent transactions
- Monthly income vs expense analytics
- Financial Overview

## Search & Filter
- Search transactions by title
- Filter transactions by type

## Responsive Design
- Mobile devices
- Tablets
- Desktop devices

---

# Technology Stack

## Frontend Technologies
- React.js
- React Router
- Tailwind CSS
- React Hook Form
- React Select
- Framer Motion
- SweetAlert2
- TanStack Query
- Axios
- Recharts

---

# Folder Structure

```bash
src/
│
├── assets/
├── components/
├── hooks/
├── layouts/
├── pages/
│   ├── Dashboard/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   └── Profile/
├── providers/
├── routes/
└── main.jsx
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
VITE_Image_Host_API_Key=
```

---

# Installation & Setup

## Clone Repository

```bash
git clone <your-frontend-repository-link>
```

## Navigate to Project

```bash
cd your-project-folder
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# Build Project

```bash
npm run build
```

---

# Firebase Deployment

## Login Firebase

```bash
firebase login
```

## Initialize Hosting

```bash
firebase init hosting
```

## Configuration
- Public directory: dist
- Single page app: Yes

## Deploy

```bash
firebase deploy
```

---

# Security Features
- Firebase Authentication
- Protected Routes
- Secure API communication
- User-specific data access

---

# Future Improvements
- Budget planning feature
- Export transactions as PDF/Excel
- Advanced analytics and charts
- Multi-currency support
- Email notifications

---

# Conclusion

Personal Expense Tracker provides a modern and user-friendly solution for managing personal finances with secure authentication, real-time balance tracking, and financial analytics.
