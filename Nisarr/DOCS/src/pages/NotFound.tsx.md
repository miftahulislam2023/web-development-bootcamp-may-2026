# src/pages/NotFound.tsx

Documentation for `src/pages/NotFound.tsx`.

## Overview
A lightweight 404 error catch-all boundary.
- **Logging**: Implements a `useEffect` observer tracking `location.pathname` to actively log any invalid navigation attempts to the console for routing diagnostics.

## Dart Implementation

In Flutter, standard routing (Navigator 2.0 or `go_router`) maps unknown routes directly to a designated error screen.

```dart
// Flutter implementation skeleton
class NotFoundPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('404', style: TextStyle(fontSize: 48)),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: Text('Return to Home')
            )
          ]
        )
      )
    );
  }
}
```
