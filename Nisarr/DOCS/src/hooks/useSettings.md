# useSettings Hook

## Overview
React Query hook for managing user settings with Turso SQLite persistence.

## Location
`src/hooks/useSettings.ts`

## Interface
```typescript
interface UserSettings {
    id: string;
    user_id: string;
    theme: "light" | "dark";
    currency: string;
    language: string;
    notifications_enabled: boolean;
    monthly_budget: number;
}
```

## Usage
```typescript
const { settings, isLoading, updateSettings } = useSettings();

// Update theme
updateSettings.mutate({ theme: "dark" });

// Update budget
updateSettings.mutate({ monthly_budget: 10000 });
```

## Features
- Auto-creates default settings if not exist
- Uses localStorage for user ID
- Falls back to DEFAULT_USER_ID
