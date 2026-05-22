# src/components/tasks/DateStrip.tsx

Documentation for `src/components/tasks/DateStrip.tsx`.

## Overview
A highly complex horizontal scrolling date selector (`-7` to `+14` days).
- **Auto-Scrolling**: Triggers a manual DOM `scrollTo` whenever `selectedDate` changes to keep the active date centered in the viewport.
- **Custom Circular UI**: Bypasses standard progress bars by rendering custom raw `<svg>` circles. Applies complex logic mapping `strokeDashoffset` to the day's total task completion percentage. Uses conditional linear gradients (`taskGradientFull`, `taskGradientHalf`, `taskGradientLow`) depending on the percentage outcome.
- **Micro-animations**: Staggers entrance using Framer Motion and springs down a `Check` mark when the day is 100% complete.

## Dart Implementation

Flutter excels at horizontal date strips via `ListView.builder` configured with `scrollDirection: Axis.horizontal` and a `ScrollController`. The circular SVG progress maps directly to `CustomPaint` utilizing `drawArc`.

```dart
// Flutter implementation skeleton
class DateStrip extends StatefulWidget {
  // ...
  @override
  _DateStripState createState() => _DateStripState();
}

class _DateStripState extends State<DateStrip> {
  final ScrollController _controller = ScrollController();

  void _scrollToCenter(int index) {
     _controller.animateTo(
       (index * 72.0) - (MediaQuery.of(context).size.width / 2) + 36.0,
       duration: Duration(milliseconds: 300),
       curve: Curves.easeInOut
     );
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      child: ListView.builder(
        controller: _controller,
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index) {
           return _buildCircularDateNode(index); // CustomPaint for the SVG ring
        }
      )
    );
  }
}
```
