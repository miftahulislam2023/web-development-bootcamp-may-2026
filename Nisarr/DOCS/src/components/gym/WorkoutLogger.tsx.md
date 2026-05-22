# src/components/gym/WorkoutLogger.tsx

Documentation for `src/components/gym/WorkoutLogger.tsx`.

## Overview
The active workout session engine.
- **Timer Management**: Utilizes `setInterval` inside `useEffect` to track total elapsed workout time as well as a countdown `restSeconds` timer between sets.
- **Session Setup**: If no `activeLog` exists, forces the user to select a Protocol via a `<Select>` dropdown (auto-selecting today's plan if applicable).
- **Session Execution**: Maps through the chosen plan's `exercises`, rendering an interactive `ExerciseCard` for each one.
- **Debriefing**: Completing a workout pops an intensive `<Dialog>` asking the user for their exact psychological/physiological `Feeling` (Great, Good, Okay, Bad) and optional textual notes, submitting via `gym.finishWorkout`.

## Dart Implementation

This translates to a massive stateful Page or `BottomSheet` orchestrator in Flutter.
- The resting timer should utilize the `wakelock_plus` package to prevent the phone from sleeping while resting.
- `setInterval` maps to Dart's `Timer.periodic`.

```dart
// Flutter Timer logic skeleton
Timer? _workoutTimer;
Timer? _restTimer;

void _startRestTimer() {
  setState(() => restSeconds = 90);
  _restTimer = Timer.periodic(Duration(seconds: 1), (timer) {
     if (restSeconds <= 1) {
       timer.cancel();
       // Trigger local notification or sound
     } else {
       setState(() => restSeconds--);
     }
  });
}
```
