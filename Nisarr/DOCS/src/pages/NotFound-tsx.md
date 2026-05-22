# NotFound.tsx Analysis

**Path**: `src/pages/NotFound.tsx`

## Overview
`NotFound` is the 404 error page displayed when a user navigates to a non-existent route.

## Detailed Code Analysis

### Logic
- **Logging**: Uses `useEffect` and `useLocation` to log the missing path to the console (`console.error`).
- **Layout**: Centered content (`flex min-h-screen items-center justify-center`).
- **Content**:
    - "404" Heading.
    - "Oops! Page not found" message.
    - Link to return Home (`/`).

### Styles
- Uses `bg-muted` for a subtle background.
- Standard typography classes.
