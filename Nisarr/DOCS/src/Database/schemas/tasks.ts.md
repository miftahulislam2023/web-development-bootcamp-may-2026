# src/Database/schemas/tasks.ts

Documentation for `src/Database/schemas/tasks.ts`.

## Overview
Declares the comprehensive configurations for the application's core feature: `tasks`. The main `tasks` table is massive, storing context metadata, hierarchical relations, duration estimations, cost linkages, labels, and recurrences. It also bootstraps three additional supporting tables:
- `task_labels`: For categorization coloring.
- `task_time_logs`: Explicitly logs when a task was actively worked on.
- `task_templates`: Stores reusable skeletal structures for rapid task creation natively.

The `initTasksTable` manages safe programmatic migrations for deploying new fields across production datasets safely.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initTasksTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo',
        priority TEXT DEFAULT 'medium',
        due_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        completed_at TEXT,
        context_type TEXT,
        context_id TEXT,
        budget_id TEXT,
        expected_cost REAL,
        finance_type TEXT,
        start_time TEXT,
        end_time TEXT,
        estimated_duration INTEGER,
        actual_duration INTEGER,
        recurrence_rule TEXT,
        parent_task_id TEXT,
        order_index INTEGER DEFAULT 0,
        labels TEXT,
        reminder_time TEXT,
        is_pinned INTEGER DEFAULT 0
    )
  ''');
  
  // Task Labels, Task Time Logs, Task Templates...
}
```
