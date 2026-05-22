# src/contexts/AIContext.tsx

Documentation for `src/contexts/AIContext.tsx`.

## Overview
A React context provider managing the global state for the AI Assistant ('Orbit').
- **Global Visibility**: Controls whether the floating `isChatOpen` UI is currently active.
- **Bubble Messages**: Exposes a `showBubble` singleton to allow any part of the app to spawn a small floating AI commentary bubble (with an optional callback action) that auto-hides after `duration`.
- **Page Context Engine**: Exposes `pageContext` and `setPageContext`. The app updates this whenever the user navigates, giving the Groq AI agent silent system-prompt understanding of exactly what window the user is currently looking at.

## Dart Implementation

In Flutter, managing global singleton states like floating UI overlays or chat systems is typically handled with `Riverpod` or `Provider`.
- Global chat overlay can be implemented using `OverlayEntry` to float above the `MaterialApp` navigator.

```dart
// Flutter state management equivalent (Riverpod)
final aiChatOpenProvider = StateProvider<bool>((ref) => false);
final aiBubbleMessageProvider = StateProvider<String?>((ref) => null);
final aiPageContextProvider = StateProvider<String>((ref) => "User is starting the app");
```
