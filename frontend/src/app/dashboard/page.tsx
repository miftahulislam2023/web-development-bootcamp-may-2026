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
  category:
    | string
    | {
        name?: string;
      }
    | null
    | undefined;
  date: string;
  description?: string;
};

type Budget = {
  id: string;
  name: string;
  category?:
    | string
    | {
        name?: string;
      }
    | null
    | undefined;
  spent?: number;
  limitAmount: number;
};

export default function DashboardPage() {
  const { data: transactionsData } = useTransactions(1, 10);
  const { data: budgetsData } = useBudgets();

  // Calculate summary
  const summary = useMemo(() => {
    if (!transactionsData?.data) return { income: 0, expense: 0, balance: 0 };

    const transactions = transactionsData.data as Transaction[];
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const expense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

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
    (transactionsData.data as Transaction[])
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const categoryLabel =
          typeof transaction.category === "string"
            ? transaction.category
            : transaction.category?.name || "Uncategorized";
        byCategory[categoryLabel] =
          (byCategory[categoryLabel] || 0) + Number(transaction.amount);
      });

    return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  }, [transactionsData]);

  const trendChartData = useMemo(() => {
    const sampleValues = [
      { income: 4200, expense: 2100 },
      { income: 4600, expense: 2600 },
      { income: 4800, expense: 2300 },
      { income: 5100, expense: 2800 },
      { income: 5300, expense: 2500 },
      { income: 5600, expense: 2700 },
    ];

    const data: Array<{ date: string; income: number; expense: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      data.push({
        date: format(date, "MMM dd"),
        income: sampleValues[5 - i].income,
        expense: sampleValues[5 - i].expense,
      });
    }
    return data;
  }, []);

  const budgets = (budgetsData?.data ?? budgetsData ?? []) as Budget[];
  const transactions = (transactionsData?.data ??
    transactionsData ??
    []) as Transaction[];

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
              {budgets.slice(0, 3).map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">
                    {typeof budget.category === "string"
                      ? budget.category
                      : budget.category?.name || budget.name}
                  </span>
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
                {transactions.slice(0, 5).map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    id={transaction.id}
                    type={transaction.type}
                    amount={Number(transaction.amount)}
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
