# src/ai/features/smart-fill.ts

Documentation for `src/ai/features/smart-fill.ts`.

## Overview
A generic utility function `smartFillForm` enabling zero-shot UI form completion via NLP strings. It takes an arbitrary unstructured string (e.g., "I bought a cool gaming chair") alongside a declarative string schema representation, and commands the LLM to extract cleanly mapped JSON parameters. It includes regex stripping (`/\{[\s\S]*\}/`) to defensively extract JSON blocks from noisy LLM outputs perfectly.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
import 'dart:convert';

class SmartFill {
  static Future<Map<String, dynamic>> fillForm(String text, String schema) async {
     final systemPrompt = '''
        Extract relevant info and map to this schema:
        $schema
        Return ONLY valid JSON.
     ''';
     
     // Make backend call via Groq/AI proxy using `sendPrompt()` mechanism
     final rawResult = await AiClient.generate(systemPrompt, text);
     
     // Defensive regex extract mimicking the JS implementation:
     final regex = RegExp(r'\{[\s\S]*\}');
     final match = regex.firstMatch(rawResult);
     
     if (match != null) {
       return jsonDecode(match.group(0)!);
     }
     return jsonDecode(rawResult);
  }
}
```
