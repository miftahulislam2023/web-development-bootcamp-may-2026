# src/components/study/StudyAnalytics.tsx

Documentation for `src/components/study/StudyAnalytics.tsx`.

## Overview
A dual-chart dashboard exclusively for Study progression metrics.
- Uses `recharts` to render a `BarChart` representing `progress` % per subject.
- Uses a `PieChart` to break down the total corpus of `parts` by status (Completed, In Progress, Not Started).

## Dart Implementation

Migrating to `fl_chart` allows near-perfect replication of these analytical views.

```dart
// Flutter implementation skeleton using fl_chart for the Pie section
class StudyAnalytics extends StatelessWidget {
  // ...props
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildBarChart(), // Maps to horizontal/vertical BarChart
        _buildPieChart()  // Maps to PieChart with 3 designated sections
      ]
    );
  }
}
```
