# src/components/gym/WorkoutStreak.tsx

Documentation for `src/components/gym/WorkoutStreak.tsx`.

## Overview
A visual badge displaying the user's active workout streak. Includes conditional CSS classes to change the flame icon's color/animation (pulsing red drop-shadow) based on thresholds (`isHot >= 3`, `isFire >= 7`). Wrapped in a `<Tooltip>` for explicit text explanations.

## Dart Implementation

Translates to a `Container` with changing logic inside its `BoxDecoration`.

```dart
// Flutter implementation skeleton
Widget _buildStreakBadge(int streak) {
  final isFire = streak >= 7;
  return Tooltip(
    message: '$streak day streak!',
    child: Container(
      // Apply red glowing shadows if isFire is true
      decoration: BoxDecoration(
        boxShadow: isFire ? [BoxShadow(color: Colors.red, blurRadius: 8)] : []
      ),
      child: Row(
        children: [
          Icon(Icons.local_fire_department, color: isFire ? Colors.red : Colors.orange),
          Text('$streak')
        ]
      )
    )
  );
}
```
