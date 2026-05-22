# src/pages/NotesPage.tsx

Documentation for `src/pages/NotesPage.tsx`.

## Overview
A complex Markdown-based note-taking interface supporting rich text formatting, interactive checklists, inline images, and AI enhancements.
- **Hybrid Editor**: Uses a transparent overlay (`<textarea>` + `div` overlay) to render live markdown previews inline as the user types, parsing bold, italics, code blocks, lists, and headings seamlessly without needing a separate "preview" pane.
- **Interactive Checklists**: Parses `- [ ]` markdown syntax into interactive circular checkboxes directly within the note editor, allowing state toggling inline.
- **AI Enhancement Toolbar**: Includes an AI prompt box that utilizes `enhanceNoteWithAI` to rewrite, summarize, or structure the note text.
- **File Drops**: Handles `onDrop` events to automatically capture images, upload them via `uploadImage`, and append `![Alt](url)` markdown into the cursor state.

## Dart Implementation

Building a seamless WYSIWYG/Markdown hybrid editor in Flutter is challenging but achievable via `TextField` with a custom `TextSpan` builder or packages like `flutter_markdown`.
```dart
// Flutter implementation skeleton
import 'package:flutter/material.dart';

class NotesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Knowledge Base')),
      body: Row(
        children: [
          _buildSidebarList(), // For larger screens
          Expanded(child: _buildRichMarkdownEditor())
        ]
      )
    );
  }
}
```
