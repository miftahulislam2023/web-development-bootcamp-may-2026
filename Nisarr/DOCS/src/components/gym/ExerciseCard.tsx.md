# src/components/gym/ExerciseCard.tsx

Documentation for `src/components/gym/ExerciseCard.tsx`.

## Overview
A complex interactive row container housing the `SetRow` array for a single given exercise during a workout tracker session.
- Computes how many rows to render (`Math.max(exercise.defaultSets, loggedSets.length + 1)`) and allows users to push more generic rows via "Add Additional Set".
- Tracks the previous session's weight to populate placeholder/history metadata inside the child `SetRow` components.

## Dart Implementation

This translates to an expanding `Card` widget containing a dynamic `Column` of Set widgets. The addition of new sets modifies a local `setState` list length or relies on the parent's `List<SetLog>`.

```dart
// Flutter implementation skeleton
class ExerciseCard extends StatefulWidget {
  final Exercise exercise;
  
  @override
  _ExerciseCardState createState() => _ExerciseCardState();
}

class _ExerciseCardState extends State<ExerciseCard> {
  int extraRows = 0;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        children: [
           _buildHeaderRow(), // Includes Dumbbell icon, title, and MuscleGroup badge
           _buildGridHeader(), // "Set | History | Load | Reps | RPE" labels
           ...List.generate(totalRows, (index) => SetRowWidget(index)),
           TextButton(
             onPressed: () => setState(() => extraRows++),
             child: Text("ADD ADDITIONAL SET")
           )
        ]
      )
    );
  }
}
```
