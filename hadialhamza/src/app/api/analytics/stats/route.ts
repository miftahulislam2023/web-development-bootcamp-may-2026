import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const transactions = await Transaction.find({ userId: session.user.id });

    // Total Balance
    const totalBalance = transactions.reduce((sum, t) => {
      return t.type === "income" ? sum + t.amount : sum - t.amount;
    }, 0);

    // Current Month
    const currentMonthTx = transactions.filter(t => t.date >= startOfMonth);
    const monthlyIncome = currentMonthTx
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = currentMonthTx
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Previous Month (for trends)
    const prevMonthTx = transactions.filter(t => t.date >= startOfPrevMonth && t.date <= endOfPrevMonth);
    const prevMonthlyIncome = prevMonthTx
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const prevMonthlyExpenses = prevMonthTx
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const calculateTrend = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? "+100%" : "0%";
      const diff = ((current - prev) / prev) * 100;
      return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
    };

    const stats = [
      {
        label: "Total Balance",
        value: totalBalance,
        trend: calculateTrend(totalBalance, totalBalance - (monthlyIncome - monthlyExpenses)), // Simplified trend
        trendUp: totalBalance >= totalBalance - (monthlyIncome - monthlyExpenses),
      },
      {
        label: "Monthly Income",
        value: monthlyIncome,
        trend: calculateTrend(monthlyIncome, prevMonthlyIncome),
        trendUp: monthlyIncome >= prevMonthlyIncome,
      },
      {
        label: "Monthly Expenses",
        value: monthlyExpenses,
        trend: calculateTrend(monthlyExpenses, prevMonthlyExpenses),
        trendUp: monthlyExpenses <= prevMonthlyExpenses, // For expenses, down is good
      },
      {
        label: "Total Savings",
        value: totalBalance > 0 ? totalBalance : 0, // Placeholder for savings logic
        trend: "+5.2%", // Mock trend for now
        trendUp: true,
      }
    ];

    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error("Stats Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
