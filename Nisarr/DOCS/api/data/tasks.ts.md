# api/data/tasks.ts

Documentation for `api/data/tasks.ts`.

## Overview
This file manages the CRUD operations specifically tailored for tasks and subtasks. It handles reading tasks globally, by parent, or by context (e.g., related to study sessions or finance) and includes specialized logic for completing a task which can trigger automated finance logging.

### Supported Endpoints
- **GET `/`**: Retrieves tasks, with special queries for `/context?type=&id=` and `/subtasks?parentId=`.
- **POST `/`**: Creates a new task and assigns default values (`status: "todo"`, `priority: "medium"`) if not provided.
- **PUT `/:id`**: General update for task properties.
- **DELETE `/:id`**: Deletes a task by ID.
- **POST `/complete`**: Marks a task as `done`. If the task represents a financial goal or expense (has `context_type === "finance"` and `expected_cost > 0`), it securely records a new transaction in the `finance` table and updates the related `budgets` total if the type is "income".

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class TasksApi {
  final String baseUrl;
  final String token;

  TasksApi({required this.baseUrl, required this.token});

  Future<List<dynamic>> getTasks() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/data/tasks'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<List<dynamic>> getSubtasks(String parentId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/data/tasks/subtasks?parentId=$parentId'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> createTask(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/tasks'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> updateTask(String id, Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse('$baseUrl/api/data/tasks/$id'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> deleteTask(String id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/data/tasks/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> completeTask(String id) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/tasks/$id/complete'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({'id': id}),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }
}
```
