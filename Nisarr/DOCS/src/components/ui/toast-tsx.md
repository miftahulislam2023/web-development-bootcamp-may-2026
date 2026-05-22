# toast.tsx Analysis

**Path**: `src/components/ui/toast.tsx`

## Overview
`Toast` provides notification messages. Built on `@radix-ui/react-toast`.

## Detailed Code Analysis

### Components
- **`ToastProvider`**: Context provider.
- **`ToastViewport`**:
    - Where toasts appear (fixed position).
    - `top-0` (mobile), `bottom-0 right-0` (desktop).
- **`Toast` (Root)**:
    - **Variants**: `default`, `destructive`.
    - Animations for slide-in/out and swipe-to-dismiss.
- **`ToastAction`**: Button inside toast.
- **`ToastClose`**: Close icon (`X`).
- **`ToastTitle` / `ToastDescription`**: Text content.

### Key Logic
- Manages the queuing and display of transient messages.
