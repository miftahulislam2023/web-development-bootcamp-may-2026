# src/pages/LoginPage.tsx

Documentation for `src/pages/LoginPage.tsx`.

## Overview
The primary authentication gateway supporting both standard Email/Password and third-party Google OAuth via `@react-oauth/google`.
- **Dual Flow**: Bridges native inputs with `<GoogleLogin />` component.
- **Routing Integration**: Leverages `useLocation` state to capture the pre-login intended destination (`location.state?.from`) to automatically redirect the user upon successful authentication.
- **Visuals**: Contains extensive Framer Motion implementations including a rotating 3D tilted app mockup, particle blobs, and SVG path animations (`pathLength` draw effects).

## Dart Implementation

Flutter provides excellent OAuth support via the `google_sign_in` package combined with `firebase_auth` (if using Firebase) or a custom backend handler.

```dart
// Flutter implementation skeleton
class LoginPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Left branding (Hide on mobile via LayoutBuilder)
          if (MediaQuery.of(context).size.width > 800) _buildHeroBranding(),
          
          // Right Form
          Expanded(
            child: _buildLoginForm(
               onGooglePress: () => await AuthService().signInWithGoogle(),
               onEmailPress: () => await AuthService().signInWithEmail(...)
            )
          )
        ]
      )
    );
  }
}
```
