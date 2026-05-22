# src/Database/schemas/study.ts

Documentation for `src/Database/schemas/study.ts`.

## Overview
This file constructs the SQLite tables supporting the application's Study tracking features. It establishes a multi-layered relational hierarchy:
- `study_subjects`: Top-level groupings.
- `study_chapters_v2`: Nested under subjects.
- `study_parts`: Granular study tasks/lessons under a chapter. Contains duration estimates, statuses, and robust recursive structures (`parent_id`) allowing for infinitely nested parts.
- `study_common_presets`: Reusable templates for quickly structuring subjects with generic chapters/parts.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initStudyTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS study_subjects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        color_index INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
    )
  ''');

  await db.execute('''
    CREATE TABLE IF NOT EXISTS study_chapters_v2 (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        name TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (subject_id) REFERENCES study_subjects(id) ON DELETE CASCADE
    )
  ''');
  
  // Followed similarly for study_parts and study_common_presets...
}
```
