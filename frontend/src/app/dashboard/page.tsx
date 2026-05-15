"use client";

import { useMemo } from "react";
import { useTransactions, useBudgets } from "@/lib/hooks";
import KPICard from "@/components/cards/KPICard";
import ExpenseChart from "@/components/charts/ExpenseChart";
import TrendChart from "@/components/charts/TrendChart";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import TransactionRow from "@/components/cards/TransactionRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Wallet, TrendingUp, PieChart, AlertCircle } from "lucide-react";
import { format, subMonths } from "date-fns";

type Transaction = {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: string | number;
  category?: string | { name?: string } | null;
  date: string;
  description?: string;
};

type Budget = {
  id: string;
  name: string;
  category?: string | { name?: string } | null;
  spent?: number;
  limitAmount: number;
};

export default function DashboardPage() {
  const { data: transactionsData } = useTransactions(1, 10);
  const { data: budgetsData } = useBudgets();

  const summary = useMemo(() => {
    if (!transactionsData?.data) return { income: 0, expense: 0, balance: 0 };

    const transactions = transactionsData.data as Transaction[];

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);

    return { income, expense, balance: income - expense };
  }, [transactionsData]);

  const expenseChartData = useMemo(() => {
    if (!transactionsData?.data) return [];

    const map: Record<string, number> = {};

    (transactionsData.data as Transaction[])
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key =
          typeof t.category === "string"
            ? t.category
            : t.category?.name || "Others";

        map[key] = (map[key] || 0) + Number(t.amount);
      });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactionsData]);

  const trendChartData = useMemo(() => {
    const sample = [
      { income: 4200, expense: 2100 },
      { income: 4600, expense: 2600 },
      { income: 4800, expense: 2300 },
      { income: 5100, expense: 2800 },
      { income: 5300, expense: 2500 },
      { income: 5600, expense: 2700 },
    ];

    return Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        date: format(date, "MMM yy"),
        income: sample[i].income,
        expense: sample[i].expense,
      };
    });
  }, []);

  const budgets = (budgetsData?.data ?? budgetsData ?? []) as Budget[];
  const transactions = (transactionsData?.data ??
    transactionsData ??
    []) as Transaction[];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        <div className="mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Financial Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of income, expenses, and budget performance
            </p>
          </div>

          {/* KPI GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <KPICard
              title="Total Balance"
              value={`$${summary.balance.toFixed(2)}`}
              icon={<Wallet className="text-blue-500" size={18} />}
            />
            <KPICard
              title="Income"
              value={`$${summary.income.toFixed(2)}`}
              icon={<TrendingUp className="text-green-500" size={18} />}
              change={12}
              trend="up"
            />
            <KPICard
              title="Expenses"
              value={`$${summary.expense.toFixed(2)}`}
              icon={<AlertCircle className="text-red-500" size={18} />}
              change={8}
              trend="down"
            />
            <KPICard
              title="Active Budgets"
              value={budgets.length}
              icon={<PieChart className="text-purple-500" size={18} />}
            />
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* Expense Chart */}
            <Card className="lg:col-span-2 shadow-sm border-muted/40">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Expense Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <ExpenseChart data={expenseChartData} />
              </CardContent>
            </Card>

            {/* Budget Card */}
            <Card className="shadow-sm border-muted/40">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Budget Usage
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {budgets.slice(0, 4).map((b) => (
                  <div key={b.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate">
                        {typeof b.category === "string"
                          ? b.category
                          : b.category?.name || b.name}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {Math.round(((b.spent || 0) / b.limitAmount) * 100)}%
                      </span>
                    </div>

                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-indigo-500"
                        style={{
                          width: `${Math.min(
                            ((b.spent || 0) / b.limitAmount) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* TREND + RECENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* Trend */}
            <Card className="lg:col-span-2 shadow-sm border-muted/40">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Income vs Expense Trend
                </CardTitle>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                <TrendChart data={trendChartData} />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm border-muted/40">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Recent Activity
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {transactions.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-muted-foreground truncate max-w-[140px]">
                      {typeof t.category === "string"
                        ? t.category
                        : t.category?.name || "Other"}
                    </span>

                    <span
                      className={
                        t.type === "expense" ? "text-red-500" : "text-green-500"
                      }
                    >
                      ${Number(t.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* TABLE */}
          <Card className="shadow-sm border-muted/40 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Recent Transactions
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {transactions.slice(0, 5).map((t) => (
                      <TransactionRow
                        key={t.id}
                        id={t.id}
                        type={t.type}
                        amount={Number(t.amount)}
                        category={t.category}
                        date={t.date}
                        description={t.description}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
