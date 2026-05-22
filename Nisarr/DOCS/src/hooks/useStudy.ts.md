# src/hooks/useStudy.ts

Documentation for `src/hooks/useStudy.ts`.

## Overview
A highly complex hook orchestrating a three-tier hierarchical study tracker:
`Subjects` -> `Chapters` -> `Parts`.
It manages progress calculations mathematically using `useMemo` blocks measuring `completed` status against total arrays to yield progress percentages. It notably handles `Common Presets` which allows users to mass-apply templated structures (e.g., "Lecture", "Quiz") globally across chapters using `applyPresetsToAllChapters` which executes extensive recursive loops to hydrate the Data structures.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
class StudyRepository extends ChangeNotifier {
  List<StudySubject> subjects = [];
  List<StudyChapter> chapters = [];
  List<StudyPart> parts = [];

  // Expose getters for mapped structures
  Map<String, List<StudyChapter>> get chaptersBySubject {
     // Grouping logic here mapping `chapters.where((c) => c.subjectId == id)`
     return {};
  }

  Map<String, double> get subjectProgress {
      // Dart equivalent of `useMemo` progress calculation
      return {};
  }
  
  // Implementation of deep recursive preset injection logic native to Dart maps and SQLite batches
}
```
