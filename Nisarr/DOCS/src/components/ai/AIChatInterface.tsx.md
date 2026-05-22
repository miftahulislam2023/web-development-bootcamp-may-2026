# src/components/ai/AIChatInterface.tsx

Documentation for `src/components/ai/AIChatInterface.tsx`.

## Overview
This is a massive, highly-complex centralized AI orchestrator UI element (560+ lines).
- **Omniscient Context Collection**: On each message sent `handleSend`, the component actively pulls data from *every single hook* (`useTasks`, `useFinance`, `useBudget`, `useHabits`, `useStudy`, `useGym`, `useNotes`, `useInventory`), calculates metrics locally (e.g. pending vs completed ratio, total balance, expected durations), and feeds a gigantic serialized template (`contextString`) directly into `processUserMessage`.
- **Immediate Local Execution**: The UI does not just wait for chat responses; it intercepts `AIIntent` objects and executes mutative operations directly onto local stores using standard React logic.
- **Formattable UI**: Implements a highly custom inline markdown parser (`renderFormattedText`) converting output to styled lists, interactive checkboxes, and colored text blobs recursively.
- **Responsive Resizing**: Listens to visual viewport boundaries to accurately render floating toolbars avoiding software keyboard clipping on iOS/Android.

## Dart Implementation

Because this logic tightly bundles UI state and data manipulation, migrating this requires separating concerns first. In Flutter, the context gathering logic should live inside a dedicated `AIService` controller (using Riverpod or Provider), leaving the Widget tree to just handle UI layout and soft-keyboard (`WidgetsBindingObserver`) awareness.

```dart
// Flutter implementation skeleton
// WARNING: Logic should be deeply abstracted via Controllers.
class AIChatInterface extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Rely on Provider to handle all omniscient data collection. 
    final isChatOpen = ref.watch(aiChatStateProvider);
    
    if (!isChatOpen) return SizedBox.shrink();

    return Positioned(
      bottom: MediaQuery.of(context).viewInsets.bottom, // Avoid Keyboard
      child: ClipRRect(
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        child: Container(
           // Render messages and TextField
        )
      )
    );
  }
}
```
