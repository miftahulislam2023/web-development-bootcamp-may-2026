# src/components/NavLink.tsx

Documentation for `src/components/NavLink.tsx`.

## Overview
A custom wrapper around `react-router-dom`'s `NavLink`. 
It intercepts the `className` function provided by `react-router` (which exposes `isActive` and `isPending` properties) and maps them elegantly mapping via `clsx` / `tailwind-merge` (`cn` utility) into separate `activeClassName` and `pendingClassName` props for much cleaner component consumption.

## Dart Implementation

Flutter manages routing visually via custom `BottomNavigationBarItem`, `NavigationRailDestination`, or entirely custom gesture detectors that manually evaluate the current `GoRouter` path state. This specific component wrapper concept does not directly translate.

```dart
// Logic paradigm in Flutter
// Active state is checked manually against the router
final String location = GoRouterState.of(context).uri.toString();
final bool isActive = location.startsWith('/target-route');

return Container(
  color: isActive ? Colors.blue : Colors.transparent,
  child: Text("Route Name")
);
```
