# src/pages/Gym.tsx

Documentation for `src/pages/Gym.tsx`.

## Overview
A parent routing-tab component for the Gym feature. It acts as an orchestrator for smaller modular components (`GymDashboard`, `WorkoutPlanner`, `WorkoutLogger`, `ProgressCharts`, `BodyMetricsTracker`, `PersonalRecords`).
- Dynamically registers the UI to the AI context `aiContext.setGymHooks` on mount so global voice commands can trigger workouts.
- Utilizes `framer-motion` `AnimatePresence` to render slick cross-fades when toggling the `<Tabs>`.

## Dart Implementation

In Flutter, replace the `Tabs` and `AnimatePresence` with a `TabBarView` or a `PageView` bundled closely with `AnimatedSwitcher`.

```dart
// Flutter implementation skeleton
import 'package:flutter/material.dart';

class GymPage extends StatefulWidget {
  @override
  _GymPageState createState() => _GymPageState();
}

class _GymPageState extends State<GymPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Gym Orbit'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(icon: Icon(Icons.dashboard), text: 'Overview'),
            // ...
          ]
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          GymDashboard(),
          WorkoutPlanner(),
          WorkoutLogger(),
          ProgressCharts(),
          PersonalRecords(),
        ]
      )
    );
  }
}
```
