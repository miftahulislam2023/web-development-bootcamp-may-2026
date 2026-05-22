# src/components/layout/AnimatedPage.tsx

Documentation for `src/components/layout/AnimatedPage.tsx`.

## Overview
A wrapper component integrating `framer-motion` to provide smooth page transitions (fade and slide up/down) when routing between pages. It utilizes `useLocation` to determine the key for `AnimatePresence`.

## Dart Implementation

In Flutter, page transitions are typically handled at the router level (e.g., using `PageRouteBuilder` or transitions in `go_router`), rather than wrapping the child widget itself.

```dart
// Flutter implementation skeleton using go_router
GoRoute(
  path: '/dashboard',
  pageBuilder: (context, state) => CustomTransitionPage(
    key: state.pageKey,
    child: DashboardPage(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: animation,
        child: SlideTransition(
          position: Tween<Offset>(begin: Offset(0, 0.05), end: Offset.zero).animate(animation),
          child: child,
        ),
      );
    },
  ),
)
```
