# src/components/dashboard/StatCard.tsx

Documentation for `src/components/dashboard/StatCard.tsx`.

## Overview
A generic, reusable, atomic UI component displaying a single statistic. Takes an `icon`, `value`, `title`, and optional `trend` (percentage up/down) object. Colors dynamically shift via standard Tailwind template literals and Framer Motion delay interpolation.

## Dart Implementation

Standard reusable standalone widget pattern in Flutter.

```dart
// Flutter implementation skeleton
class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final TrendData? trend;
  final Color baseColor;

  const StatCard({/* ... */});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: baseColor.withOpacity(0.1),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: baseColor),
            Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text(title, style: Theme.of(context).textTheme.bodySmall),
            if (trend != null) _buildTrendPill(trend!)
          ]
        )
      )
    );
  }
}
```
