# src/App.tsx

Documentation for `src/App.tsx`.

## Overview
The root component acting as the global provider wrapper and primary routing node.
- **Providers**: Wraps the app in `GoogleOAuthProvider`, `QueryClientProvider`, `AuthProvider`, `AIProvider`, and `TooltipProvider`.
- **Routing**: Employs `react-router-dom` to map Top-Level views to explicit URLs.
- **Lazy Loading**: Uses `React.lazy` aggressively for all Pages (`Index`, `TasksPage`, `FinancePage`, etc.) wrapper in `React.Suspense` to chunk the Javascript bundle and optimize initial load speed.
- **Dark Mode Init**: Checks `localStorage` on mount to manually append the `.dark` class to the HTML document root.

## Dart Implementation

This translates cleanly to a `main.dart` or `app.dart` entry point employing `MaterialApp.router`.

```dart
// Flutter implementation skeleton using GoRouter
final _router = GoRouter(
  initialLocation: '/welcome',
  routes: [
    GoRoute(
      path: '/welcome',
      builder: (context, state) => WelcomePage(),
    ),
    ShellRoute( // For DashboardLayout equivalents
      builder: (context, state, child) => DashboardLayout(child: child),
      routes: [
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => DashboardPage(),
        ),
      ]
    )
  ]
);

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ProviderScope( // Riverpod equivalent to React Context Wrappers
       child: MaterialApp.router(
          routerConfig: _router,
          themeMode: ThemeMode.system, // Or read from ShredPreferences
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
       )
    );
  }
}
```
