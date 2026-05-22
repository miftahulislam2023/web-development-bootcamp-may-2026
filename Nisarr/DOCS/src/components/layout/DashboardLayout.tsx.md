# src/components/layout/DashboardLayout.tsx

Documentation for `src/components/layout/DashboardLayout.tsx`.

## Overview
The primary orchestrator for the application's authenticated views. 
- Integrates `Sidebar` (Desktop) and `BottomNav` (Mobile).
- Wraps the `<Outlet />` (current page content) in an `AnimatedPage` and `AnimatePresence` for route transitions.
- Acts as the persistent host for global overlay components: `AIChatInterface` and `GlobalSearch`.

## Dart Implementation

A standard `Scaffold` will serve this role perfectly, utilizing conditional rendering based on screen size (via `MediaQuery` or `LayoutBuilder`).

```dart
// Flutter implementation skeleton
class DashboardLayout extends StatelessWidget {
  final Widget child; // Equivalent to <Outlet />
  
  DashboardLayout({required this.child});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 800;

    return Scaffold(
      body: Row(
        children: [
          if (isDesktop) Sidebar(),
          Expanded(child: child), // The main page content
        ]
      ),
      bottomNavigationBar: isDesktop ? null : BottomNav(),
      floatingActionButton: AIChatTrigger(), // Persistent AI access
    );
  }
}
```
