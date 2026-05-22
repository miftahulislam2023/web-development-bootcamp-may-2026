# src/hooks/useSettings.ts

Documentation for `src/hooks/useSettings.ts`.

## Overview
A standard state hook using React Query to manage user personalization preferences. Covers `theme`, `currency`, `language`, `monthly_budget`, and `notifications_enabled`.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:flutter/material.dart';

class SettingsRepository extends ChangeNotifier {
  String theme = 'dark';
  String currency = 'BDT';
  String language = 'en';
  bool notificationsEnabled = true;

  Future<void> updateSettings(Map<String, dynamic> updates) async {
     // Apply locally
     if (updates.containsKey('theme')) theme = updates['theme'];
     // Save to SharedPreferences or API
     notifyListeners();
  }
}
```
