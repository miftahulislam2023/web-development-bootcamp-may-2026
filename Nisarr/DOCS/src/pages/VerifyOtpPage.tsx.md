# src/pages/VerifyOtpPage.tsx

Documentation for `src/pages/VerifyOtpPage.tsx`.

## Overview
Finalizes the registration loop by enforcing email verification.
- **Array Parsing**: Extracts the targeting email from the URL via `useSearchParams()`.
- **Keyboard Injection Handling**: Implements a `handlePaste` function extracting clipboard payload, removing non-numeric characters, and automatically distributing the remaining integers linearly across the 6 physical input DOM elements.
- **Context**: Calls `verifyOtp` and forcefully redirects to the dashboard root `/` upon 200 OK.

## Dart Implementation

A standard `pinput` (Pin Input) implementation handles automatic pasting, next-field focus, and numeric keyboards natively.

```dart
// Flutter implementation skeleton
import 'package:pinput/pinput.dart';

class VerifyOtpPage extends StatelessWidget {
  final String email;
  VerifyOtpPage({required this.email});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Pinput(
          length: 6,
          onCompleted: (pin) => _verifyCode(pin),
        )
      )
    );
  }
}
```
