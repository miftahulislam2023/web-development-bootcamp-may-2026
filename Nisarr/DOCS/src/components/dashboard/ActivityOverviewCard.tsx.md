# src/components/dashboard/ActivityOverviewCard.tsx

Documentation for `src/components/dashboard/ActivityOverviewCard.tsx`.

## Overview
A highly visual summary card showing 4 key top-level metrics (Tasks, Habits, Study, Notes).
- **Responsive Layout**: Uses a `grid` that breaks from 4-columns on desktop to 2-columns on mobile.
- **Micro-interactions**: Evaluates `window.innerWidth` to wrap the content in a collapsible `AnimatePresence` accordion when viewed on mobile.
- **Visuals**: Employs `RadialProgress` SVGs and heavy `linear-gradient` / glassmorphism CSS.

## Dart Implementation

Flutter manages responsive columns using `GridView.count` or simply a `Wrap` widget. The mobile accordion can be natively replicated using `ExpansionPanel` or a custom `AnimatedSize` widget.

```dart
// Flutter implementation skeleton
class ActivityOverviewCard extends StatefulWidget {
  // Props...
  @override
  _ActivityOverviewCardState createState() => _ActivityOverviewCardState();
}

class _ActivityOverviewCardState extends State<ActivityOverviewCard> {
  bool isExpanded = true;

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;

    return Card(
      child: Column(
        children: [
          _buildHeaderRow(isMobile, onToggle: () => setState(() => isExpanded = !isExpanded)),
          AnimatedSize(
            duration: Duration(milliseconds: 300),
            child: (!isMobile || isExpanded) ? _buildGrid(isMobile) : SizedBox.shrink(),
          )
        ]
      )
    );
  }
}
// For the radial progress, packages like `percent_indicator` are ideal.
```
