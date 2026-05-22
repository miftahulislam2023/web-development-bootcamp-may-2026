"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { TransactionData } from "./types";

const serializeAmount = <T extends { amount: { toNumber: () => number } }>(
  obj: T
): Omit<T, "amount"> & { amount: number } => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

export async function createTransaction(data: TransactionData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const account = await db.account.findFirst({
    where: { id: data.accountId, userId: user.id },
  });
  if (!account) throw new Error("Account not found");

  const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
  const newBalance = account.balance.toNumber() + balanceChange;

  const transaction = await db.$transaction(async (tx) => {
    const newTransaction = await tx.transaction.create({
      data: {
        ...data,
        userId: user.id,
        nextRecurringDate:
          data.isRecurring && data.recurringInterval
            ? calculateNextRecurringDate(data.date, data.recurringInterval)
            : null,
      },
    });

    await tx.account.update({
      where: { id: data.accountId },
      data: { balance: newBalance },
    });

    return newTransaction;
  });

  revalidatePath("/dashboard");
  revalidatePath(`/account/${transaction.accountId}`);

  return { success: true, data: serializeAmount(transaction) };
}

export async function getTransaction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findFirst({
    where: { id, userId: user.id },
  });
  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id: string, data: TransactionData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const originalTransaction = await db.transaction.findFirst({
    where: { id, userId: user.id },
    include: { account: true },
  });
  if (!originalTransaction) throw new Error("Transaction not found");

  const oldBalanceChange =
    originalTransaction.type === "EXPENSE"
      ? -originalTransaction.amount.toNumber()
      : originalTransaction.amount.toNumber();

  const newBalanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
  const netBalanceChange = newBalanceChange - oldBalanceChange;

  const transaction = await db.$transaction(async (tx) => {
    const updated = await tx.transaction.update({
      where: { id },
      data: {
        ...data,
        nextRecurringDate:
          data.isRecurring && data.recurringInterval
            ? calculateNextRecurringDate(data.date, data.recurringInterval)
            : null,
      },
    });

    await tx.account.update({
      where: { id: data.accountId },
      data: { balance: { increment: netBalanceChange } },
    });

    return updated;
  });

  revalidatePath("/dashboard");
  revalidatePath(`/account/${data.accountId}`);

  return { success: true, data: serializeAmount(transaction) };
}

export async function getUserTransactions(query: Record<string, any> = {}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const transactions = await db.transaction.findMany({
    where: { userId: user.id, ...query },
    include: { account: true },
    orderBy: { date: "desc" },
  });

  return { success: true, data: transactions };
}

function calculateNextRecurringDate(
  startDate: Date,
  interval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
) {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY": date.setDate(date.getDate() + 1); break;
    case "WEEKLY": date.setDate(date.getDate() + 7); break;
    case "MONTHLY": date.setMonth(date.getMonth() + 1); break;
    case "YEARLY": date.setFullYear(date.getFullYear() + 1); break;
  }
  return date;
}
