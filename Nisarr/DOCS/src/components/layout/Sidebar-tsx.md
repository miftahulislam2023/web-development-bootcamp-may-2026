# Sidebar.tsx Analysis

**Path**: `src/components/layout/Sidebar.tsx`

## Overview
`Sidebar` is the desktop navigation drawer. It includes the app logo, main navigation links, and utility buttons (Theme toggle, Settings).

## Detailed Code Analysis

### Imports
- `lucide-react`: Extensive icon imports.
- `framer-motion`: `motion` for hover/active effects.
- `useTheme`: Custom hook for dark/light mode toggle.

### Data
- `navItems`: Expanded list compared to mobile (Dashboard, Tasks, Finance, Notes, Inventory, Study, Habits).

### Component: `Sidebar`
- **Layout**:
    - `hidden md:flex`: Visible only on desktop.
    - `fixed left-0 top-0`: Stays in place while scrolling.
    - `glass-card`: Glassmorphism styling.
- **Logo Section**:
    - Includes `Sparkles` icon with a gradient background (`bg-gradient-primary`).
    - App title "LifeOS" with `text-gradient`.
- **Navigation**:
    - Iterates `navItems`.
    - **Hover Effect**: `whileHover={{ x: 4 }}` shifts item slightly right.
    - **Active State**:
        - Adds `active` class.
        - `layoutId="activeIndicator"` animates the vertical bar on the left of the active item.
- **Bottom Section**:
    - Border separated.
    - **Theme Toggle**:
        - Switches between `Sun` and `Moon` icons based on `theme`.
        - Calls `toggleTheme`.
    - **Settings Link**: Standard navigation link.
