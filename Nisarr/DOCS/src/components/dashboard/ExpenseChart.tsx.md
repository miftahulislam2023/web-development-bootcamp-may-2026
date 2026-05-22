# src/components/dashboard/ExpenseChart.tsx

Documentation for `src/components/dashboard/ExpenseChart.tsx`.

## Overview
A wrapper around the `recharts` library's `PieChart` component. Renders a donut chart with hover tooltips and a legend for monthly expenses.

## Dart Implementation

In Flutter, the `fl_chart` package provides a highly customizable `PieChart` that matches this UI.

```dart
// Flutter implementation skeleton using fl_chart
import 'package:fl_chart/fl_chart.dart';

class ExpenseChart extends StatelessWidget {
  final List<ExpenseData> data;
  
  // ... constructor

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 250,
      child: PieChart(
        PieChartData(
          sectionsSpace: 4,
          centerSpaceRadius: 60,
          sections: data.map((e) => PieChartSectionData(
            value: e.value,
            color: Color(int.parse(e.color.replaceAll('#', '0xFF'))),
            radius: 20,
            showTitle: false,
          )).toList(),
        )
      )
    );
  }
}
```
