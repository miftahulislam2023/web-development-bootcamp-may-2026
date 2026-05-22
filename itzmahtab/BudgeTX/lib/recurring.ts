import { db } from "@/lib/prisma";

export function calculateNextRecurringDate(date: Date, interval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") {
  const next = new Date(date);
  switch (interval) {
    case "DAILY": next.setDate(next.getDate() + 1); break;
    case "WEEKLY": next.setDate(next.getDate() + 7); break;
    case "MONTHLY": next.setMonth(next.getMonth() + 1); break;
    case "YEARLY": next.setFullYear(next.getFullYear() + 1); break;
  }
  return next;
}

export function isTransactionDue(transaction: { lastProcessed: Date | null; nextRecurringDate: Date | null }) {
  if (!transaction.lastProcessed) return true;
  return new Date(transaction.nextRecurringDate ?? new Date()) <= new Date();
}

export function isNewMonth(lastAlertDate: Date, currentDate: Date) {
  return lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear();
}

export async function getMonthlyStats(userId: string, month: Date) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: { userId, date: { gte: startDate, lte: endDate } },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    { totalExpenses: 0, totalIncome: 0, byCategory: {} as Record<string, number>, transactionCount: transactions.length }
  );
}
