# sidebar.tsx Analysis

**Path**: `src/components/ui/sidebar.tsx`

## Overview
`Sidebar` is a complex, composable sidebar component system. It handles collapsing, mobile states, and layout.

## Detailed Code Analysis

### Context (`SidebarContext`)
- Manages `state` (`expanded`/`collapsed`), `open`, `openMobile`, `isMobile`.
- `SidebarProvider`: Wraps the app/layout.
    - Handles `defaultOpen` and cookie persistence (`sidebar:state`).
    - Listens for keyboard shortcut (`Cmd+B` / `Ctrl+B`) to toggle.

### Components
- **`Sidebar`**: The main container.
    - **Desktop**: Renders a collapsible sidebar.
    - **Mobile**: Renders a `Sheet`.
    - Handles `collapsible` modes (`offcanvas`, `icon`, `none`).
- **`SidebarTrigger`**: Button to toggle sidebar.
- **`SidebarRail`**: A thin clickable rail on the edge to allow resizing/toggling.
- **`SidebarInset`**: The main content area next to the sidebar.
- **`SidebarMenu`**: List of items.
- **`SidebarMenuItem`**: Individual item wrapper.
- **`SidebarMenuButton`**: Interactive button for an item. supports tooltip when collapsed.
- **`SidebarGroup`**: Grouping section.

### Key Logic
- **Cookies**: Persists open/closed state across reloads.
- **CSS Variables**: Uses `--sidebar-width` etc. to manage layout dynamically.
- **Responsiveness**: Automatically switches to a Sheet (drawer) on mobile using `useIsMobile`.
