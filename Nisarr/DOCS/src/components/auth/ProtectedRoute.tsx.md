# src/components/auth/ProtectedRoute.tsx

Documentation for `src/components/auth/ProtectedRoute.tsx`.

## Overview
A Higher-Order Component (HOC) guarding internal application routes.
- Assesses `isAuthenticated` and `isLoading` from `useAuth()`.
- Implements route retention by passing `location` into `state={{ from: location }}` ensuring seamless redirection post-authentication.

## Dart Implementation

Modern Flutter routing handled by `go_router` typically manages route-guards via application-level `redirect` assertions inside the GoRouter config, evaluating a global Listenables.

```dart
// Flutter implementation skeleton
final router = GoRouter(
  redirect: (context, state) {
    final isAuthenticated = AuthService.instance.isAuthenticated;
    if (!isAuthenticated && state.subloc != '/welcome') {
       return '/welcome?redirectTo=${state.subloc}';
    }
    return null;
  },
  //...
);
```
