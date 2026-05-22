# src/pages/StudyPage.tsx

Documentation for `src/pages/StudyPage.tsx`.

## Overview
A deeply nested, hierarchical study orchestrator. Follows a `Subject -> Chapter -> Part` data tree.
- **State Aggregation**: Maps arrays across three abstraction levels utilizing `useStudy` contexts. 
- **Duration Logic**: Calculates Remaining/Completed Minutes asynchronously by parsing nested `Part` arrays, mapping UI progress bars globally per Subject.
- **UI Structure**: Heavy utilization of `framer-motion` `AnimatePresence` to render expandable/collapsible tree-nodes mimicking accordion components.

## Dart Implementation

In Flutter, this hierarchical nested list translates perfectly to `ExpansionPanelList` or `ListView.builder` combined with `ExpansionTile` widgets.

```dart
// Flutter implementation skeleton
class StudyPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView.builder(
        itemCount: subjects.length,
        itemBuilder: (context, index) {
           return ExpansionTile(
             title: Text(subjects[index].name),
             subtitle: ProgressBar(value: progress),
             children: [
               // Nested ExpansionTiles for Chapters -> Parts
               _buildChaptersList(subjects[index].id)
             ]
           );
        }
      )
    );
  }
}
```
