# src/hooks/useNavPreferences.ts

Documentation for `src/hooks/useNavPreferences.ts`.

## Overview
A strictly localized hook that handles user personalization of the generic `BottomNav` bar limits. Limits visible icons to `MAX_SHORTCUTS = 4`. Automatically saves to `localStorage` under `lifeos-nav-shortcuts`. Handles logic for `mainNavItems` vs `moreNavItems` array splitting preventing the user from completely emptying the navigation array.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';

// Because Flutter mobile requires persistent navigation tabs to look clean, 
// abstract this natively using SharedPreferences.

class NavPreferences extends ChangeNotifier {
  List<String> pinnedIds = ['dashboard', 'tasks', 'finance', 'notes'];

  Future<void> loadPrefs() async {
     final prefs = await SharedPreferences.getInstance();
     final stored = prefs.getStringList('nav_prefs');
     if (stored != null && stored.isNotEmpty) {
        pinnedIds = stored;
        notifyListeners();
     }
  }

  void toggleShortcut(String id) {
     if (pinnedIds.contains(id)) {
        if (pinnedIds.length > 1) pinnedIds.remove(id);
     } else {
        if (pinnedIds.length < 4) pinnedIds.add(id);
     }
     // save to prefs
     notifyListeners();
  }
}
```
