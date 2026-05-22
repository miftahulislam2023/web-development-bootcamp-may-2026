# src/lib/api.ts

Documentation for `src/lib/api.ts`.

## Overview
Core utility script functioning as an `axios` replacement wrapper around native `fetch`.
- **Auto-Injection**: Pulls `lifeos-token` from `localStorage` and injects it into every Outbound HTTP `Authorization: Bearer` header.
- **Auto-Routing**: Automatically prefixes routes with `/api` relying on `import.meta.env.VITE_BACKEND_URL`.
- **Event Dispatching**: Automatically catches absolute HTTP `401 Unauthorized` responses and fires a global `window.dispatchEvent(new Event("unauthorized"))` to kick the user out of the app.

## Dart Implementation

This translates perfectly to a custom `Dio` interceptor in Flutter, or a wrapped Dart `http.Client`.

```dart
// Dart implementation using Dio Interceptors
final dio = Dio(BaseOptions(baseUrl: "/api"));

dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) async {
    final token = await secureStorage.read(key: "lifeos-token");
    if (token != null) {
      options.headers["Authorization"] = "Bearer $token";
    }
    return handler.next(options);
  },
  onError: (DioException e, handler) {
    if (e.response?.statusCode == 401) {
       // Fire global sign out event stream
    }
    return handler.next(e);
  }
));
```
