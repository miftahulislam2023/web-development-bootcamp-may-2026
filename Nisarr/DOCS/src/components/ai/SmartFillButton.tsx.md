# src/components/ai/SmartFillButton.tsx

Documentation for `src/components/ai/SmartFillButton.tsx`.

## Overview
A highly reusable, generic React component allowing Natural Language processing for strict `<form>` schemas.
- Takes unstructured text input recursively via a `<Dialog>` text area.
- Offloads to `smartFillForm<T>(input, schemaDescription)`, waiting for the AI to return a strongly-typed JSON structure.
- Passes the populated data upward via `onFill(data)`, allowing the parent form context to instantly populate `<Input />` fields without further boilerplate.

## Dart Implementation

This pattern works beautifully in Flutter by wrapping standard forms in a `Row` containing a magic action icon parsing generic Map types.

```dart
// Flutter implementation skeleton
class SmartFillDialog<T> extends StatelessWidget {
  final Function(T result) onFill;
  final String schema;

  SmartFillDialog({required this.onFill, required this.schema});

  Future<void> _processText(String text) async {
    final Map<String, dynamic> result = await AIService.smartFill(text, schema);
    // Cast and return
    onFill(result as T);
  }
// ...
```
