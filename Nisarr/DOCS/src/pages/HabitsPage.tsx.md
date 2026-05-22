# src/pages/HabitsPage.tsx

Documentation for `src/pages/HabitsPage.tsx`.

## Overview
A dynamic daily tracking UI prioritizing visual momentum and psychological rewards.
- **Weekly Heatmap SVG**: Renders an extremely complex custom SVG matrix simulating a calendar heatmap. It draws arcs and paths utilizing mathematical formulas to display percentage completion rings `(circumference - (pct / 100) * circumference)`.
- **Streak Flames**: Assigns varying intensities of visual flame colors depending on `streak_count` to build retention.
- **AI Coaching**: Generates LLM summaries feeding the context of active arrays (`useHabit` metrics) to the `getHabitCoaching` helper function to render personalized behavioral nudges.

## Dart Implementation

This SVG drawing can be replicated directly in Flutter using a custom `CustomPainter`.
```dart
class HeatmapRingPainter extends CustomPainter {
  final double percentage;
  
  HeatmapRingPainter(this.percentage);
  
  @override
  void paint(Canvas canvas, Size size) {
    final activePaint = Paint()
      ..color = Colors.green
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    
    // Draw arc based on percentage
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2, // Start at top
      2 * pi * (percentage / 100),
      false,
      activePaint
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
```
