import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/app/emails/template";
import { sendEmail } from "@/actions/send-email";
import { calculateNextRecurringDate, isTransactionDue, isNewMonth, getMonthlyStats } from "@/lib/recurring";

const fallbackInsights = [
  "Your highest expense category may need attention.",
  "Setting a budget can improve financial management.",
  "Track recurring expenses to identify savings.",
];

export async function BackgroundProcessor() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return null;

  try {
    await processRecurringTransactions(user.id);
  } catch (e) {
    console.error("BackgroundProcessor: recurring transactions failed", e);
  }

  try {
    await checkBudgetAlerts(user);
  } catch (e) {
    console.error("BackgroundProcessor: budget alerts failed", e);
  }

  try {
    await sendMonthlyReport(user);
  } catch (e) {
    console.error("BackgroundProcessor: monthly report failed", e);
  }

  return null;
}

async function processRecurringTransactions(userId: string) {
  const dueTransactions = await db.transaction.findMany({
    where: {
      userId,
      isRecurring: true,
      status: "COMPLETED",
      OR: [
        { lastProcessed: null },
        { nextRecurringDate: { lte: new Date() } },
      ],
    },
    include: { account: true },
  });

  for (const transaction of dueTransactions) {
    if (!isTransactionDue(transaction)) continue;

    const balanceChange = transaction.type === "EXPENSE"
      ? -transaction.amount.toNumber()
      : transaction.amount.toNumber();

    await db.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          type: transaction.type,
          amount: transaction.amount,
          description: `${transaction.description} (Recurring)`,
          date: new Date(),
          category: transaction.category,
          userId: transaction.userId,
          accountId: transaction.accountId,
          isRecurring: false,
        },
      });

      await tx.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: balanceChange } },
      });

      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          lastProcessed: new Date(),
          nextRecurringDate: calculateNextRecurringDate(
            new Date(),
            transaction.recurringInterval ?? "MONTHLY"
          ),
        },
      });
    });
  }
}

async function checkBudgetAlerts(user: { id: string; email: string; name: string | null }) {
  const budgets = await db.budget.findMany({
    where: { userId: user.id },
  });

  for (const budget of budgets) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    });

    const totalExpenses = expenses._sum.amount?.toNumber() || 0;
    const percentageUsed = (totalExpenses / budget.amount.toNumber()) * 100;

    if (percentageUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), now))) {
      await sendEmail({
        to: user.email,
        subject: "Budget Alert — You're close to your limit",
        react: EmailTemplate({
          userName: user.name ?? "User",
          type: "budget-alert",
          data: {
            percentageUsed,
            budgetAmount: Number(budget.amount).toFixed(1),
            totalExpenses: Number(totalExpenses).toFixed(1),
            accountName: "All accounts",
          },
        }),
      });

      await db.budget.update({ where: { id: budget.id }, data: { lastAlertSent: new Date() } });
    }
  }
}

async function sendMonthlyReport(user: { id: string; email: string; name: string | null }) {
  const today = new Date();
  if (today.getDate() !== 1) return;

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const stats = await getMonthlyStats(user.id, lastMonth);
  const monthName = lastMonth.toLocaleString("default", { month: "long" });
  const insights = fallbackInsights;

  await sendEmail({
    to: user.email,
    subject: `Your Monthly Financial Report - ${monthName}`,
    react: EmailTemplate({
      userName: user.name ?? "User",
      type: "monthly-report",
      data: { stats, month: monthName, insights },
    }),
  });
}
