# src/components/layout/Sidebar.tsx

Documentation for `src/components/layout/Sidebar.tsx`.

## Overview
A complex desktop-focused navigation pane that supports full expansion and collapsed views.
- **Dynamic Badging**: Specifically evaluates `tasks` from `useTasks` to inject red numerical badges indicating pending tasks onto the navigation items.
- **User Globals**: Houses the quick access toggle for the light/dark `useTheme` and exposes the `useAuth` user profile and logout controls inline at the bottom of the sidebar.
- **Responsive Animations**: Adjusts its CSS widths and visibility depending on the state of `isCollapsed` managed by `DashboardLayout`.

## Dart Implementation

Flutter's `NavigationRail` combined with expanding `AnimatedContainer` handles collapsible sidebars very cleanly.

```dart
// Flutter implementation skeleton
class ResponsiveSidebar extends StatefulWidget {
  @override
  _ResponsiveSidebarState createState() => _ResponsiveSidebarState();
}

class _ResponsiveSidebarState extends State<ResponsiveSidebar> {
  bool isCollapsed = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 300),
      width: isCollapsed ? 80 : 250,
      child: Column(
        children: [
          _buildHeaderToggle(),
          _buildNavItems(), // Render dynamic badges here via Provider/Riverpod
          _buildFooterProfile()
        ]
      )
    );
  }
}
```
