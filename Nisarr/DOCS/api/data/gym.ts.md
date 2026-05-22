# api/data/gym.ts

Documentation for `api/data/gym.ts`.

## Overview
This file manages the specialized backend operations regarding the Gym tracker. While generic CRUD handles getting and creating simple lists of workouts, this file handles complex logic like calculating Personal Records (PRs), auto-calculating 1RM (One-Rep Max) via the Epley formula, and reordering exercises.

### Supported Endpoints
- **POST `/exercises/reorder`**: Updates the `order_index` for a list of exercises in a workout plan sequentially.
- **POST `/workouts/start`**: Initializes a new gym workout log session and records the start time. Handled with DB field fallbacks depending on schema versions.
- **POST `/workouts/finish`**: Marks an active gym session as complete, adding overall feeling, duration, and notes.
- **POST `/sets/log`**: Processes a logged set by calculating its 1RM to deduce if it's a new Personal Record, compares it to the previous PR in `gym_personal_records`, updates the PR table if necessary, and finally logs the set into `gym_set_logs`.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class GymApi {
  final String baseUrl;
  final String token;

  GymApi({required this.baseUrl, required this.token});

  Future<Map<String, dynamic>> reorderExercises(List<Map<String, dynamic>> exercises) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/gym/exercises/reorder'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({'exercises': exercises}),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> startWorkout(String planId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/gym/workouts/start'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({'planId': planId}),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> finishWorkout(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/gym/workouts/finish'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> logSet(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/gym/sets/log'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }
}
```
