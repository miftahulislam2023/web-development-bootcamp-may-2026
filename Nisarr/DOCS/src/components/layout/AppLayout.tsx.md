# src/components/layout/AppLayout.tsx

Documentation for `src/components/layout/AppLayout.tsx`.

## Overview
A simple, stateless structural wrapper component applying core padding, maximum width contraints (`max-w-6xl`), and safe-area adjustments for child elements.

## Dart Implementation

This translates perfectly to a standard container with `SafeArea` in Flutter.

```dart
// Flutter implementation skeleton
class AppLayout extends StatelessWidget {
  final Widget child;
  
  AppLayout({required this.child});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: 1200),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
            child: child,
          ),
        ),
      ),
    );
  }
}
```
