# scripts/migrate.ts

Documentation for `scripts/migrate.ts`.

## Overview
A critical utility script resolving SQLite database schema drift and applying structural migrations programmatically utilizing `@libsql/client`. It targets the Turso Edge Database, establishing base tables (`otps`, `settings`), checking for vital schema additions (e.g., ensuring `is_verified` and `password_hash` in `users`), and iterating through all global application tables to inject necessary scoped columns (`user_id`) and associated indexes for optimization. 

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// This server-side migration script has no direct equivalent in standard backend fetch logic,
// but local SQFlite mobile instances might utilize similar logic:

import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

Future<Database> openLocalDatabase() async {
  return openDatabase(
    join(await getDatabasesPath(), 'lifesolver_local.db'),
    onCreate: (db, version) async {
      await db.execute('CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT)');
      // Equivalent migration scaffolding...
    },
    onUpgrade: (db, oldVersion, newVersion) async {
      if (oldVersion < 2) {
         await db.execute('ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0');
      }
    },
    version: 2,
  );
}
```
