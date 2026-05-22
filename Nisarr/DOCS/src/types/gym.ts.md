# src/types/gym.ts

Documentation for `src/types/gym.ts`.

## Overview
Declares strict TypeScript interfaces and types explicitly for the Gym/Fitness module. Defines entities such as `WorkoutPlan`, `Exercise`, `WorkoutLog`, `SetLog`, `BodyMetric`, `PersonalRecord`, and `GymStats`.

## Dart Implementation

These types must be redefined as explicit Dart classes in a `models` directory. We recommend utilizing the `freezed` and `json_serializable` packages to generate standard boilerplate (like `.fromJson()`, `.toJson()`, and `copyWith()`).

```dart
// Dart implementation using Freezed
@freezed
class Exercise with _$Exercise {
  const factory Exercise({
    required String id,
    required String planId,
    required String name,
    required MuscleGroup muscleGroup,
    required Equipment equipment,
    required int defaultSets,
    required String defaultReps,
    required double defaultWeight,
    String? notes,
    required int orderIndex,
  }) = _Exercise;

  factory Exercise.fromJson(Map<String, dynamic> json) => _$ExerciseFromJson(json);
}
```
