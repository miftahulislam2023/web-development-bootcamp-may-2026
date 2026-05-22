"use server";
import {
  ITransactionTotals,
  ITransactionTotalsWhere,
} from "@/interfaces/interfaces"; 
import prisma from "@/prisma/prisma";

export async function getTransactionTotalsByUser(
  userId: string,
  month?: number,
): Promise<ITransactionTotals> {
  const where: ITransactionTotalsWhere = { userId };

  if (month) {
    const now = new Date();
    const year = now.getFullYear();
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    where.created_at = {
      gte: startOfMonth,
      lte: endOfMonth,
    };
  }

  const totals = await prisma.transactions.groupBy({
    by: ["type"],
    where,
    _sum: { amount: true },
  });

  const income = totals.find((t) => t.type === "income")?._sum.amount || 0;
  const expense = totals.find((t) => t.type === "expense")?._sum.amount || 0;

  return { income, expense };
}

export async function getTransactionHistoryData(
  userId: string,
  month?: number,
  year?: number,
) {
  const currentDate = new Date();
  const selectedMonth = month ?? currentDate.getMonth() + 1;
  const selectedYear = year ?? currentDate.getFullYear();

  const history = await prisma.monthHistory.findMany({
    where: {
      userId,
      month: selectedMonth,
      year: selectedYear,
    },

    orderBy: {
      day: "asc",
    },
  });

  const data = history.map((item) => ({
    day: item.day,
    income: item.income,
    expense: item.expense,
  }));

  return data;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function getYearlyTransactionHistoryData(
  userId: string,
  year?: number,
) {
  const currentDate = new Date();
  const selectedYear = year ?? currentDate.getFullYear();

  const history = await prisma.yearHistory.findMany({
    where: {
      userId,
      year: selectedYear,
    },

    orderBy: {
      month: "asc",
    },
  });

  const data = history.map((item) => ({
    month: monthNames[item.month - 1] || item.month.toString(),
    income: item.income,
    expense: item.expense,
  }));

  return data;
}
