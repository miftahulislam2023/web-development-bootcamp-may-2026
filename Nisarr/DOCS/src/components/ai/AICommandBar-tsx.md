# AICommandBar.tsx Analysis

**Path**: `src/components/ai/AICommandBar.tsx`

## Overview
The `AICommandBar` component is a floating, interactive command interface that allows users to interact with an AI backend. It supports both mobile and desktop views, offering a "Command Palette" style experience (triggered by `Cmd+K` or a button). It handles user input, sends requests to an edge function (`ai-command`), and displays the AI's response.

## Detailed Code Analysis

### Imports
- `react`: Imports `useState`, `useRef`, `useEffect` for state management and DOM references.
- `lucide-react`: Imports icons (`Send`, `Sparkles`, `Loader2`, `Mic`, `X`) for UI elements.
- `framer-motion`: Imports `motion` and `AnimatePresence` for animations (modals, expanding effects).
- `sonner`: Imports `toast` for displaying notifications.

### Interfaces
#### `AIResponse`
Defines the structure of the expected response from the AI backend:
- `action`: A string representing the action taken (e.g., "create_task").
- `data`: A key-value object containing data related to the action.
- `response_text`: Human-readable response from the AI.

### Component: `AICommandBar`
#### State
- `input` (`string`): Stores the current user input in the text field.
- `isLoading` (`boolean`): Tracks whether an API request is in progress.
- `isExpanded` (`boolean`): Controls the visibility of the command bar modal.
- `lastResponse` (`string | null`): Stores the text of the last successful AI response to display inline.
- `inputRef` (`useRef`): Reference to the input element for auto-focusing.

#### Effects
- **Keyboard Shortcut (`useEffect`)**:
    - Listens for `keydown` events globally.
    - `Cmd+K` or `Ctrl+K`: Opens the command bar (`setIsExpanded(true)`) and focuses the input.
    - `Escape`: Closes the command bar and clears input.
    - Cleans up the event listener on unmount.

#### Functions
- **`handleSubmit`**:
    - Triggered on form submission (pressing Enter or clicking Send).
    - Prevents default form submission.
    - Checks if input is valid and not already loading.
    - Sets `isLoading` to true and clears `lastResponse`.
    - **API Call**:
        - Fetches `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-command`.
        - Method: `POST`.
        - Headers: `Content-Type: application/json` and `Authorization` with the Supabase publishable key.
        - Body: Sends `{ prompt: input }`.
    - **Response Handling**:
        - Checks `response.ok`. Throws error if failed.
        - Parses JSON response as `AIResponse`.
        - Updates `lastResponse` and shows a success toast.
        - Clears the input field.
    - **Error Handling**: Logs error and shows an error toast.
    - **Finally**: Resets `isLoading` to false.

### JSX Structure (Render)
1.  **Mobile Trigger (`motion.button`)**:
    - Visible only on mobile (`md:hidden`).
    - Fixed at bottom-right.
    - Expands the command bar on click.
2.  **Backdrop (`AnimatePresence` + `motion.div`)**:
    - Renders when `isExpanded` is true.
    - Darkens the background (`bg-background/80 backdrop-blur-sm`).
    - Closes command bar when clicked.
3.  **Command Bar Modal (`AnimatePresence` + `motion.div`)**:
    - Renders when `isExpanded` is true.
    - **Animations**: Slides up and scales in.
    - **Layout**: Centered on desktop, fixed at top during mobile/expanded.
    - **Form**:
        - Contains `Sparkles` icon.
        - **Input**: Controlled input, auto-focused, disabled during loading.
        - **Actions**:
            - Mic button (placeholder for voice input).
            - Send button (shows `Loader2` spinner when loading, `Send` icon otherwise).
            - Close button (`X` icon).
    - **Response Area**:
        - Displays `lastResponse` if available, with a slide-down animation.
    - **Keyboard Hints**:
        - Visible on desktop.
        - Shows `Cmd+K` to open, `ESC` to close.
4.  **Desktop Trigger**:
    - Visible on desktop (`hidden md:block`).
    - Fixed at bottom center-right.
    - A longer button with "Ask AI anything..." text and keyboard shortcut hint.

## Key Features
- **Responsive Design**: distinct triggers for mobile vs desktop.
- **Animations**: Smooth transitions using `framer-motion`.
- **Edge Function Integration**: Direct integration with Supabase Edge Functions.
- **UX**: Keyboard shortcuts, toasts, loading states, and immediate feedback.
