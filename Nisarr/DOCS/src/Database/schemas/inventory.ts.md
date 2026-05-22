# src/Database/schemas/inventory.ts

Documentation for `src/Database/schemas/inventory.ts`.

## Overview
Defines the `inventory` table used to track personal items, assets, warranties, and costs. The initialization function loops through an array of `ALTER TABLE` migrations to cautiously add new columns like `category`, `warranty_expiry`, and `finance_entry_id` without corrupting existing datasets running older schema versions.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:sqflite/sqflite.dart';

Future<void> initInventoryTable(Database db) async {
  await db.execute('''
    CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        item_name TEXT NOT NULL,
        category TEXT,
        quantity INTEGER DEFAULT 1,
        cost REAL,
        purchase_date TEXT,
        store TEXT,
        notes TEXT,
        status TEXT DEFAULT 'active',
        warranty_expiry TEXT,
        finance_entry_id TEXT
    )
  ''');
  
  // Note: Dart migrations should occur natively in openDatabase onUpgrade parameter. 
}
```
