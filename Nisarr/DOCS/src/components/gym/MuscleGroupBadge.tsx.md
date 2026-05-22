# src/components/gym/MuscleGroupBadge.tsx

Documentation for `src/components/gym/MuscleGroupBadge.tsx`.

## Overview
A tiny UI utility mapping strongly-typed strings to specific tailwind badge colors depending on the target muscle (`chest` -> rose, `back` -> cyan, `core` -> yellow).

## Dart Implementation

Translate this to a generic function or discrete `StatelessWidget` returning a stylized `Chip` or `Container` checking against a switch/case map of Colors.

```dart
// Flutter implementation skeleton
class MuscleGroupBadge extends StatelessWidget {
  final MuscleGroup muscle;

  Color _getColor() {
    switch (muscle) {
      case MuscleGroup.chest: return Colors.pink;
      case MuscleGroup.back: return Colors.cyan;
      // ...
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getColor();
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        border: Border.all(color: color.withOpacity(0.5)),
        borderRadius: BorderRadius.circular(12)
      ),
      child: Text(muscle.name.toUpperCase())
    );
  }
}
```
