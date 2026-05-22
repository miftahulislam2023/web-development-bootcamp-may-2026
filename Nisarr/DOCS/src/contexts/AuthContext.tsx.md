# src/contexts/AuthContext.tsx

Documentation for `src/contexts/AuthContext.tsx`.

## Overview
Handles the core global Authentication state for the application.
- Supports **JWT** token-based authentication (persisted via `localStorage` with key `lifeos-token`).
- Implements comprehensive flows: Login, Register, Verify OTP, Forgot Password, Reset Password, and a Google OAuth hook (`googleLogin`).
- Triggers a `fetch` call to `/api/auth/me` on initial mount to validate the stored token against the backend. 

## Dart Implementation

In a Dart flutter app, `localStorage` must be replaced by `shared_preferences` or `flutter_secure_storage`. Global Auth State is best managed by `Riverpod` injecting an `AsyncValue<User?>`.

```dart
// Flutter implementation skeleton via Riverpod & Secure Storage
final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<User?>>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AsyncValue<User?>> {
  final FlutterSecureStorage _storage = FlutterSecureStorage();

  Future<void> login(String email, String password) async {
     state = const AsyncValue.loading();
     // call dart shelf api...
     // _storage.write(key: "lifeos-token", value: token);
  }
}
```
