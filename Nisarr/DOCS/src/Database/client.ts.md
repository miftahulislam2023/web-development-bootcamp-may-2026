# src/Database/client.ts

Documentation for `src/Database/client.ts`.

## Overview
This file initializes the primary connection to the LibSQL/Turso database for the frontend client utilizing `@libsql/client`. It pulls the connection URL and Auth Token directly from Vite environment variables. It also provides a global `generateId` utility wrapping `crypto.randomUUID()` used extensively when scaffolding new data rows client-side before sync.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// In Dart/Flutter, frontend clients do not usually connect directly to the database for security reasons.
// They use the REST API. However, if using a local SQLite replica:

import 'package:uuid/uuid.dart';

class DatabaseClient {
  static const Uuid uuid = Uuid();
  
  static String generateId() {
    return uuid.v4();
  }
}
```
