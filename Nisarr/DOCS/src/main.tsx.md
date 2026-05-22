# src/main.tsx

Documentation for `src/main.tsx`.

## Overview
The standard Vite React bootstrap entrypoint.
Attaches the React DOM tree to the `root` `div`, wrapping `<App />` with `<HelmetProvider>` (for SEO/meta controls) and `<LanguageProvider>` for translation context.

## Dart Implementation

Maps entirely to the `void main()` function inside Flutter's `main.dart`.

```dart
// Flutter equivalent
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ProviderScope( // Replaces Context Providers
       child: App()
    )
  );
}
```
