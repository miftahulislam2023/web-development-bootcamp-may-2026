# src/pages/FinancePage.tsx

Documentation for `src/pages/FinancePage.tsx`.

## Overview
A comprehensive expense and income tracker rendering high-level charts, grids, and PDF exports.
- **Complex View Modes**: Allows filtering states by `daily | weekly | monthly | yearly | custom | all`. Extensive date mathematical calculation natively on the client using `Date()` prototypes.
- **PDF Generation**: Uses `jspdf` and `jspdf-autotable` to generate dynamic PDF reports showing balance sheets.
- **Visuals**: Uses `recharts` to render `PieChart` and `LineChart` for income/expense categorization trends.
- **Interconnectivity**: Tracks budget progress and savings goals fetched from `useBudget`.

## Dart Implementation

To implement this screen in Flutter:
- Replace `recharts` with the `fl_chart` library to draw pie charts and trend lines.
- Sub-components for filtering should use native `showModalBottomSheet()` combined with `CupertinoPicker` for seamless date selection.
- For PDF generation, use the `pdf` package in Dart (`import 'package:pdf/widgets.dart' as pw;`).

```dart
// Flutter implementation skeleton
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class FinancePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddEntryBottomSheet(context),
        child: Icon(Icons.add),
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: _buildHeaderViewControls()),
          SliverToBoxAdapter(child: _buildPieChart()),
          SliverList(delegate: SliverChildBuilderDelegate(
            // Map entries
          ))
        ]
      )
    );
  }
}
```
