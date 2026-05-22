# src/lib/groq.ts

Documentation for `src/lib/groq.ts`.

## Overview
The "Brain" script connecting the React frontend directly to the Groq API (`llama-3.1-8b-instant`). 
- Defines a massive, rigidly structured `INTENT_PARSER_SYSTEM_PROMPT` giving the AI agent strict schema definitions to return JSON containing an `action` and `data` object for explicit DB executions.
- Includes specific helper methods (`analyzeBudget`, `getDailyBriefing`, `getStudyTips`, `getHabitCoaching`) which utilize customized zero-shot prompts to immediately analyze variables provided by app state.

## Dart Implementation

This is pure business logic mapping 1:1 to Dart utilizing the `http` package to hit `https://api.groq.com/openai/v1/chat/completions`. Using Dart allows the creation of strict underlying JSON Serialization models via `json_serializable` for type-safe parsing.

```dart
// Flutter implementation skeleton
Future<AIIntent> processUserMessage(String userMessage, List<ChatMessage> history) async {
  final response = await http.post(
    Uri.parse("https://api.groq.com/openai/v1/chat/completions"),
    headers: {
      "Authorization": "Bearer $groqApiKey",
      "Content-Type": "application/json"
    },
    body: jsonEncode({
      "model": "llama-3.1-8b-instant",
      "messages": [ ... ],
      "response_format": {"type": "json_object"}
    })
  );
  
  return AIIntent.fromJson(jsonDecode(response.body));
}
```
