# src/lib/turso.ts

Documentation for `src/lib/turso.ts`.

## Overview
A micro-shim file designed for backward compatibility, re-exporting modules (`db, generateId, initDatabase`) from the newly refactored `@/Database` core layer to prevent breaking older imports.

## Dart Implementation

Does not require a direct 1:1 recreation in Dart unless architecting similar module exports via a barrel file `export 'turso.dart';`
