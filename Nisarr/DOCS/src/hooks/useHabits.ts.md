# src/hooks/useHabits.ts

Documentation for `src/hooks/useHabits.ts`.

## Overview
A lightweight state manager for the `Habits` feature using `@tanstack/react-query`. Wraps `/data/habits` endpoints. Automatically enriches data by merging `category` fallbacks to `"general"`. It manages an array of immutable categories (`HABIT_CATEGORIES`) defining allowed labels and emojis globally (`"health"`, `"productivity"`, etc.).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
class HabitsRepository extends ChangeNotifier {
  List<Habit> habits = [];

  // Expose static categories list
  static const List<Map<String, String>> categories = [
    {"value": "health", "emoji": "💪"},
    // ...
  ];

  Future<void> completeHabit(Habit habit, [String? date]) async {
    // API equivalent logic: update SQLite streak counts natively
    // `UPDATE habits SET streak_count = streak_count + 1 WHERE id = ?`
    await loadHabits();
  }
}
```
