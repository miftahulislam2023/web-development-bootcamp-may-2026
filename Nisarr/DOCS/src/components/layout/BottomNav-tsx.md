# BottomNav.tsx Analysis

**Path**: `src/components/layout/BottomNav.tsx`

## Overview
`BottomNav` provides mobile navigation fixed at the bottom of the screen. It highlights the active route and uses animations for interaction.

## Detailed Code Analysis

### Imports
- `react-router-dom`: `Link`, `useLocation` for navigation.
- `lucide-react`: Icons (`LayoutDashboard`, `ListTodo`, etc.).
- `framer-motion`: Animations.

### Data
- `navItems`: Array defining the menu items (Home, Tasks, Finance, Notes, Habits).

### Component: `BottomNav`
- **Container**: `nav.bottom-nav`. (Likely styled in CSS/Tailwind config to be fixed bottom, full width).
- **Flex Container**: `justify-around` to space items evenly.
- **Items**:
    - Iterates `navItems`.
    - Determines `isActive` by comparing `location.pathname`.
    - **Interaction**: `whileTap={{ scale: 0.9 }}` for tactile feedback.
    - **Styling**: `text-primary` if active, `text-muted-foreground` otherwise.
    - **Active Indicator**:
        - Conditionally rendered `motion.div`.
        - `layoutId="bottomNavIndicator"` allows Framer Motion to animate the indicator sliding between items.
