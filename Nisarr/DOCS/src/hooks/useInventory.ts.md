# src/hooks/useInventory.ts

Documentation for `src/hooks/useInventory.ts`.

## Overview
A complex hook managing `InventoryItem` data. Specifically handles cross-domain integration:
- When calling `addItem` with `record_purchase = true` and a valid cost, it intercepts the call and immediately chains an injection into `/data/finance` (Finance Tracker) to automatically record the expenditure, linking them via `finance_entry_id`.
- When calling `markAsSold(id, salePrice)`, it marks the status as `"sold"` locally, and automatically chains into `/data/finance` as an `"income"` entry.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
class InventoryRepository extends ChangeNotifier {
  final FinanceRepository financeRepo; // Inject dependency
  List<InventoryItem> items = [];

  InventoryRepository(this.financeRepo);

  Future<void> addItem(InventoryItem item, {bool recordPurchase = false}) async {
     String? financeId;
     if (recordPurchase && item.cost > 0) {
        // Automatically interact with Finance module natively via SQLite transactions
        financeId = await financeRepo.insertExpense(
           amount: item.cost, 
           category: 'Shopping', 
           desc: 'Purchase: \${item.name}'
        );
     }
     
     // db.insert('inventory', item.toMap(financeId));
     await loadItems();
  }
}
```
