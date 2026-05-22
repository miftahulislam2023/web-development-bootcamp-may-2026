# src/ai/modules/habits.ts

Documentation for `src/ai/modules/habits.ts`.

## Overview
A concise AI action module focused solely on Habit configuration. The `HABIT_PROMPT` instructs the LLM to deduce habit parameters natively (e.g., understanding "read" belongs to the "learning" category). During execution, deletions or completions parse through the currently active `hooks.habits` array to dynamically find exact internal ID matches using `.toLowerCase().includes(...)` fuzzy matching.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here

class HabitAiExecutor {
  final HabitService habitService;

  HabitAiExecutor(this.habitService);

  Future<void> execute(String action, Map<String, dynamic> data, List<Habit> activeHabits) async {
    switch (action) {
      case "ADD_HABIT":
        await habitService.addHabit(data['name'], data['category'] ?? 'general');
        break;
      case "COMPLETE_HABIT":
        final searchTerm = (data['name'] ?? '').toString().toLowerCase();
        try {
          final target = activeHabits.firstWhere((h) => h.name.toLowerCase().contains(searchTerm));
          await habitService.completeHabit(target.id);
        } catch (e) {
           // Handle not found
        }
        break;
    }
  }
}
```
