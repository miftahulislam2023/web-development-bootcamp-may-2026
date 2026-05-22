# src/components/dashboard/StudyAndTransactionsCard.tsx

Documentation for `src/components/dashboard/StudyAndTransactionsCard.tsx`.

## Overview
A combined visual card aggregating two distinct data arrays (`subjectProgressList` and `recentTransactions`) into a stacked vertical list. 
- Features custom horizontal width-based progress `<motion.div>` elements identical to the ones built in `MonthlySpendingCard`, but targeting study chapter completion.
- Custom mapped transaction list row showing red/green badging depending on `tx.type === "income"`.

## Dart Implementation

In Flutter, because mobile lists shouldn't scroll within scrollable column cards infinitely, `ListView.builder` inside these cards must be set to `shrinkWrap: true` and `physics: NeverScrollableScrollPhysics()` to integrate smoothly inside the primary `SingleChildScrollView` of the Dashboard page.

```dart
// Flutter implementation skeleton
Widget _buildTransactionList(List<Transaction> tx) {
  return ListView.builder(
    shrinkWrap: true,
    physics: NeverScrollableScrollPhysics(),
    itemCount: tx.length > 4 ? 4 : tx.length,
    itemBuilder: (context, index) {
      final t = tx[index];
      final isIncome = t.type == 'income';
      return ListTile(
        leading: Icon(
          isIncome ? Icons.arrow_upward : Icons.arrow_downward,
          color: isIncome ? Colors.green : Colors.red,
        ),
        title: Text(t.description),
        trailing: Text(
          '${isIncome ? '+' : '-'}৳${t.amount}',
          style: TextStyle(color: isIncome ? Colors.green : Colors.red)
        )
      );
    }
  );
}
```
