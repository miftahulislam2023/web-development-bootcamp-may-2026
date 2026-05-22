# mcp-server/src/index.ts

Documentation for `mcp-server\src\index.ts`.

## Overview
This file serves as a Model Context Protocol (MCP) compatible server specifically tuned for LifeSolver integration with modern conversational AI interfaces. Using the official `@modelcontextprotocol/sdk`, it exposes the user's Turso database structure via standard Stdio communication protocols. It equips AI models interacting with the MCP server with three primary tools:
- `list_notes`: Returns the latest 10 notes.
- `search_notes`: Queries the notes database to return context matching specific topics.
- `list_tasks`: Outputs active (non-deleted) task lists to feed the context window of AI models seamlessly.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// Node.js MCP context is heavily localized to desktop AI interactions (like Cursor or Claude desktop instances).
// Implementing this logic as a Dart service would only apply if building a Dart-based backend/TCP socket listener.

/* 
N/A for generic frontend Dart implementations. 
If interacting with the LifeHub backend via a Flutter app to fetch notes similarly, standard HTTP calls apply:
*/

import 'package:http/http.dart' as http;

Future<void> fetchContext() async {
  // Mobile app fetching notes or tasks locally/remotely instead of MCP server
}
```
