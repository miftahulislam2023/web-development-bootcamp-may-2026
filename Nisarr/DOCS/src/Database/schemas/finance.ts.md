# src/Database/schemas/finance.ts

Documentation for `src/Database/schemas/finance.ts`.

## Overview
This file contains the SQLite schema definition for the `finance` table regulating all logged incomes and expenses. It exposes `initFinanceTable()` to establish the table and applies a defensive structural migration block to dynamically append the `is_special` flag to older database versions.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initFinanceTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS finance (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        is_special INTEGER DEFAULT 0
    )
  ''');
}
```
