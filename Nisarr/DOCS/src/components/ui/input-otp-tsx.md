# input-otp.tsx Analysis

**Path**: `src/components/ui/input-otp.tsx`

## Overview
`InputOTP` is a specialized input for One-Time Passwords (OTP). Built on `input-otp` library.

## Detailed Code Analysis

### Imports
- `input-otp`: Core library.
- `lucide-react`: `Dot` (used as separator).

### Components
- **`InputOTP`**:
    - Root wrapper.
    - Disables interactions if disabled.
- **`InputOTPGroup`**:
    - Flex container for grouping slots.
- **`InputOTPSlot`**:
    - Represents a single digit.
    - **Styles**: Bordered box (`h-10 w-10`).
    - **Active State**: Shows ring (`ring-2`) when focused.
    - **Fake Caret**: `animate-caret-blink` mimics a cursor.
- **`InputOTPSeparator`**:
    - Visual separator (dot) between groups of digits (e.g., 3-3 split).

### Key Logic
- Handles focus management between individual digit slots.
