# Expense Tracker

## Overview
Expense Tracker is a full-stack web application designed to help users track their personal finances. Users can log their incomes and expenses, categorize them, and visualize their spending and earning trends over time using interactive charts.

---

# Technology Stack

## Frontend
- **Framework:** React.js (v19) with Vite
- **Styling:** TailwindCSS (v4)
- **Routing:** React Router DOM (v7)
- **Data Visualization:** Recharts
- **HTTP Client:** Axios
- **State Management:** React Hooks (`useState`, `useEffect`, `Context API`)
- **Notifications:** React Hot Toast
- **Icons:** React Icons

## Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs for password hashing
- **File Uploads:** Multer
- **Environment Management:** Dotenv
- **Excel Export:** SheetJS (`xlsx`)

---

# Project Structure

The repository is organized into two main directories:

```bash
/front-end/Expense-Tracker
/back-end
```

## Frontend Structure

```bash
src/
├── components/   # Reusable UI components (Modals, Charts, Forms)
├── pages/        # Main views (Dashboard, Income, Expense, Login, Register)
├── utils/        # Helper functions and Axios configuration
└── hooks/        # Custom React hooks (e.g., useUserAuth)
```

## Backend Structure

```bash
back-end/
├── config/       # Database connection and configuration
├── controllers/  # Business logic for API endpoints
├── middleware/   # Custom middleware (e.g., Auth verification)
├── models/       # Mongoose schemas
├── routes/       # API endpoint definitions
└── uploads/      # Uploaded user profile images
```

---

# Features

- ✅ User Authentication with JWT
- ✅ Secure Password Hashing using bcryptjs
- ✅ Profile Image Upload
- ✅ Income Management
- ✅ Expense Management
- ✅ Financial Dashboard with Charts
- ✅ Excel Export Functionality
- ✅ Responsive UI with TailwindCSS

---

# Installation & Setup

## Prerequisites

Make sure you have the following installed:

- Node.js (v18+)
- MongoDB (Local or MongoDB Atlas)

---

# Backend Setup

Navigate to the backend directory:

```bash
cd back-end
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `back-end` directory and add the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8000
```

Start the backend server:

```bash
npm run dev
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd front-end/Expense-Tracker
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open your browser and visit:

```bash
http://localhost:5173
```

---

# API Endpoints Overview

## Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/login` | Authenticate user |
| POST | `/register` | Register a new user |
| GET | `/getUser` | Fetch authenticated user details |
| POST | `/upload-image` | Upload profile image |

---

## Dashboard Routes (`/api/v1/dashboard`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/` | Fetch summarized dashboard data |

---

## Income Routes (`/api/v1/income`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/add` | Add new income |
| GET | `/get` | Get all incomes for user |
| DELETE | `/:id` | Delete an income record |
| GET | `/downloadexcel` | Download incomes as Excel |

---

## Expense Routes (`/api/v1/expense`)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/add` | Add new expense |
| GET | `/get` | Get all expenses for user |
| DELETE | `/:id` | Delete an expense record |
| GET | `/downloadexcel` | Download expenses as Excel |

---

# Responsive Design

The application is fully responsive and optimized for:

- Desktop Devices
- Tablets
- Mobile Devices

---

# Future Improvements

- Dark Mode Support
- Budget Planning Feature
- Recurring Transactions
- Multi-Currency Support
- Advanced Analytics
- Email Notifications

---

# Author

Developed as a full-stack personal finance tracking application using the MERN stack.

