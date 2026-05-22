# src/components/dashboard/MonthlySpendingCard.tsx

Documentation for `src/components/dashboard/MonthlySpendingCard.tsx`.

## Overview
A highly stylized hybrid widget combining text metrics, an embedded `recharts` Pie chart, and a vertical list of custom animated horizontal progress bars representing category spend breakdown.
- Uses `AnimatePresence` and `isMobile` logic to fold on smaller screens.
- Utilizes `<motion.div>` inline width animation (`animate={{ width: pct}}`) to draw the category bars horizontally upon component mount.

## Dart Implementation

The horizontal progress bars can be simulated beautifully utilizing `FractionallySizedBox` inside an `AnimatedContainer`. The chart will again require `fl_chart`.

```dart
// Flutter implementation skeleton for the animated bars
class AnimatedCategoryBar extends StatelessWidget {
  final double percentage; // 0.0 to 1.0
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 6,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Theme.of(context).dividerColor,
        borderRadius: BorderRadius.circular(10)
      ),
      alignment: Alignment.centerLeft,
      child: FractionallySizedBox(
        widthFactor: percentage,
        child: AnimatedContainer(
          duration: Duration(milliseconds: 800),
          curve: Curves.easeOutCubic,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(10)
          )
        ),
      )
    );
  }
}
```
