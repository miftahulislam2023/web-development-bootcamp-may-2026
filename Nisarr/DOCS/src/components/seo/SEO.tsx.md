# src/components/seo/SEO.tsx

Documentation for `src/components/seo/SEO.tsx`.

## Overview
A utility component wrapping `react-helmet-async` to inject standard `<head>` metadata (canonical links, Open Graph tags, Twitter cards, theme colors).

## Dart Implementation

Flutter does not use HTML `<head>` tracking natively for mobile apps. However, if using Flutter Web, you can utilize the `seo` package or `meta_seo` to dynamically update `<meta>` tags.

```dart
// Flutter Web implementation skeleton using meta_seo
import 'package:meta_seo/meta_seo.dart';

class SEO extends StatelessWidget {
  final String title;
  final String description;

  const SEO({required this.title, required this.description});

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      final meta = MetaSEO();
      meta.ogTitle(ogTitle: title);
      meta.description(description: description);
      meta.ogDescription(ogDescription: description);
    }
    return SizedBox.shrink(); // Not a UI widget
  }
}
```
