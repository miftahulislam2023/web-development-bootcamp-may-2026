# src/hooks/useFinance.ts

Documentation for `src/hooks/useFinance.ts`.

## Overview
The central ledger orchestrator for the application, built on `@tanstack/react-query`. Interacts with `/data/finance` to track `income` and `expense` entries. Automatically groups data into `regularEntries` and `specialEntries` to compute real-time balances and aggregates data into `expensesByCategory` maps for Chart visualizations. Executes date sanitation logic dynamically formatting user-time offsets properly for ISO storage. Mutations invalidate the `["finance", userId]` cache forcing dashboard rerenders.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:flutter/material.dart';

class FinanceRepository extends ChangeNotifier {
  List<FinanceEntry> entries = [];
  bool isLoading = true;
  
  // Aggregate Views built natively in Dart getters
  List<FinanceEntry> get regularEntries => entries.where((e) => !e.isSpecial).toList();
  List<FinanceEntry> get specialEntries => entries.where((e) => e.isSpecial).toList();
  
  double get balance {
     final incomes = regularEntries.where((e) => e.type == 'income').fold<double>(0, (p, c) => p + c.amount);
     final expenses = regularEntries.where((e) => e.type == 'expense').fold<double>(0, (p, c) => p + c.amount);
     return incomes - expenses;
  }

  Future<void> loadEntries() async {
     // Fetch directly from `sqflite` querying by user_id
     // e.g. `final raw = await db.query('finance_entries');`
     notifyListeners();
  }

  Future<void> addEntry(FinanceEntry entry) async {
     // Insert
     // e.g. `await db.insert('finance_entries', entry.toMap());`
     await loadEntries();
  }

  Future<void> deleteEntry(String id) async {
     // e.g. `await db.delete('finance_entries', where: 'id = ?', whereArgs: [id]);`
     await loadEntries();
  }
}
```
