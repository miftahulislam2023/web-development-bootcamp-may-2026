# src/hooks/useGym.ts

Documentation for `src/hooks/useGym.ts`.

## Overview
An extensively complex state aggregator managing the entirety of the `Gym` module. It loads `plans`, `workoutHistory`, `metrics`, `personalRecords`, and tracks live analytics via `gymStats` (aggregating total volume lifted, longest streaks, total workouts, PRs, etc.).
Features:
- Handles the active workout session in `localStorage` securely via `localStorage.getItem('gym_active_log_id')` to restore WIP sessions across browser reloads.
- Abstracts data validation logic using `zod` schemas imported from `@/lib/validators/gym` before POSTing to the `/data/gym/*` endpoints.
- Calculates `currentStreak` using complex date arithmetic over the sorted `workoutHistory` array.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
class GymRepository extends ChangeNotifier {
  List<WorkoutPlan> plans = [];
  List<WorkoutLog> workoutHistory = [];
  GymStats stats = GymStats.empty();
  WorkoutLog? activeLog;

  Future<void> initialize() async {
     // Run parallel SQLite fetches
     // await Future.wait([fetchPlans(), fetchHistory(), ...])
     // Restore active log from SharedPreferences
     _calculateStats();
  }
  
  void _calculateStats() {
     // Replicate JS streak logic in Dart date comparisons
     // E.g., using `DateTime.now().difference(logDate).inDays`
  }
  
  Future<String> startWorkout(String planId) async {
     // db.insert('gym_workout_logs')
     // SharedPreferences.setString('active_log', id);
     // notifyListeners();
     return id;
  }
}
```
