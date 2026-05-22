# src/hooks/use-mobile.tsx

Documentation for `src/hooks/use-mobile.tsx`.

## Overview
A simple React hook for responsive UI detection. Default mobile breakpoint is set to `768px`. Attaches an event listener to `window.matchMedia` to trigger React state updates dynamically on resize, guaranteeing layout logic updates (e.g. collapsing the Sidebar) without relying purely on CSS media queries.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'package:flutter/material.dart';

// In Flutter, MediaQuery handles this natively without explicit hooks.
// You can build a helper or just read `MediaQuery.of(context).size.width` directly.

bool isMobile(BuildContext context) {
   return MediaQuery.of(context).size.width < 768;
}

// Or an extension method for cleaner syntax
extension MobileCheck on BuildContext {
   bool get isMobile => MediaQuery.of(this).size.width < 768;
}
```
