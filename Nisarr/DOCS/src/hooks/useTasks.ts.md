# src/hooks/useTasks.ts

Documentation for `src/hooks/useTasks.ts`.

## Overview
Provides CRUD endpoints wrapped in `@tanstack/react-query` for the global `/data/tasks` endpoint. Contains heavy query invalidation cross-pollinating into `["study"]`, `["finance"]`, and `["budgets"]` because completing a cross-domain Task triggers effects in other pages (i.e., completing a finance task automatically evaluates expected costs).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
class TaskRepository extends ChangeNotifier {
  List<Task> tasks = [];
  
  // Natively in Dart, completion functions should manually notify other Repositories using provider cascades or event buses to replicate `queryClient.invalidateQueries` behavior.
  
  Future<void> completeTask(String id) async {
     // Complete task natively
     // triggerEvent(CustomEvents.TASK_COMPLETED);
     await loadTasks();
  }
}
```
