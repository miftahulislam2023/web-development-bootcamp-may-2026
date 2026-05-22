# src/pages/ForgotPasswordPage.tsx

Documentation for `src/pages/ForgotPasswordPage.tsx`.

## Overview
A two-step authentication recovery flow utilizing OTPs (One-Time Passwords).
- **Step 1 (Request)**: Prompts for the user's email, triggering `forgotPassword(email)` from the `AuthContext` to dispatch an OTP.
- **Step 2 (Reset)**: An interactive 6-digit OTP input array requiring explicit numeric typing. Validates the code against the new password requirement before executing `resetPassword(email, otpCode, newPassword)`.

## Dart Implementation

In Flutter, the 6-digit OTP input can be easily implemented using the `pinput` package or by building a custom row of `TextField` widgets with managed `FocusNode` transitions.

```dart
// Flutter implementation skeleton
class ForgotPasswordPage extends StatefulWidget {
  @override
  _ForgotPasswordPageState createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  int step = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedSwitcher(
        duration: Duration(milliseconds: 300),
        child: step == 1 ? _buildEmailForm() : _buildOtpResetForm()
      )
    );
  }
}
```
