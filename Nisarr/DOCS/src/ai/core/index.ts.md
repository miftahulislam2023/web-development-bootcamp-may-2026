# src/ai/core/index.ts

Documentation for `src/ai/core/index.ts`.

## Overview
This is the central orchestration hub for the AI assistant ("Orbit"). It dynamically aggregates prompts from 7 divergent feature modules (Finance, Tasks, Notes, Habits, Study, Inventory, Gym) alongside the core personality matrix to construct a massive, context-aware System Prompt. Once the user's message is parsed by `groq-client`, the `executeAction` function utilizes the provided `hooks` (React Query mutations) to physically act upon the user's intent locally (routing commands to exactly the right mutation).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// In Flutter, replacing React Query hooks involves passing Riverpod/Provider notifiers or BLoC instances.

class AiOrchestrator {
  final TaskRepository taskRepo;
  final FinanceRepository financeRepo;

  AiOrchestrator({required this.taskRepo, required this.financeRepo});

  Future<void> executeAction(Map<String, dynamic> intent) async {
    final action = intent['action'];
    final data = intent['data'];

    switch (action) {
      case 'ADD_TASK':
        await taskRepo.addTask(data);
        break;
      case 'ADD_EXPENSE':
        await financeRepo.addExpense(data);
        break;
      // ... continue mapping actions
    }
  }
}
```
