# src/pages/RegisterPage.tsx

Documentation for `src/pages/RegisterPage.tsx`.

## Overview
Account creation gateway containing comprehensive form validation and split authentication paths (Email vs Google).
- **Validation State**: Implements an inline `passwordChecks` object to dynamically color feedback icons based on minimum length and confirmation matching before allowing submission.
- **Next-Step Routing**: Upon successful email registration, forces routing to `/verify-otp?email={encodedEmail}` instead of defaulting to login.
- **Visuals**: Contains an SVG orbital ring system wrapping a central Brain icon using Framer Motion rotation mathematics (`Math.cos`, `Math.sin`).

## Dart Implementation

Replicating the validation state in Flutter requires a `Form` widget with standard `TextFormField` validators or a robust state management class updating standard `TextField` decorations onChange.

```dart
// Flutter implementation skeleton
class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  
  void _submit() {
    if (_formKey.currentState!.validate()) {
       // Proceed to OTP Screen via context.go('/verify-otp')
    }
  }

  // Build methods...
}
```
