# api/data/generic.ts

Documentation for `api/data/generic.ts`.

## Overview
This file serves as a unified, generic CRUD (Create, Read, Update, Delete) controller for various tables in the application. It dynamically handles database operations for any table listed in the `ALLOWED_TABLES` array, preventing unauthorized table access.

### Supported Endpoints
- **GET `/:table`**: Retrieves all records for the specified user from the given table. For user `settings`, it acts as a singleton. Handles fallback for tables without a `created_at` column.
- **POST `/:table`**: Generates a generic UUID (if not provided) and dynamically queries the given properties to insert a new record into the specified table.
- **PUT `/:table/:id`**: Iterates over the properties in the request body to dynamically construct an `UPDATE` query for the table and specific `id`.
- **DELETE `/:table/:id`**: Extracts the ID from the URL or fallback body and deletes the record.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class GenericApi {
  final String baseUrl;
  final String token;

  GenericApi({required this.baseUrl, required this.token});

  Future<List<dynamic>> getAll(String table) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/data/$table'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> create(String table, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/data/$table'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> update(String table, String id, Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse('$baseUrl/api/data/$table/$id'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }

  Future<Map<String, dynamic>> delete(String table, String id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/data/$table/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode != 200) throw Exception(response.body);
    return jsonDecode(response.body);
  }
}
```
