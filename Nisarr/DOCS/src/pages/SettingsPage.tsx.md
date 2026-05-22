# src/pages/SettingsPage.tsx

Documentation for `src/pages/SettingsPage.tsx`.

## Overview
A centralized configuration interface managing the user's local instance properties.
- **Theme Manipulation**: Bridges raw vanilla DOM modifications (`document.documentElement.classList`) combined with standard state updates.
- **Nav Preferencer**: Allows updating maximum pinned shortcuts via `useNavPreferences` (updating which bottom-bar icons are displayed in mobile views).
- **Globals**: Manages regional states (`Currency`), notification permissions, and logout actions bounding to `localStorage` evictions.

## Dart Implementation

Use `SharedPreferences` in Flutter to persist these identical options globally and notify listeners of Theme Mode changes.

```dart
// Flutter implementation skeleton
class SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Settings')),
      body: ListView(
        children: [
          SwitchListTile(
            title: Text('Dark Mode'),
            value: isDark,
            onChanged: (val) => toggleTheme(val)
          ),
          ListTile(
            title: Text('Currency'),
            trailing: DropdownButton(...)
          )
        ]
      )
    );
  }
}
```
