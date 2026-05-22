# Turso Database Module

## Overview
SQLite database client and schema initialization for LifeOS using Turso.

## Location
`src/lib/turso.ts`

## Configuration
Requires environment variables:
- `VITE_TURSO_DB_URL` - Turso database URL
- `VITE_TURSO_AUTH_TOKEN` - Auth token

## Exports

### `db`
Turso client instance for database operations.

### `generateId()`
Returns a UUID for new records.

### `DEFAULT_USER_ID`
Default user ID constant (`"default-user"`).

### `initDatabase()`
Creates all tables and default user. Called on app startup.

## Tables
| Table | Description |
|-------|-------------|
| users | User accounts |
| tasks | Task items with priority/status |
| habits | Habit tracking with streaks |
| finance | Income/expense records |
| notes | Notes with tags |
| inventory | Item inventory |
| study_chapters | Study progress tracking |
| settings | User preferences |

## Auth Functions
- `loginUser(email, password)` - Authenticate user
- `registerUser(name, email, password)` - Create new user
- `getCurrentUser()` - Get current user from localStorage
