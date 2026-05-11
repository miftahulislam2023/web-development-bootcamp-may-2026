// src/app/(dashboard)/page.tsx
"use client";

import { useMemo } from "react";
import {
  useTransactions,
  useTransactionSummary,
  useBudgets,
} from "@/lib/hooks";
import KPICard from "@/components/cards/KPICard";
import BudgetCard from "@/components/cards/BudgetCard";
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
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export default function DashboardPage() {
  const { data: transactionsData, isLoading: transLoading } = useTransactions(
    1,
    10,
  );
  const { data: budgetsData, isLoading: budgetLoading } = useBudgets();

  // Calculate summary
  const summary = useMemo(() => {
    if (!transactionsData?.data) return { income: 0, expense: 0, balance: 0 };

    const transactions = transactionsData.data;
    const income = transactions
      .filter((t: any) => t.type === "income")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    const expense = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactionsData]);

  // Prepare chart data
  const expenseChartData = useMemo(() => {
    if (!transactionsData?.data) return [];

    const byCategory: Record<string, number> = {};
    transactionsData.data
      .filter((t: any) => t.type === "expense")
      .forEach((t: any) => {
        byCategory[t.category] =
          (byCategory[t.category] || 0) + parseFloat(t.amount);
      });

    return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  }, [transactionsData]);

  const trendChartData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      data.push({
        date: format(date, "MMM dd"),
        income: Math.random() * 5000,
        expense: Math.random() * 3000,
      });
    }
    return data;
  }, []);

  const budgets = budgetsData?.data || [];
  const transactions = transactionsData?.data || [];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Balance"
            value={`$${summary.balance.toFixed(2)}`}
            icon={<Wallet className="text-blue-500" size={20} />}
          />
          <KPICard
            title="Total Income"
            value={`$${summary.income.toFixed(2)}`}
            icon={<TrendingUp className="text-green-500" size={20} />}
            change={12}
            trend="down"
          />
          <KPICard
            title="Total Expense"
            value={`$${summary.expense.toFixed(2)}`}
            icon={<AlertCircle className="text-red-500" size={20} />}
            change={8}
            trend="up"
          />
          <KPICard
            title="Active Budgets"
            value={budgets.length}
            icon={<PieChart className="text-purple-500" size={20} />}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Charts */}
          <ExpenseChart data={expenseChartData} />
          <TrendChart data={trendChartData} />

          {/* Top Budget */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Top Budgets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgets.slice(0, 3).map((budget: any) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{budget.category}</span>
                  <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${((budget.spent || 0) / budget.limitAmount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Date & Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 5).map((transaction: any) => (
                  <TransactionRow
                    key={transaction.id}
                    id={transaction.id}
                    type={transaction.type}
                    amount={transaction.amount}
                    category={transaction.category}
                    date={transaction.date}
                    description={transaction.description}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
