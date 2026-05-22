# src/ai/core/groq-client.ts

Documentation for `src/ai/core/groq-client.ts`.

## Overview
This file handles the frontend's REST communication with the backend AI proxy (`/api/ai/enhance`). It encapsulates the strict prompt management ensuring raw JSON returns and safely parses backend outputs into structured `AIIntent` objects. It is capable of decoding both single actions and batch arrays returned by the intelligence layer.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'dart:convert';
import 'package:http/http.dart' as http;

class AiClient {
  static const String endpoint = 'https://your-backend.com/api/ai/enhance';

  static Future<List<Map<String, dynamic>>> sendPrompt(List<Map<String, String>> messages, String token) async {
    final response = await http.post(
      Uri.parse(endpoint),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({'messages': messages}),
    );
    
    if (response.statusCode != 200) throw Exception('AI Request Failed');
    final data = jsonDecode(response.body);
    
    // Parse the JSON string nested inside 'content'
    final parsedContent = jsonDecode(data['content']);
    
    if (parsedContent['actions'] != null) {
       return List<Map<String, dynamic>>.from(parsedContent['actions']);
    }
    return [parsedContent];
  }
}
```
