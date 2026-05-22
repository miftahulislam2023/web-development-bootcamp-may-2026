# src/lib/validators/gym.ts

Documentation for `src/lib/validators/gym.ts`.

## Overview
A rigid Zod schema definitions file exclusively for validating Gym data mutations before they are sent to the database or processed.
- Exposes `createPlanSchema` preventing empty names.
- Exposes `createExerciseSchema` restricting arbitrary weights (0 to 1000kg).
- Exposes `logSetSchema` validating RPE (1-10) and reps (0-1000).
- Exposes `logMetricSchema` checking realistic biometric constraints (weight 20-500kg, fat 1-99%).

## Dart Implementation

Flutter doesn't have a direct 1:1 `zod` equivalent with exact syntax, but the logic maps to custom Form Validation logic inside `TextFormField` parameters, or using a package like `fluent_validation` or native Dart assertions inside the Data Models before uploading.

```dart
// Flutter form validation skeleton
TextFormField(
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Plan name is required';
    }
    if (value.length > 100) {
      return 'Plan name is too long';
    }
    return null;
  },
);
```
