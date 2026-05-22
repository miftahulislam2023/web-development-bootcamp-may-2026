# src/hooks/useBudget.ts

Documentation for `src/hooks/useBudget.ts`.

## Overview
A comprehensive Data Hook wrapping `@tanstack/react-query`. Interacts with `/data/budgets` and `/data/savings_transactions` API routes.
Features:
- Handles standard budgeting logic and split `regular` vs `special` flags for tracking standard monthly needs vs extraordinary funds.
- Advanced metric calculation `getBudgetRemaining` maps periodic targets (`weekly`, `monthly`, `yearly`) against the user's logged real expenses (`useFinance.expenses`) allowing real-time dashboard visualization of spending momentum.
- Full CRUD mutations (`addBudget`, `updateBudget`, `deleteBudget`, `addToSavings`, `deleteSavingsTransaction`).

## Dart Implementation

How to implement this code in Dart for APK, iOS, Web, and all platforms:

```dart
// Dart implementation guide and code here
// Mute state to generic Provider / Riverpod / Bloc Repositories executing direct `sqflite` commands.

class BudgetRepository extends ChangeNotifier {
   List<Budget> regularBudgets = [];
   List<Budget> specialBudgets = [];
   double budgetRemaining = 0.0;
   
   // A reference to the Finance repository or passing expenses manually
   final FinanceRepository financeRepo;

   BudgetRepository(this.financeRepo) {
      loadBudgets();
   }

   Future<void> loadBudgets() async {
      // fetch from sqflite 
      // calculate 'budgetRemaining' via financeRepo.expenses mapping to date heuristics
      notifyListeners();
   }

   Future<void> addBudget(Budget budget) async {
      // await db.insert('budgets', budget.toMap());
      await loadBudgets();
   }
}
```
