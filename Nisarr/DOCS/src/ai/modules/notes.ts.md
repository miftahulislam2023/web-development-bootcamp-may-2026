# src/ai/modules/notes.ts

Documentation for `src/ai/modules/notes.ts`.

## Overview
Connects NLP user input to the application's Notes architecture. It enables creating, updating, pinning, archiving, trashing, and color-coding notes entirely via voice or text. The parsing logic executes fuzzy string matching across `hooks.notes` (`n.title.toLowerCase().includes(...)`) to apply metadata changes gracefully (e.g., dynamically resolving "make the meeting note coral" to the correct DB entity).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here

class NotesAiExecutor {
  final NotesService notesService;

  NotesAiExecutor(this.notesService);

  Future<void> execute(String action, Map<String, dynamic> data, List<Note> activeNotes) async {
    final searchTerm = (data['title'] ?? data['id'] ?? '').toString().toLowerCase();
    Note? targetNote;
    try {
        targetNote = activeNotes.firstWhere((n) => n.title.toLowerCase().contains(searchTerm) || n.id == searchTerm);
    } catch(e) {}

    switch (action) {
      case "ADD_NOTE":
        await notesService.addNote({
            'title': data['title'] ?? 'Quick Note',
            'content': data['content'] ?? data['title'] ?? '',
            'color': data['color'] ?? 'default'
        });
        break;
      case "CHANGE_NOTE_COLOR":
        if (targetNote != null) {
            await notesService.updateColor(targetNote.id, data['color']);
        }
        break;
    }
  }
}
```
