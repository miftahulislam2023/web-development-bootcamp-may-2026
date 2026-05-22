# src/Database/index.ts

Documentation for `src/Database/index.ts`.

## Overview
This file acts as the central module hub for database interactions in the React frontend. It re-exports the configured database client and identity utilities from `client.ts`, forwards all generic schemas from the `schemas/` directory, and defines an atomic `initDatabase` function. This initialization function sequentially runs local table instantiations to ensure SQLite/IndexedDB structures exist locally if the app supports offline-first behavior or local caching.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseInitializer {
  static Future<Database> initDatabase() async {
    final dbPath = join(await getDatabasesPath(), 'lifesolver.db');
    
    return await openDatabase(
      dbPath,
      version: 1,
      onCreate: (db, version) async {
         // Call individual table initialization logic here
         await initUsersTable(db);
         await initTasksTable(db);
         print("Database tables initialized successfully");
      }
    );
  }
  
  static Future<void> initUsersTable(Database db) async {
      await db.execute('CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT)');
  }
  
  static Future<void> initTasksTable(Database db) async {
      await db.execute('CREATE TABLE tasks (id TEXT PRIMARY KEY, title TEXT)');
  }
}
```
