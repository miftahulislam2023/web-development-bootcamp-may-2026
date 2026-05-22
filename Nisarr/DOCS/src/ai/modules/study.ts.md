# src/ai/modules/study.ts

Documentation for `src/ai/modules/study.ts`.

## Overview
A complex NLP module mapping to the multi-level relational study hierarchy. It instructs the LLM on managing 3 tiers of nesting (`Subject -> Chapter -> Part`). Commands like "add part interference to waves chapter, 45 minutes" resolve by sequentially searching internal hooks to match the "Waves" chapter ID before firing the mutation for the "Interference" part. It natively supports creating nested parts recursively (`ADD_STUDY_SUBCHAPTER`).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here

class StudyAiExecutor {
  final StudyService studyService;

  StudyAiExecutor(this.studyService);

  Future<void> execute(String action, Map<String, dynamic> data, StudyContext ctx) async {
    switch (action) {
      case "ADD_STUDY_PART":
        final cName = (data['chapter_name'] ?? '').toString().toLowerCase();
        try {
           final targetChapter = ctx.chapters.firstWhere((c) => c.name.toLowerCase().contains(cName));
           await studyService.addPart(
               chapterId: targetChapter.id,
               name: data['part_name'],
               estimatedMinutes: data['estimated_minutes'] ?? 30,
           );
        } catch(e) {}
        break;
    }
  }
}
```
