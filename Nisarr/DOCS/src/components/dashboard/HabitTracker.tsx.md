# src/components/dashboard/HabitTracker.tsx

Documentation for `src/components/dashboard/HabitTracker.tsx`.

## Overview
A simplified list view specifically for daily habits. It renders a mapped array of styled rows featuring a toggle button, strikethrough logic upon completion, and a flame icon indicating streak count.

## Dart Implementation

This perfectly aligns with Flutter's `ListView.builder` or a simple `Column` mapping `ListTile` widgets, using `IconButton` for the check/cross toggle.

```dart
// Flutter implementation skeleton
class HabitTrackerCard extends StatelessWidget {
  final List<Habit> habits;
  final Function(String) onToggle;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: habits.map((h) => ListTile(
          leading: IconButton(
            icon: Icon(h.completedToday ? Icons.check : Icons.close),
            onPressed: () => onToggle(h.id)
          ),
          title: Text(
            h.name, 
            style: TextStyle(
              decoration: h.completedToday ? TextDecoration.lineThrough : null
            )
          ),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.local_fire_department, color: Colors.orange),
              Text('${h.streak}')
            ]
          )
        )).toList(),
      )
    );
  }
}
```
