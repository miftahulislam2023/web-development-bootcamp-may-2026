# src/components/dashboard/TasksAndHabitsCard.tsx

Documentation for `src/components/dashboard/TasksAndHabitsCard.tsx`.

## Overview
A densely partitioned "two-in-one" card that functionally merges the UI logic of `TaskList` and `HabitTracker` while prefixing them with circular `<RadialProgress>` badges to show daily aggregate completion percentage. Heavily reliant on conditional rendering, array slicing (`slice(0, 5)` loops), and internal UI state toggling.

## Dart Implementation

Because this file mixes large blocks of DOM across two conceptual domains (Tasks and Habits), standard Flutter architecture strongly dictates moving these into their own private stateless classes (e.g., `_RecentTasksSubcard`, `_HabitsSubcard`) and calling them from the main `TasksAndHabitsCard` `build` method.

```dart
// Flutter implementation skeleton
class TasksAndHabitsCard extends StatelessWidget {
  // ...props

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _RecentTasksSection(
          tasks: pendingTasks, 
          rate: taskCompletionRate
        ),
        SizedBox(height: 16),
        _HabitsSection(
          habits: allHabits, 
          rate: habitCompletionRate, 
          streak: bestStreak
        )
      ]
    );
  }
}
```
