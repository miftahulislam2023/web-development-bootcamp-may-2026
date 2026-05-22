# api/data/habits.ts

Documentation for `api/data/habits.ts`.

## Overview
This file process specific logic surrounding Habit tracking, primarily adjusting streaks for users.

### Supported Endpoints
- **POST `/complete`**: Marks a habit as completed for a specific date (defaults to today). It evaluates the provided date against the `last_completed_date` to calculate if the user has maintained their streak:
  - If the completion happens directly the day after the last date, the `streak_count` will increment by 1.
  - If skipped a day, the `streak_count` resets to 1.
  - Handles time-zone normalization.
- **DELETE `/all`**: Deletes all habits for the requesting user.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class HabitsApi {
  final String baseUrl;
  final String token;

  HabitsApi({required this.baseUrl, required this.token});

  Future<Map<String, dynamic>> completeHabit(Map<String, dynamic> habit, String? date) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/habits/complete'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({
        'habit': habit,
        'date': date
      }),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> deleteAllHabits() async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/data/habits/all'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }
}
```
