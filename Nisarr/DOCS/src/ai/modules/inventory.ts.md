# src/ai/modules/inventory.ts

Documentation for `src/ai/modules/inventory.ts`.

## Overview
Connects unstructured user asset management requests to the Inventory CRUD layer. The AI is specifically prompted to recognize item updates contextually ("sold my old phone" -> updates status to `"sold"`, "bought 5 pens" -> sets `quantity: 5` and `status: active`). It uses fuzzy matching against the `hooks.items` array to pinpoint exact entity IDs before firing mutative queries.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here

class InventoryAiExecutor {
  final InventoryService inventoryService;

  InventoryAiExecutor(this.inventoryService);

  Future<void> execute(String action, Map<String, dynamic> data, List<InventoryItem> items) async {
    switch (action) {
      case "ADD_INVENTORY":
        await inventoryService.addItem({
           'item_name': data['item_name'],
           'quantity': data['quantity'] ?? 1,
           'category': data['category'] ?? 'General',
        });
        break;

      case "UPDATE_INVENTORY":
        final searchTerm = (data['item_name'] ?? '').toString().toLowerCase();
        try {
          final target = items.firstWhere((i) => i.itemName.toLowerCase().contains(searchTerm));
          // Apply sparse updates
          final updatePayload = {...target.toJson(), ...data};
          await inventoryService.updateItem(updatePayload);
        } catch (e) {
          // Ignore or handle
        }
        break;
    }
  }
}
```
