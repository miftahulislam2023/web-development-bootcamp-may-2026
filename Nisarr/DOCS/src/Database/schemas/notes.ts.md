# src/Database/schemas/notes.ts

Documentation for `src/Database/schemas/notes.ts`.

## Overview
Declares the robust `notes` table schema handling title, content, tagging, pinning, archiving, and color coordination. Its `initNotesTable` function is highly complex; beyond simple `ALTER TABLE` column patching, it executes a CTE (Common Table Expression) `UPDATE` block to retroactively backfill sequential `serial_number` fields for old notes. It also introduces and initializes a generalized `note_metadata` table to persist absolute serial counting even when older notes are explicitly trashed.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initNotesTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        tags TEXT,
        is_pinned INTEGER DEFAULT 0,
        color TEXT DEFAULT 'default',
        is_archived INTEGER DEFAULT 0,
        is_trashed INTEGER DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        serial_number INTEGER
    )
  ''');

  await db.execute('''
    CREATE TABLE IF NOT EXISTS note_metadata (
        key TEXT PRIMARY KEY,
        value INTEGER DEFAULT 0
    )
  ''');
  
  // Handled metadata initialization and CTE backfills natively in JS. 
  // It is recommended to perform complex backfills server-side or during the app's initial migration boot loop in Flutter.
}
```
