# src/components/gym/WorkoutPlanner.tsx

Documentation for `src/components/gym/WorkoutPlanner.tsx`.

## Overview
A complex architectural CRUD interface for managing workout protocols (Plans) and their specific loadouts (Exercises).
- **Plan Management**: Create/Edit/Delete full routines (e.g. "Heavy Push Day", Split: Push, Day: Monday).
- **Exercise Management**: Allows injecting new exercises into specific plans. Includes an intelligent search-as-you-type autofill checking against a `PRESET_EXERCISES` constant array.
- **UI UX**: Heavy use of `Dialog` modals to capture nested forms without navigating away from the page. High-end CSS styling (glassmorphism cards, gradients matching split types).

## Dart Implementation

Maps entirely to standard Flutter CRUD lists. The autofill text input resolves to Flutter's native `Autocomplete` or `TypeAheadFormField` from the `flutter_typeahead` package.

```dart
// Flutter AutoComplete skeleton
Autocomplete<String>(
  optionsBuilder: (TextEditingValue textEditingValue) {
    if (textEditingValue.text == '') {
      return const Iterable<String>.empty();
    }
    return PRESET_EXERCISES.where((String option) {
      return option.toLowerCase().contains(textEditingValue.text.toLowerCase());
    });
  },
  onSelected: (String selection) {
    print('You just selected $selection');
  },
)
```
