# Authentication System

## Overview
LifeOS uses a custom authentication system with password hashing and session persistence, backed by Turso database.

## Components

### AuthContext (`src/contexts/AuthContext.tsx`)
Provides authentication state and functions:
- `user` - Current logged-in user or null
- `isAuthenticated` - Boolean auth state
- `isLoading` - Loading state during session check
- `login(email, password)` - Login function
- `register(name, email, password)` - Register function
- `logout()` - Logout function

### Password Security
Uses Web Crypto API for hashing (SHA-256 with salt).

### Protected Routes (`src/components/auth/ProtectedRoute.tsx`)
Wraps all app routes except `/login` and `/register`.

## Pages
- `LoginPage.tsx` - Email/password login form
- `RegisterPage.tsx` - Registration with password validation

## Database Schema
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  preferences TEXT DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

## Session Management
- User ID stored in `localStorage` as `lifeos-user-id`
- Auto-login on app load if valid session exists
- All hooks query data by authenticated user ID

## Multi-Device Sync
Since data is stored in Turso (cloud database), logging in on multiple devices accesses the same data.
