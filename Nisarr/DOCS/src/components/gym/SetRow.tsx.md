# src/components/gym/SetRow.tsx

Documentation for `src/components/gym/SetRow.tsx`.

## Overview
Highly specific atomic input row representing a single repetition Set.
- Takes unstructured generic `<Input />` for Weight, Reps, and logical RPE (Rate of Perceived Exertion).
- Pushes validation via `handleLog` -> fires specific set data upward.
- If the `existingSet` prop is passed, the exact input row transforms styles (green checkmarks, locking inputs to read-only, conditionally drawing `isPR` yellow gradients).

## Dart Implementation

Translates to a `Row` encompassing expanded `TextField` elements. The inputs must observe `TextEditingController` state and toggle `readOnly: true` if `isCompleted` is passed into the constructor.

```dart
// Flutter implementation skeleton
class SetRow extends StatefulWidget {
  // ...
  @override
  _SetRowState createState() => _SetRowState();
}

class _SetRowState extends State<SetRow> {
  final TextEditingController _weight = TextEditingController();
  final TextEditingController _reps = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: widget.isCompleted ? Colors.green.withOpacity(0.1) : Colors.transparent,
      child: Row(
        children: [
          Text('${widget.setNumber}'),
          Expanded(child: TextField(controller: _weight, readOnly: widget.isCompleted)),
          Expanded(child: TextField(controller: _reps, readOnly: widget.isCompleted)),
          IconButton(icon: Icon(Icons.check), onPressed: () => widget.onLogSet(_weight.text, _reps.text))
        ]
      )
    );
  } 
}
```
