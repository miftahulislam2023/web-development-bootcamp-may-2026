# src/components/layout/BottomNav.tsx

Documentation for `src/components/layout/BottomNav.tsx`.

## Overview
The mobile-first navigation bar positioned at the bottom of the screen.
- **Dynamic Items**: Pulls `mainNavItems` and `moreNavItems` from `useNavPreferences`.
- **Animations**: Uses `framer-motion` `layoutId` sharing to smoothly animate a pill background indicator seamlessly between selected icons.
- **More Menu**: Toggles an animated overlay showing secondary navigation options (like Theme and Search) that don't fit in the main strip.
- **AI Toggling**: Manages global AI Chat visibility via `useAI()`.

## Dart Implementation

Flutter provides `BottomNavigationBar` natively, but to achieve this specific floating, pill-based design, a customized `Stack` or positioned `Container` utilizing `AnimatedAlign` or `AnimatedPositioned` is ideal.

```dart
// Flutter implementation skeleton
class FloatingBottomNav extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 20,
      left: 16,
      right: 16,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30),
          color: Colors.black87,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            // Custom Icon Buttons with active state logic
          ],
        ),
      ),
    );
  }
}
```
