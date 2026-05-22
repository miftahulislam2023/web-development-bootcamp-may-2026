# src/Database/schemas/index.ts

Documentation for `src/Database/schemas/index.ts`.

## Overview
This is a standard barrel file used to cleanly export all the distributed database schemas and their specific table initialization functions (`initUsersTable`, `initTasksTable`, `initGymTables`, etc.) from a single module entry point. This keeps imports tidy across the frontend application.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// In Dart, this is equivalent to creating an `index.dart` or `schemas.dart` file using the `export` keyword.

// lib/database/schemas.dart
export 'users_schema.dart';
export 'tasks_schema.dart';
export 'finance_schema.dart';
export 'notes_schema.dart';
export 'habits_schema.dart';
export 'inventory_schema.dart';
export 'study_schema.dart';
export 'gym_schema.dart';
```
