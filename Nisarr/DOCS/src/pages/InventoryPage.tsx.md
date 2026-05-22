# src/pages/InventoryPage.tsx

Documentation for `src/pages/InventoryPage.tsx`.

## Overview
A management view mapping `InventoryItem` data. Contains table formatting (`List` mode via `shadcn UI` Tables) vs grid card formatting (`Grid` mode via CSS grids).
- Handles complex sorting dynamically across Object column key references natively on the frontend (`sortConfig.key`).
- Showcases deep AI integration directly inline using a generic `<SmartFillButton />` logic. Passing schema instructions defining "category", "cost", "quantity", triggering the LLM schema inference endpoint to parse standard English sentences directly into the New Item JSON.

## Dart Implementation

For displaying complex tables dynamically sorting across keys in Flutter, utilize `DataTable` or the `syncfusion_flutter_datagrid`.

```dart
// Flutter implementation skeleton
class InventoryPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2, // List vs Grid mode
      child: Scaffold(
        appBar: AppBar(
           actions: [SmartAIEntryButton()], // Triggers natural language prompt to JSON
        ),
        body: TabBarView(
          children: [
             buildGridView(),
             buildListView(), // DataTable(columns: [...], rows: [...])
          ]
        )
      )
    );
  }
}
```
