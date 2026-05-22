# src/components/gym/GymDashboard.tsx

Documentation for `src/components/gym/GymDashboard.tsx`.

## Overview
The "landing page" dashboard component specifically governing the Gym/Fitness module.
- Generates a large primary Bento box (suggesting the user's *Daily Objective* utilizing `getTodaysPlan`) featuring a massive action button (`onStartWorkout`).
- Displays 4 top-level lifetime statistics (`totalWorkouts`, `totalPRs`, `totalVolumeLiftedKg`, `avgWorkoutDuration`) utilizing a reused inline `StatCard` definition.
- Displays a `Recent Activity` section mapping over the 3 most recent workouts.

## Dart Implementation

Constructed via a `SingleChildScrollView` wrapped `Column` featuring nested `Row` and `Card` components, utilizing `LayoutBuilder` if needing grid-style collapsing.

```dart
// Flutter implementation skeleton
class GymDashboard extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SingleChildScrollView(
      child: Column(
        children: [
          _buildHeroBento(), // Big daily objective + start button
          Row(
            children: [
               _buildStat(Icons.local_fire_department, "Total Workouts", "34"),
               _buildStat(Icons.star, "PRs Smashed", "12"),
            ]
          ),
          _buildRecentActivityList()
        ]
      )
    );
  }
}
```
