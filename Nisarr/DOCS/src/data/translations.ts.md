# src/data/translations.ts

Documentation for `src/data/translations.ts`.

## Overview
A giant statically defined JSON-style dictionary containing the English (`en`) and Bengali (`bn`) copy for the landing/marketing pages of the application. Not dynamically loaded from a database, but hardcoded for speed.

## Dart Implementation

Flutter recommends placing these strings into `.arb` files (Application Resource Bundle) within an `l10n` folder.

```json
// Example app_en.arb
{
  "navFeatures": "Features",
  "heroBadge": "AI-Powered Personal OS",
  "ctaStart": "Start Free"
}

// Example app_bn.arb
{
  "navFeatures": "ফিচার",
  "heroBadge": "AI-চালিত পার্সোনাল OS",
  "ctaStart": "ফ্রি-তে শুরু করুন"
}
```
And compiling them natively using Flutter's built-in localization parser to enable statically-typed, null-safe `AppLocalizations.of(context)!.heroBadge`.
