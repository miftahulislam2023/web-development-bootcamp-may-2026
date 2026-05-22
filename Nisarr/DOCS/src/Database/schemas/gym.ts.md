# src/Database/schemas/gym.ts

Documentation for `src/Database/schemas/gym.ts`.

## Overview
This file centralizes all schema strings representing the gym domain of the application. It creates an interconnected relational structure containing six tables:
- `gym_workout_plans`: The overarching plan a user follows.
- `gym_exercises`: Granular exercises belonging to a plan, tracked by `plan_id`.
- `gym_workout_logs`: Top-level records of completed sessions.
- `gym_set_logs`: Individual sets logged relating to a specific log and exercise.
- `gym_body_metrics`: Tracks bodily dimensions and composition over time.
- `gym_personal_records`: Snapshot table cataloging the highest achieved weights/reps per exercise.

The script runs all of these `CREATE TABLE IF NOT EXISTS` commands sequentially via `initGymTables()`.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initGymTables(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS gym_workout_plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      split_type TEXT NOT NULL,
      day_of_week TEXT,
      created_at TEXT NOT NULL
    )
  ''');
  
  await db.execute('''
    CREATE TABLE IF NOT EXISTS gym_exercises (
      id TEXT PRIMARY KEY,
      plan_id TEXT REFERENCES gym_workout_plans(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      equipment TEXT,
      default_sets INTEGER DEFAULT 3,
      default_reps TEXT DEFAULT '8-12',
      default_weight REAL DEFAULT 0,
      notes TEXT,
      order_index INTEGER DEFAULT 0
    )
  ''');

  // Continues for gym_workout_logs, gym_set_logs, gym_body_metrics, gym_personal_records...
}
```
