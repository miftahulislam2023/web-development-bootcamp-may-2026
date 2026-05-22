# api/schemas.ts

Documentation for `api/schemas.ts`.

## Overview
This file defines Zod validation schemas for the backend API. It guarantees type safety and sanitizes incoming request payloads before they hit the controllers and database. 

### Key Schemas
- **GenericObjectSchema**: A generic dictionary validation permitting basic scalar types while enforcing strict alphanumeric (`a-zA-Z0-9_`) constraints on SQL column keys. Prevent SQL injection on dynamic updates.
- **TaskSchema**: Extensive validation for task data, handling optional enumerations for task statuses, priority, context types, financial linkages, and date fields.
- **Gym Schemas**: Validations tailored for reordering exercises, beginning/finishing workout instances, and logging individual lift sets (including metrics like RPE, weight, and rep count).
- **Savings Schemas**: Precise control structures for appending, editing, or deleting saving transactions, enforcing logic such as correct transaction types (`deposit` or `withdraw`).
- **HabitCompleteSchema**: Used to validate habit streak updates with proper nested habit objects and nullable completion dates.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart validation logic similar to Zod schemas
class TaskValidator {
  static void validateTask(Map<String, dynamic> data) {
    if (data['status'] != null) {
      final validStatuses = ['todo', 'in-progress', 'done'];
      if (!validStatuses.contains(data['status'])) {
        throw FormatException('Invalid status');
      }
    }
    if (data['priority'] != null) {
      final validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.contains(data['priority'])) {
        throw FormatException('Invalid priority');
      }
    }
    // More custom dart validations can go here
  }
}
```
