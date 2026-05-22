# src/components/ui/ Directory Overview

Documentation for the `src/components/ui/` directory.

## Overview
This directory contains mostly **shadcn/ui** generated components used throughout the LifeSolver application. These components are predominantly unedited open-source Radix UI wrappers configured with Tailwind CSS classes to establish generic design primitives (buttons, inputs, cards, dialogs, etc.).

Notable exceptions documented separately:
- `GlobalSearch.tsx` (Custom Ctrl+K fuzzy search interceptor).

## Dart Implementation Guidelines

The entirety of `shadcn/ui` concepts maps directly to **Flutter Material 3 Core Widgets** or **Cupertino Widgets**. Since Flutter is widget-driven, you do not need to port these individual `.tsx` files directly.

Instead, map the concepts to standard Flutter widgets during development:
- `Button` -> `ElevatedButton`, `TextButton`, `OutlinedButton`
- `Input` -> `TextField`, `TextFormField`
- `Card` -> `Card`, `Container` (with `BoxDecoration`)
- `Dialog` -> `AlertDialog`, `showDialog()`
- `DropdownMenu` -> `PopupMenuButton`, `showMenu()`
- `ScrollArea` -> `SingleChildScrollView`, `ListView`
- `Toggle` -> `Switch`

When migrating to Flutter, simply rely on the native widgets provided by the SDK instead of recreating atomic primitives.
