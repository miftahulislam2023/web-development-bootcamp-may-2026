# src/Database/schemas/habits.ts

Documentation for `src/Database/schemas/habits.ts`.

## Overview
This file contains the SQLite schema string for the `habits` table. It tracks user behaviors using fields like `streak_count` and `last_completed_date`. The `initHabitsTable` functions executes the initialization and dynamically alters the table to support categorization (`category` column) for newer app versions.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initHabitsTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        habit_name TEXT NOT NULL,
        streak_count INTEGER DEFAULT 0,
        last_completed_date TEXT,
        category TEXT DEFAULT 'general'
    )
  ''');
}
```
