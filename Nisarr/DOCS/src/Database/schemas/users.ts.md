# src/Database/schemas/users.ts

Documentation for `src/Database/schemas/users.ts`.

## Overview
This file maintains the schema scaffolding for the application's authentication and user preference tiers. 
- `users`: Core profile definitions including `name`, `email`, authentication states (`is_verified`), and the cryptographic `password_hash`. Includes a `migrateUsersTable` function leveraging `PRAGMA table_info` SQLite syntax to safely verify existing table fields before adding verification layers for outdated local copies.
- `settings`: A 1-to-1 table containing the overarching application choices made by a given user (theme, default currency, budget limits).
- `otps`: An ephemeral storage table used to cache standard 6-digit verifications during registration and recovery logic.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initUsersTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password_hash TEXT,
        preferences TEXT DEFAULT '{}',
        is_verified INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  ''');
  
  await db.execute('''
    CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        theme TEXT DEFAULT 'dark',
        currency TEXT DEFAULT 'BDT',
        language TEXT DEFAULT 'en',
        notifications_enabled INTEGER DEFAULT 1,
        monthly_budget REAL DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  ''');
}
```
