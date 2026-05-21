# 💸 Spendora — Personal Expense Tracker

A full-stack expense tracking web app built with **React + Vite** (frontend) and **Express + MongoDB** (backend), deployed on **Netlify** (frontend) and **Vercel** (backend).

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🎨 Frontend | [https://my-spendora-e241a7.netlify.app](  https://my-spendora-f1d7e3.netlify.app/  ) |
| ⚙️ Backend API | [https://my-spendora-server.vercel.app](  https://my-spendora-server.vercel.app/  ) |

---

## ✨ Features

- 🔐 **Authentication** — Google & Email/Password login via Firebase
- 📊 **Dashboard Overview** — Monthly balance, income, expenses at a glance
- ➕ **Add Transactions** — Add income or expense with category, date, description
- 📋 **Transactions Page** — View, search, filter, and delete all transactions
- 📈 **Charts Page** — Spending trend, category breakdown, income vs expenses
- 👤 **Profile Page** — Update name, bio, location, occupation
- 🌙 **Dark / Light Mode** — Toggle theme from sidebar
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🗂️ Project Structure

```
spendora/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Firebase auth context
│   │   │   ├── AuthProvider.jsx      # Auth state provider
│   │   │   ├── ExpenseContext.jsx    # Expense data & API calls
│   │   │   └── ThemeContext.jsx      # Dark/light theme
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Auth hook
│   │   │   └── userProfile.js        # Profile hook
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── DashboardLayout/
│   │   │   │       └── DashboardLayout.jsx  # Sidebar + layout wrapper
│   │   │   ├── dashboard/
│   │   │   │   ├── Overview.jsx      # Main dashboard page
│   │   │   │   ├── AddExpense.jsx    # Add transaction form
│   │   │   │   ├── Transactions.jsx  # Transaction list
│   │   │   │   ├── Charts.jsx        # Charts & analytics
│   │   │   │   └── Profile.jsx       # User profile
│   │   │   └── Authentication/       # Login & Register pages
│   │   ├── firebase/
│   │   │   └── firebase.init.js      # Firebase config
│   │   ├── constants.js              # Categories, API URL
│   │   └── main.jsx                  # App entry point
│   ├── .env                          # Environment variables (not in git)
│   └── package.json
│
└── backend/                   # Express + MongoDB API
    ├── index.js               # Main server file
    ├── vercel.json            # Vercel deployment config
    ├── .env                   # Environment variables (not in git)
    └── package.json
```

---

## 🔌 API Routes

### Base URL: `https://my-spendora-server.vercel.app`

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Health check — server status |
| `GET` | `/expenses` | Get all expenses (filter by uid, type, cat, search) |
| `GET` | `/expenses/recent` | Get recent transactions (limit, uid) |
| `GET` | `/expenses/summary` | Get all-time total income, expense, balance |
| `GET` | `/expenses/summary/monthly` | Get this month's totals (uid) |
| `POST` | `/expenses` | Add new transaction |
| `PATCH` | `/expenses/:id` | Update a transaction by ID |
| `DELETE` | `/expenses/:id` | Delete a transaction by ID |

### Query Parameters

**`GET /expenses`**
```
?uid=firebase_user_id
&type=expense|income|All
&cat=Food|Transport|...
&search=keyword
```

**`GET /expenses/recent`**
```
?uid=firebase_user_id
&limit=5
```

**`GET /expenses/summary/monthly`**
```
?uid=firebase_user_id
```

### Request Body — `POST /expenses`
```json
{
  "desc": "Lunch at KFC",
  "amt": 250,
  "type": "expense",
  "cat": "Food",
  "date": "2026-05-21",
  "uid": "firebase_uid",
  "email": "user@email.com"
}
```

---

## 🧭 Page & Button Guide

### 🏠 Dashboard (Overview)
| Element | Function |
|---------|----------|
| Balance card | Shows income − expenses for this month |
| Total Expenses card | Sum of all expenses this month |
| Total Income card | Sum of all income this month |
| Transactions count | Number of transactions this month |
| Recent Transactions | Last 5 transactions |
| **See all** button | Goes to Transactions page |
| **Add Expense** button | Goes to Add Expense page |
| **Charts** button | Goes to Charts page |

### ➕ Add Expense
| Element | Function |
|---------|----------|
| Description field | Name/note for the transaction |
| Amount field | Transaction amount in BDT |
| Expense / Income toggle | Select transaction type |
| Category grid | Select category (Food, Transport, etc.) |
| Date picker | Select transaction date |
| **Save expense** button | Saves to database |
| **Cancel** button | Goes back |

### 📋 Transactions
| Element | Function |
|---------|----------|
| Search bar | Search by description keyword |
| Category filter pills | Filter by category (All, Food, etc.) |
| 🗑️ Delete button | Deletes that transaction permanently |
| Transaction count | Shows total matching results |

### 📈 Charts
| Chart | Shows |
|-------|-------|
| Spending trend | Bar chart of expenses for last 6 months |
| Category breakdown | Donut chart of expense by category |
| Income vs Expenses | Side-by-side bars for last 6 months |
| Top categories | Horizontal bar chart of top 5 spending categories |
| Recent activity | Last 5 transactions list |

### 👤 Profile
| Element | Function |
|---------|----------|
| Name, Bio, Location, Occupation | Editable profile fields |
| Profile photo | Uploaded via image hosting |
| **Save** button | Updates profile info |

### 🔲 Sidebar
| Button | Function |
|--------|----------|
| Overview | Dashboard home |
| Profile | User profile page |
| Add Expense | Add new transaction |
| Transactions | Full transaction list |
| Charts | Analytics & charts |
| ☀️/🌙 toggle | Switch light/dark mode |
| ← Back | Go to previous page |

---

## ⚙️ Environment Variables

### Frontend `.env`
```env
VITE_API_URL=https://my-spendora-server.vercel.app
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_project.firebasestorage.app
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id
VITE_image_upload_Key=your_imagebb_key
```

### Backend `.env`
```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
CLIENT_URL=https://your-frontend.netlify.app
NODE_ENV=production
```

---

## 🚀 Local Setup

### Backend
```bash
cd backend
npm install
# create .env with DB_USER, DB_PASS, CLIENT_URL
node index.js
# runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
# create .env with VITE_API_URL=http://localhost:5000
npm run dev
# runs on http://localhost:5173
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Inline styles, Tailwind utilities |
| Animation | Framer Motion |
| Auth | Firebase Authentication |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Deployment | Netlify (frontend), Vercel (backend) |
| Icons | React Icons (Remix Icons, Feather) |

---

## 📦 Categories

`Food` · `Transport` · `Shopping` · `Health` · `Sport` · `Bills` · `Entertainment` · `Other`

---

## 👨‍💻 Author

Built with ❤️ using React + Express + MongoDB
