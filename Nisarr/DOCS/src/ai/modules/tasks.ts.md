# src/ai/modules/tasks.ts

Documentation for `src/ai/modules/tasks.ts`.

## Overview
Handles natural language interaction with the tasks layer. Enables generating rich task objects pre-populated with priorities, due dates, contexts, and bidirectional finance links. For example, asking the AI to "add expense task shopping for 500 taka" correctly flags the `context_type` and `expected_cost`. Completing a finance-linked task triggers mutations to securely deduct the linked funds automatically.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here

class TasksAiExecutor {
  final TaskService taskService;

  TasksAiExecutor(this.taskService);

  Future<void> execute(String action, Map<String, dynamic> data, List<Task> activeTasks) async {
    switch (action) {
      case "ADD_TASK":
        await taskService.addTask({
            'title': data['title'],
            'priority': data['priority'] ?? 'medium',
            'context_type': data['context_type'] ?? 'general',
            'expected_cost': data['expected_cost'],
            'finance_type': data['finance_type']
        });
        break;
      case "COMPLETE_TASK":
         // Search and complete logic...
         break;
    }
  }
}
```
