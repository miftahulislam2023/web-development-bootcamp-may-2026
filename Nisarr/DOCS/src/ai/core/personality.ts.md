# src/ai/core/personality.ts

Documentation for `src/ai/core/personality.ts`.

## Overview
This file contains the monolithic string definitions for `ORBIT_PERSONALITY` and `RESPONSE_EXAMPLES`. It dictates the conceptual bounds of the AI, teaching it to be an omniscient, time-aware life advisor. Crucially, it instructs the AI on the explicit JSON formatting necessary to trigger the single-action or nested array batch-action parsers utilized heavily by the `executeAction` coordinator.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// Static strings remain identical in Dart logic when constructing prompts.

class AIPersonality {
  static const String orbitPersonality = '''
    You are Orbit, the user's AI life advisor in LifeSolver...
    (Copy exact string definitions)
  ''';
  
  static const String responseExamples = '''
    User: "spent 200 on coffee"
    -> {"action": "ADD_EXPENSE", ...}
  ''';
}
```
