# src/components/dashboard/TaskList.tsx

Documentation for `src/components/dashboard/TaskList.tsx`.

## Overview
A standard un-paginated mapped list mapping over an array of `Task` objects. Employs conditional styling for strikethrough on completion (`status === 'done'`) and mapping a specific priority dictionary (`priorityColors`) to render distinct alert colors inline.

## Dart Implementation

Translates perfectly to a mapped `Column` of `ListTiles` or custom row widgets.

```dart
// Flutter implementation skeleton
class TaskList extends StatelessWidget {
  final List<Task> tasks;
  
  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high': return Colors.red;
      case 'medium': return Colors.orange;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: tasks.map((t) => Row(
        children: [
          Checkbox(value: t.status == 'done', onChanged: (v) {}),
          Expanded(child: Text(t.title)),
          Icon(Icons.flag, color: _getPriorityColor(t.priority))
        ]
      )).toList()
    );
  }
}
```
