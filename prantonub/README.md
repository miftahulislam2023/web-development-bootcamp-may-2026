# 💰 SpendWise v2 — Industry-Level Personal Expense Tracker

A full-stack MERN SaaS application with Google OAuth, budget goals, recurring transactions, analytics, dark mode, CSV/PDF export, and PWA support.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express 4, MongoDB, Mongoose |
| Auth | JWT + Google OAuth 2.0 (Passport.js) |
| Scheduling | node-cron (recurring transactions) |

## 📁 Project Structure

```
spendwise/
├── server/
│   └── src/
│       ├── config/       passport.js, cron.js
│       ├── controllers/  auth, transaction, budget, recurring, user, export
│       ├── middleware/   auth.js (JWT protect)
│       ├── models/       User, Transaction, Budget, Recurring
│       └── routes/       auth, transaction, budget, recurring, user, export
│
└── client/
    └── src/
        ├── api/          axios.js
        ├── components/   Layout, Modal, TransactionModal, StatCard, ...
        ├── context/      AuthContext (auth + dark mode)
        ├── pages/        Login, Register, Dashboard, Transactions,
        │                 Budgets, Recurring, Analytics, Settings
        └── utils/        helpers.js (formatters, constants)
```

## ⚙️ Setup

### 1 — Install dependencies

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2 — Configure `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/spendwise
JWT_SECRET=your_strong_secret_here
SESSION_SECRET=your_session_secret_here
CLIENT_URL=http://localhost:5173

# Optional — needed only for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3 — Google OAuth (optional, 5 min)

1. Go to https://console.cloud.google.com/
2. Create project → APIs & Services → Credentials → OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Copy credentials to `server/.env`

> App works fully with email/password without Google credentials.

### 4 — Run

```bash
# From project root
npm run dev
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:5000

## ✨ Features

### Authentication
- Email + password register/login
- Google OAuth sign-in
- JWT token auth (7-day expiry)
- Protected routes (frontend + backend)

### Transactions
- Add income / expense
- Edit & delete
- Filter: category, type, date range, search
- Pagination (15 per page)
- CSV export

### Dashboard
- Income / Expense / Savings stat cards
- Income vs Expense bar chart (6 months)
- Spending by category donut pie chart
- Recent transactions list

### Budget Goals
- Set per-category monthly budgets
- Progress bars with color alerts (🟢🟡🔴)
- Month/year selector

### Recurring Transactions
- Daily / Weekly / Monthly schedules
- Auto-generated via cron (midnight daily)
- Enable/disable toggle
- Full CRUD

### Analytics
- 6-month area cash flow chart
- Monthly savings line chart
- Category pie chart
- Horizontal bar chart
- Category detail table with % breakdown

### Settings
- Update name, currency, monthly budget
- Dark / light mode toggle (persisted)
- Change password
- Export monthly PDF report
- Export all transactions to CSV
- Delete account (cascades all data)

### PWA
- Installable on mobile / desktop
- manifest.json included

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/auth/google | Google OAuth start |
| GET | /api/transactions | List (filter + paginate) |
| POST | /api/transactions | Create |
| PUT | /api/transactions/:id | Update |
| DELETE | /api/transactions/:id | Delete |
| GET | /api/transactions/summary | Dashboard analytics |
| GET | /api/budgets | List budgets |
| POST | /api/budgets | Create/update budget |
| DELETE | /api/budgets/:id | Delete budget |
| GET | /api/recurring | List recurring |
| POST | /api/recurring | Create recurring |
| PUT | /api/recurring/:id | Update recurring |
| DELETE | /api/recurring/:id | Delete recurring |
| PATCH | /api/recurring/:id/toggle | Toggle active |
| GET | /api/user/profile | Get profile |
| PUT | /api/user/profile | Update profile |
| PUT | /api/user/password | Change password |
| DELETE | /api/user/account | Delete account |
| GET | /api/export/csv | Export CSV |
| GET | /api/export/summary | Monthly HTML report |
