# src/ai/modules/gym.ts

Documentation for `src/ai/modules/gym.ts`.

## Overview
Defines the `gymModule` instructing the AI (nicknamed Nova here) on managing gym interactions. Includes bilingual (Bengali/English) prompt rules enabling natural logging of sets (e.g., "Bench press 80kg 5 reps"). Unlike basic CRUD arrays, parsing gym features requires accessing structured active states (`activeLog`, `todaysPlan`), navigating the user securely to the gym UI via `NAVIGATE_GYM`, and firing custom localized toast notifications if prerequisites (like starting a workout) are unmet.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here

class GymAiExecutor {
  final GymService gymService;
  final NavigationService navService;
  final ToastService toastService;

  GymAiExecutor(this.gymService, this.navService, this.toastService);

  Future<void> execute(String action, Map<String, dynamic> data, GymState state) async {
    switch (action) {
      case "LOG_GYM_SET":
        if (state.activeLog != null) {
          await gymService.logSet(state.activeLog!.id, {
            'exerciseName': data['exerciseName'],
            'weight': data['weight'],
            'reps': data['reps'],
          });
        } else {
          toastService.show("দয়া করে আগে একটি Workout শুরু করুন!"); // Start workout first
        }
        break;
      case "NAVIGATE_GYM":
        navService.navigateTo('/gym');
        break;
    }
  }
}
```
