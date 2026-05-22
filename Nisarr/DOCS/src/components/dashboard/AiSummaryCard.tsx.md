# src/components/dashboard/AiSummaryCard.tsx

Documentation for `src/components/dashboard/AiSummaryCard.tsx`.

## Overview
A standalone, stateful AI widget embedded directly in the dashboard.
- **Data Harvesting & Prompting**: Accepts a massive payload of props representing the user's current day (finances, tasks, habits, study list) and constructs a rigid JSON-schema prompt.
- **API Call**: Invokes `callGroqAPI` directly onClick to generate the day's briefing.
- **Caching**: Stores the resulting JSON string into `localStorage` keyed by `todayStr` to avoid redundant API hits perfectly.
- **Collapsible**: Uses the same `isMobile` / `AnimatePresence` collapsing pattern found in other dashboard cards.

## Dart Implementation

The UI part maps similarly to `ActivityOverviewCard` via `AnimatedSize`. However, the heavy data orchestration and caching *should be removed from the widget tree* and relocated to a dedicated Dart Service using `SharedPreferences` and Provider/Riverpod.

```dart
// Flutter implementation skeleton
class AiSummaryCard extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Access the state layer holding the cached parsed JSON
    final aiState = ref.watch(aiSummaryProvider);
    
    return Card(
      child: Column(
        children: [
           // Header
           ElevatedButton(
             onPressed: () => ref.read(aiSummaryProvider.notifier).generate(),
             child: Text(aiState.isLoading ? 'Analyzing' : 'Generate')
           ),
           
           if (aiState.data != null) _buildSummaryView(aiState.data!),
        ]
      )
    );
  }
}
```
