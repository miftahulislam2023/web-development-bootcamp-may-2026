# src/ai/notes/enhanceNote.ts

Documentation for `src/ai/notes/enhanceNote.ts`.

## Overview
A specialized service file executing standalone prompts focused purely on text-generation and markdown-formatting logic for the Notes feature. It explicitly bounds the LLM to process formatting like `- [ ]` checklists and hierarchical headings. Rather than acting as a routing intent parser, it forwards raw content via REST to `/api/ai/enhance` for creative generation, rewrite, or summarization of a given `NoteContext` block.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'dart:convert';
import 'package:http/http.dart' as http;

class EnhanceNoteService {
  static const endpoint = 'https://backend/api/ai/enhance';

  static Future<String> enhanceWithAI(String prompt, Note noteContext, String token) async {
    final systemPrompt = 'You are an expert note-writing assistant...';
    final messages = [
       {'role': 'system', 'content': systemPrompt},
       {'role': 'user', 'content': 'CURRENT NOTE: ${noteContext.content} \\n REQUEST: $prompt'}
    ];
    
    final res = await http.post(
      Uri.parse(endpoint),
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      body: jsonEncode({'messages': messages})
    );
    
    final data = jsonDecode(res.body);
    return data['content']; // Must parse and format appropriately for MarkdownViewers in Flutter.
  }
}
```
