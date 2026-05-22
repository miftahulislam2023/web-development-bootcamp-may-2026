# src/pages/WelcomePage.tsx

Documentation for `src/pages/WelcomePage.tsx`.

## Overview
The unauthenticated public Landing Page emphasizing visual immersion and rich micro-animations.
- **Particles**: Generates floating Snowflakes (in Dark Mode) via complex `framer-motion` positional loops running infinitely on `x` and `y` axes.
- **3D Tilt Dashboard**: Emulates a 3D parallax effect tying the mouse XY coordinate plane to `useMotionValue` rotation degrees, making the "mock dashboard card" tilt smoothly towards the cursor.
- **Localization**: Uses `useLanguage` to dynamically shift translations (`bn` vs `en`) across massive string dictionaries.

## Dart Implementation

To recreate the floating snow properties, you would write a robust `AnimationController` and a custom Particle system or utilize a package like `flutter_spinkit` or `simple_animations`. The 3D Parallax effect can be achieved using the `Transform` widget feeding off native `GestureDetector` `onPanUpdate` tracking.

```dart
// Flutter implementation skeleton
class WelcomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(child: SnowParticleSystem()), // Custom loop
          Center(
             child: MouseRegion( // Parallax tilt based on cursor
                onHover: (event) => _tiltCard(event),
                child: Transform(
                  transform: Matrix4.identity()..setEntry(3, 2, 0.001)..rotateX(tiltX)..rotateY(tiltY),
                  child: MockDashboardHero()
                )
             )
          )
        ]
      )
    );
  }
}
```
