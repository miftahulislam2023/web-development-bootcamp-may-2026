# api/index.ts

Documentation for `api/index.ts`.

## Overview
This is the root serverless function handler for the Vercel deployment. It serves as the primary router and authentication controller for the backend API, negating the need for Express. 

### Key Responsibilities
- **Authentication**: Handles user registration, email verification (via OTP), login, Google OAuth integration, and password resets securely. Connects via SMTP using environment credentials to send OTP emails.
- **Routing**: Acts as an API Gateway. Validates JWT authorization for all `/api/data/*` routes and dispatches them to their respective controllers (`handleTasks`, `handleGym`, `handleBudget`, `handleHabits`, or `handleGenericCRUD`).
- **AI Integration Endpoint**: Provides a proxy endpoint (`/api/ai/enhance`) that connects to HuggingFace models (`Qwen3.5-122B-A10B`) utilizing the `VITE_HF_API_KEY`. It includes an automatic fallback to Groq (`llama-3.1-8b-instant`) if the HuggingFace endpoint fails or the key is not configured.
- **Health Check**: Exposes `/api/health` to verify environment variable initialization status.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthApi {
  final String baseUrl;

  AuthApi({required this.baseUrl});

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200) throw Exception(data['error'] ?? 'Login failed');
    return data;
  }

  Future<Map<String, dynamic>> register(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200) throw Exception(data['error'] ?? 'Registration failed');
    return data;
  }

  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/verify'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'otp': otp}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200) throw Exception(data['error'] ?? 'Verification failed');
    return data;
  }
}
```
