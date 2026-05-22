# src/Database/schemas/budget.ts

Documentation for `src/Database/schemas/budget.ts`.

## Overview
This file contains the SQLite schema definitions for the `budgets` and `savings_transactions` tables. It exports an initialization function `initBudgetTable()` that creates these tables if they do not exist and includes programmatic migrations using `ALTER TABLE` to append the `start_date` and `is_special` columns incrementally without dropping existing data.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initBudgetTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('budget', 'savings')),
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0,
        period TEXT CHECK(period IN ('monthly', 'weekly', 'yearly') OR period IS NULL),
        category TEXT,
        start_date TEXT,
        is_special INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  ''');

  await db.execute('''
    CREATE TABLE IF NOT EXISTS savings_transactions (
        id TEXT PRIMARY KEY,
        savings_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('deposit', 'withdraw')),
        amount REAL NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (savings_id) REFERENCES budgets(id) ON DELETE CASCADE
    )
  ''');
  
  // Handled migrations via SQFlite's onUpgrade normally, 
  // but if doing manual migrations it resembles the JS implementation.
}
```
