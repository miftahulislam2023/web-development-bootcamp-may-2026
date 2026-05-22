# src/components/gym/BodyMetricsTracker.tsx

Documentation for `src/components/gym/BodyMetricsTracker.tsx`.

## Overview
A dedicated form and historical list view for logging physical body metrics (Weight and Body Fat %).
- Accepts input via standard Shadcn inputs.
- Validates the form, pushes to the `useGym().addMetric` method, and fires a `sonner` success toast.
- Maps `gym.metrics` below the input to allow historical viewing and single-item deletion via the Trash icon.

## Dart Implementation

Maps easily to a `Form` combined with a `ListView.builder` history strip. 

```dart
// Flutter implementation skeleton
class BodyMetricsTracker extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildInputCard(), // Contains TextFields, Button, and validation logic
        SizedBox(height: 24),
        Text("History"),
        _buildHistoryList() // Maps gym metrics, returning ListTiles with delete callbacks
      ]
    );
  }
}
```
