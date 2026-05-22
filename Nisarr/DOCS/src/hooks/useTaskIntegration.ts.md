# src/hooks/useTaskIntegration.ts

Documentation for `src/hooks/useTaskIntegration.ts`.

## Overview
A wrapper or orchestrator hook designed to abstract `useTasks` logic and bind it symbiotically to other domains (`useStudy`, `useBudget`, `useHabits`). Converts generic actions (e.g., scheduling a chapter) directly into a standardized `Task` payload with embedded `context_type` and `context_id` properties.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
class TaskIntegrationService {
  final TaskRepository tasks;
  
  TaskIntegrationService(this.tasks);

  Future<void> createStudyTask(StudyChapter chapter) async {
     await tasks.addTask(Task(
        title: 'Study: \${chapter.name}',
        contextType: 'study',
        contextId: chapter.id,
        // ...
     ));
  }
}
```
