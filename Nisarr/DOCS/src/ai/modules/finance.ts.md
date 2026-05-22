# src/ai/modules/finance.ts

Documentation for `src/ai/modules/finance.ts`.

## Overview
This file serves as the strict translation layer between the user's natural language related to money and the application's actual finance tracking React Query hooks. It exports `FINANCE_PROMPT`, loaded with comprehensive rules teaching the AI how to categorize, parse dates, flag special transactions, and navigate the subtle differences between modifying budgets vs. savings goals. The `executeFinanceAction` switch-statement maps the parsed LLM `action` cleanly to mutation hooks like `hooks.addEntry.mutateAsync`.

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// Instead of React Hooks, Dart implementations utilize Repositories or Services triggering state rebuilds.

class FinanceAiExecutor {
  final FinanceService financeService;

  FinanceAiExecutor(this.financeService);

  Future<void> executeAction(String action, Map<String, dynamic> data) async {
    switch (action) {
      case "ADD_EXPENSE":
        await financeService.addEntry(
          type: "expense",
          amount: data['amount'] as double,
          category: data['category'] as String,
          description: data['description'] ?? "",
          date: data['date'] ?? DateTime.now().toIso8601String(),
        );
        break;
      // Implement ADD_INCOME, ADD_BUDGET, etc.
    }
  }
}
```
