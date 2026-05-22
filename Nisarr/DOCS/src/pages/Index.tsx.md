# src/pages/Index.tsx

Documentation for `src/pages/Index.tsx`.

## Overview
The main dashboard acting as the command center for the entire monolithic application. Displays "Bento-style" summarized grid layouts extracting telemetry from all sub-modules.
- Maps `tasks`, `finance`, `habits`, `study`, `notes` logic arrays directly without deeply executing their mutations.
- Prioritizes an AI-driven `AiSummaryCard` rendering the daily summary by digesting global analytics.
- **Responsive Layout**: Heavy usage of CSS grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` and `col-span-x`).
- Includes a sophisticated `RadialProgress` generic SVG component for rendering clean progress rings globally.

## Dart Implementation

In Flutter, leverage `SliverGrid` extensively to replicate the responsive "Bento box" layout.

```dart
class DashboardIndex extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            flexibleSpace: AIHeaderSummaryCard(),
          ),
          SliverPadding(
            padding: EdgeInsets.all(16),
            sliver: SliverGrid.count(
              crossAxisCount: MediaQuery.of(context).size.width > 800 ? 4 : 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                BudgetStatCard(),
                SavingsStatCard(),
                TasksPendingCard(),
              ]
            )
          )
        ]
      )
    );
  }
}
```
