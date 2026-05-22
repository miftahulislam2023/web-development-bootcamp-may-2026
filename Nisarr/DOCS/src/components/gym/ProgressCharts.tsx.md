# src/components/gym/ProgressCharts.tsx

Documentation for `src/components/gym/ProgressCharts.tsx`.

## Overview
Analytics graphs mapping workout metric data to graphical representations via `recharts`.
- Iterates over `workoutHistory` inline, mathematically aggregating all `sets` inside each block to compute an aggregated `weeklyVolume` value.
- Renders a `BarChart` for Volume Progression (last 8 sessions) and a `LineChart` for Body Weight History.

## Dart Implementation

Replace `recharts` with Flutter's `fl_chart`. Complex aggregation logic should ideally be removed from the build method and pre-calculated in a State Provider before rendering.

```dart
// Flutter implementation skeleton using fl_chart
class VolumeProgressChart extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BarChart(
      BarChartData(
        barGroups: [
          // Mapped from normalized Volume array
          BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 5000, color: Colors.purple)]),
        ]
      )
    );
  }
}
```
