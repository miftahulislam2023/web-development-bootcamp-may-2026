# src/ai/core/types.ts

Documentation for `src/ai/core/types.ts`.

## Overview
This file standardizes all TypeScript interfaces utilized across the dynamic AI action dispatch system. It shapes the `AIIntent` protocol dictating how the LLM issues generic commands. Moreover, it exposes granular schemas (`TaskHooks`, `FinanceHooks`, etc.) corresponding exactly to properties injected via React Query hooks from the frontend views, proving type-safe bindings between raw LLM string generation and programmatic frontend interactions.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// Translating complex nested types into Dart classes or typedefs

class AIIntent {
  final String action;
  final Map<String, dynamic> data;
  final String responseText;

  AIIntent({
    required this.action,
    required this.data,
    required this.responseText,
  });

  factory AIIntent.fromJson(Map<String, dynamic> json) {
    return AIIntent(
      action: json['action'] as String,
      data: json['data'] as Map<String, dynamic>,
      responseText: json['response_text'] as String,
    );
  }
}

// Hooks equivalent in Dart requires injecting Repositories or Providers mapping to functions.
```
