# src/hooks/useTheme.tsx

Documentation for `src/hooks/useTheme.tsx`.

## Overview
A lightweight local state hook managing DOM injections (`root.classList.add(theme)`) to paint CSS generic color modes using `tailwind` prefixes (`dark:`). Reads and restores from `localStorage` (`lifeos-theme`).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:flutter/material.dart';

// In Flutter, this is completely abstracted by `MaterialApp(themeMode: ThemeMode.dark)`
// and updated through standard state providers.
class ThemeController extends ChangeNotifier {
   ThemeMode mode = ThemeMode.dark;

   void toggle() {
      mode = mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
      // Save SharedPreferences
      notifyListeners();
   }
}
```
