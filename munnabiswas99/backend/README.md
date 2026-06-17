# Personal Expense Tracker Backend

## Project Overview

This is the backend server for the Personal Expense Tracker application. The backend handles authentication verification, wallet management, transaction processing, dashboard analytics, and MongoDB database operations.

---

# Live Server

Backend Live URL:
https://expense-tracker-backend-phi-gray.vercel.app

---

# Features

## Authentication
- Firebase token verification
- Protected API routes

## User Management
- Create users
- Get users
- Update profile information

## Wallet Management
- Create wallets
- Real-time wallet balance updates
- Prevent negative balance

## Transaction Management
- Add transactions
- Edit transactions
- Delete transactions
- Automatic wallet balance synchronization

## Dashboard Analytics
- Total income
- Total expense
- Total savings
- Total investment
- Recent transactions
- Monthly income vs expense analytics

## Search & Filter
- Search transactions by title
- Filter transactions by type

---

# Technology Stack

## Backend Technologies
- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- CORS

## Database
- MongoDB Atlas

## Hosting
- Vercel

---

# Folder Structure

```bash
backend/
│
├── middlewares/
│   └── verifyToken.js
├── firebase/
├── index.js
├── vercel.json
├── package.json
└── .env
```

---

# API Documentation

# User APIs

## Get All Users

```http
GET /users
```

## Create User

```http
POST /users
```

## Update User Profile

```http
PATCH /users/profile
```

---

# Transaction APIs

## Get Transactions

```http
GET /transactions
```

## Query Parameters

| Parameter | Description |
|----------|-------------|
| searchText | Search by title |
| filterType | Filter by transaction type |

---

## Get Single Transaction

```http
GET /transactions/:id
```

---

## Add Transaction

```http
POST /transactions
```

## Request Body

```json
{
  "title": "Salary",
  "amount": 500,
  "type": "income",
  "category": "Job",
  "createdAt": "2026-05-13T16:38:08.723+00:00",
  "date": "2026-05-16",
  "note": "Monthly salary"
}
```

---

## Update Transaction

```http
PATCH /transactions/:id
```

---

## Delete Transaction

```http
DELETE /transactions/:id
```

---

# Dashboard APIs

## Dashboard Summary

```http
GET /dashboard-data
```

### Returns
- Total income
- Total expense
- Total savings
- Total investment
- Recent transactions

---

## Monthly Income Expense Data

```http
GET /income-expense
```

---

# Wallet APIs

## Get Wallets

```http
GET /wallets
```

---

## Add Wallet

```http
POST /wallet
```

---

# Authentication Flow

1. User logs in with Firebase Authentication
2. Firebase returns an access token
3. Token is sent to the backend in the Authorization header
4. Backend verifies token using Firebase Admin SDK
5. Protected APIs become accessible

---

# Environment Variables

Create a `.env` file in the root directory.

```env
MONGO_URI=

FB_TYPE=
FB_PROJECT_ID=
FB_PRIVATE_KEY_ID=
FB_PRIVATE_KEY=
FB_CLIENT_EMAIL=
FB_CLIENT_ID=
```

---

# Installation & Setup

## Clone Repository

```bash
git clone <your-backend-repository-link>
```

## Navigate to Project

```bash
cd your-project-folder
```

## Install Dependencies

```bash
npm install
```

## Run Server

```bash
nodemon index.js
```

---

# Vercel Deployment

## Install Vercel CLI

```bash
npm install -g vercel
```

## Deploy

```bash
vercel --prod
```

---

# Important Notes

## Remove app.listen()

Vercel uses serverless functions, so `app.listen()` should not be used.

## Export Express App

```js
module.exports = app;
```

---

# vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

---

# Security Features
- Firebase token verification
- Protected API routes
- User-specific data access
- Wallet balance validation
- Negative balance prevention
- CORS protection

---

# Challenges Faced
- Managing wallet balance updates during transaction edit/delete
- Handling Firebase Admin SDK in Vercel
- CORS configuration during deployment
- Real-time balance synchronization

---

# Future Improvements
- Budget planning feature
- Export transactions as PDF/Excel
- Multi-currency support
- Email notifications

---

# Conclusion

The backend provides secure authentication, transaction management, wallet synchronization, and financial analytics for the Personal Expense Tracker application.