# api/utils.ts

Documentation for `api/utils.ts`.

## Overview
This file provides core backend utilities necessary for the functioning of the application. It acts as the backbone for database connectivity, authentication standards, and cross-origin controls.

### Features
- **Database Client**: Initializes the Turso libSQL SQLite Edge database client using environment variables (`TURSO_DB_URL` and `TURSO_AUTH_TOKEN`).
- **JWT Authentication Handlers**: 
  - `signToken`: Mints JSON Web Tokens with a 7-day expiration integrating the user's secure details.
  - `verifyToken`: Decrypts and authenticates provided JWT strings, guarding against manipulated or timed-out requests.
- **CORS Configurator**: A helper function `setCors` configured to widely allow standard `Access-Control` methods (`GET`, `POST`, `OPTIONS`, `PUT`, `DELETE`) and critical headers across the platform.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// In Dart frontend applications, these utilities typically translate to 
// interceptors or global singleton managers for JWTs

import 'package:shared_preferences/shared_preferences.dart';

class AuthManager {
  static const String _tokenKey = 'jwt_token';

  // Saving the JWT token returned by node endpoints (like verifyToken/signToken logic on backend)
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }
}
```
