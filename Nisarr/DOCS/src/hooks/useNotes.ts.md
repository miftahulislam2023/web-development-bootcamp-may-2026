# src/hooks/useNotes.ts

Documentation for `src/hooks/useNotes.ts`.

## Overview
A hook that wraps `/data/notes` and manages specific `Note` features.
Extensive mapping logic mapping semantic string tags (`"coral"`, `"storm"`) back to generic UI elements via the global dictionary `NOTE_COLORS`.
Performs local numbering sequentially assigning a static `serial_number` based on mathematically evaluating existing array lengths (`Math.max(...serial)`). Manages soft deletes (`archiveNote`, `trashNote`) versus hard deletes (`deleteNote`).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
class Note {
  // Enum mappings in Dart
  NoteColor color;
  bool isPinned;
  bool isArchived;
}

class NotesRepository extends ChangeNotifier {
  List<Note> notes = [];

  // Equivalent color map static enum logic
  static Map<String, Color> noteColorMap = {
     'storm': Colors.blue.shade100,
     'coral': Colors.red.shade100,
  };

  Future<void> togglePin(Note note) async {
     // db.update('notes', {'is_pinned': note.isPinned ? 0 : 1});
     await loadNotes();
  }

  Future<void> addNote(Note note) async {
     // calculate sequential max ID safely
     final maxSerial = notes.isEmpty ? 0 : notes.map((n) => n.serialNumber).reduce((a, b) => a > b ? a : b);
     note.serialNumber = maxSerial + 1;
     // db.insert
  }
}
```
