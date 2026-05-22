# scripts/dev-api.ts

Documentation for `scripts/dev-api.ts`.

## Overview
This file serves as a local development proxy server utilizing Express. Its main purpose is to mirror the Vercel Serverless environment locally, running on port 4000. It dynamically imports the root Vercel handler (`api/index.ts`), allowing developers to test authentication, AI features, and backend routes seamlessly during local frontend development. Extensively makes use of `dotenv` to emulate Vercel's environment variables safely using `.env` and `.env.local` files.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// Since this is purely a server-side development script, Dart frontend code does not implement this.
// However, the Dart frontend SHOULD configure its base URL dynamically to connect to this server during development.

class ApiConfig {
  // Use 10.0.2.2 for Android Emulator connecting to localhost:4000
  // Use localhost:4000 for regular Web or iOS simulators
  static const String devBaseUrl = 'http://10.0.2.2:4000';
  static const String prodBaseUrl = 'https://your-production-url.com';

  static String get baseUrl => isProduction ? prodBaseUrl : devBaseUrl;
  static bool get isProduction => const bool.fromEnvironment('dart.vm.product');
}
```
