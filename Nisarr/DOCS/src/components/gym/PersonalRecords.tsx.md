# src/components/gym/PersonalRecords.tsx

Documentation for `src/components/gym/PersonalRecords.tsx`.

## Overview
Provides a stylized "Hall of Fame" view for the user's gym Personal Records (PRs).
- Evaluates the top 3 overall PRs via sorting by date.
- Employs heavier CSS gradients (`bg-gradient-to-br from-yellow-100...`) and specialized Framer Motion Entrance springs for the top 3 items to make them feel highly "premium".
- Includes dynamic calculation estimating a 1-Rep Max (1RM) based on Brzycki's formula projection (`weight * (1 + reps / 30)`).

## Dart Implementation

Translates to mapped Flutter `Card` widgets evaluating `index < 3` to apply distinct `BoxDecoration` variants (yellow gradients vs flat grey ones).

```dart
// Flutter implementation skeleton
Widget _buildPRCard(PersonalRecord pr, int index) {
  final bool isTop3 = index < 3;
  return Container(
    decoration: BoxDecoration(
      gradient: isTop3 
        ? LinearGradient(colors: [Colors.yellow.withOpacity(0.1), Colors.black])
        : null
    ),
    child: Column(
       // Card logic rendering ExerciseName, Weight text, and Estimated 1RM
    )
  );
}
```
