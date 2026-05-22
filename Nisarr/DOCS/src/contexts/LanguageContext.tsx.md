# src/contexts/LanguageContext.tsx

Documentation for `src/contexts/LanguageContext.tsx`.

## Overview
A lightweight global context for managing the application's target language (`en` vs `bn`). 
- Persists user prefix via `localStorage` -> `lifeos-language`.
- Exposes a `t(key)` function to translate text globally (though currently serving as a passthrough placeholder for actual dictionary integration).

## Dart Implementation

Flutter has highly robust native localization support via `flutter_localizations` and the `intl` package.

```dart
// Flutter localization implementation
// Inside pubspec.yaml: generate: true
// A global provider can change the Locale
final localeProvider = StateProvider<Locale>((ref) => Locale('en'));

// In widgets
Text(AppLocalizations.of(context)!.welcomeTitle)
```
