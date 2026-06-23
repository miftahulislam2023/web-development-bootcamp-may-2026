// components/modules/dashboard/user/insights/InsightsSection.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllTransactionsQuery } from "@/redux/features/transactions/transactions.api";
import { useUser } from "@/hooks/useUser";

import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  DollarSign,
  Coffee,
  Home,
  Car,
  ShoppingCart,
  Briefcase,
  Utensils,
  Film,
  Heart,
  type LucideIcon
} from "lucide-react";

// Helper to get category icon
const getCategoryIcon = (category: string): LucideIcon => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('food') || cat.includes('bazar') || cat.includes('grocery')) return Utensils;
  if (cat.includes('salary') || cat.includes('income') || cat.includes('freelance')) return Briefcase;
  if (cat.includes('rent') || cat.includes('home')) return Home;
  if (cat.includes('car') || cat.includes('fuel') || cat.includes('transport')) return Car;
  if (cat.includes('shopping') || cat.includes('internet') || cat.includes('bil')) return ShoppingCart;
  if (cat.includes('movie') || cat.includes('entertainment')) return Film;
  if (cat.includes('health') || cat.includes('medical')) return Heart;
  return Coffee;
};

// Calculate insights from real transactions data
const calculateInsightsFromTransactions = (transactions: any[], _userCurrency: string) => {
  if (!transactions || transactions.length === 0) {
    return {
      hasData: false,
      totalTransactions: 0,
      totalIncome: 0,
      totalExpense: 0,
      savingRate: 0,
      topExpenseCategory: null,
      mostFrequentCategory: null,
      bestMonth: null,
      worstMonth: null,
      monthlyComparison: null,
    };
  }

  // Calculate totals
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryExpenseMap = new Map();
  const categoryCountMap = new Map();
  const monthlyData = new Map();

  transactions.forEach(transaction => {
    const amount = Number(transaction.amount) || 0;
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (transaction.type === 'income') {
      totalIncome += amount;
    } else if (transaction.type === 'expense') {
      totalExpense += amount;
      
      // Category expense tracking
      const categoryName = transaction.categoryName || 'Uncategorized';
      categoryExpenseMap.set(categoryName, (categoryExpenseMap.get(categoryName) || 0) + amount);
      categoryCountMap.set(categoryName, (categoryCountMap.get(categoryName) || 0) + 1);
    }

    // Monthly balance tracking
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        month: monthName,
        monthKey,
        income: 0,
        expense: 0,
        balance: 0
      });
    }
    const month = monthlyData.get(monthKey);
    if (transaction.type === 'income') {
      month.income += amount;
    } else {
      month.expense += amount;
    }
    month.balance = month.income - month.expense;
  });

  // Calculate saving rate
  const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Find top expense category
  let topExpenseCategory = null;
  let maxExpense = 0;
  for (const [name, amount] of categoryExpenseMap) {
    if (amount > maxExpense) {
      maxExpense = amount;
      topExpenseCategory = {
        name,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      };
    }
  }

  // Find most frequent category
  let mostFrequentCategory = null;
  let maxCount = 0;
  for (const [name, count] of categoryCountMap) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentCategory = { name, count };
    }
  }

  // Find best and worst month
  const monthsArray = Array.from(monthlyData.values());
  let bestMonth = null;
  let worstMonth = null;
  let maxBalance = -Infinity;
  let minBalance = Infinity;

  monthsArray.forEach(month => {
    if (month.balance > maxBalance) {
      maxBalance = month.balance;
      bestMonth = { month: month.month, balance: month.balance };
    }
    if (month.balance < minBalance) {
      minBalance = month.balance;
      worstMonth = { month: month.month, balance: month.balance };
    }
  });

  // Calculate monthly comparison
  let monthlyComparison = null;
  if (monthsArray.length >= 2) {
    const currentMonth = monthsArray[monthsArray.length - 1];
    const previousMonth = monthsArray[monthsArray.length - 2];
    if (currentMonth && previousMonth && previousMonth.expense > 0) {
      const expenseChange = ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100;
      monthlyComparison = {
        expenseChange,
        isIncrease: expenseChange > 0,
        previousMonth: previousMonth.month,
        currentMonth: currentMonth.month
      };
    }
  }

  return {
    hasData: transactions.length > 0,
    totalTransactions: transactions.length,
    totalIncome,
    totalExpense,
    savingRate,
    topExpenseCategory,
    mostFrequentCategory,
    bestMonth,
    worstMonth,
    monthlyComparison,
  };
};

const InsightsSection: React.FC = () => {
  const { data: transactionsData, isLoading, error } = useGetAllTransactionsQuery({ limit: 100 });
  const { user: userData } = useUser();
  
  const userCurrency = userData?.currency || "USD";
  const transactions = transactionsData?.data || [];
  
  const insights = useMemo(() => 
    calculateInsightsFromTransactions(transactions, userCurrency), 
    [transactions, userCurrency]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Key Insights Title */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Key Insights</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your transaction history
        </p>
      </div>

      {isLoading ? (
        // Loading State
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted/50 animate-pulse w-8 h-8" />
                  <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-28 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        // Error State
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-sm text-red-600 dark:text-red-400">Failed to load insights</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please try again later
            </p>
          </CardContent>
        </Card>
      ) : !insights.hasData ? (
        // Empty State
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Not enough data to generate insights</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Add more transactions to see meaningful insights
            </p>
          </CardContent>
        </Card>
      ) : (
        // Data State
        <>
          {/* 3 Main Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Highest Spending Category */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <ShoppingBag className="w-4 h-4 text-rose-500" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Highest Spending</p>
                <p className="text-xl font-bold text-foreground mb-1">
                  {insights.topExpenseCategory?.name || 'N/A'}
                </p>
                {insights.topExpenseCategory && (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(insights.topExpenseCategory.amount)} 
                    ({insights.topExpenseCategory.percentage.toFixed(0)}% of expenses)
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Monthly Comparison */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  {insights.monthlyComparison && (
                    insights.monthlyComparison.isIncrease ? 
                      <ArrowUpRight className="w-4 h-4 text-rose-500" /> :
                      <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Comparison</p>
                {insights.monthlyComparison ? (
                  <>
                    <p className="text-lg font-bold text-foreground mb-1">
                      {insights.monthlyComparison.expenseChange > 0 ? '+' : ''}
                      {Math.abs(insights.monthlyComparison.expenseChange).toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      vs last month ({insights.monthlyComparison.previousMonth})
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Need 2+ months of data</p>
                )}
              </CardContent>
            </Card>

            {/* Saving Rate */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Wallet className="w-4 h-4 text-emerald-500" />
                  </div>
                  {insights.savingRate > 0 ? 
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" /> :
                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  }
                </div>
                <p className="text-sm text-muted-foreground mb-1">Saving Rate</p>
                <p className="text-xl font-bold text-foreground mb-1">
                  {insights.savingRate > 0 ? '+' : ''}{insights.savingRate.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  of total income saved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Most Frequent Category */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Most Frequent Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/50">
                    {React.createElement(getCategoryIcon(insights.mostFrequentCategory?.name || ''), {
                      className: "w-5 h-5 text-primary"
                    })}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {insights.mostFrequentCategory?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {insights.mostFrequentCategory?.count || 0} transactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best & Worst Month */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">Best Month</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-500">
                        {(insights?.bestMonth as any)?.month || 'N/A'}
                      </p>
                      {insights.bestMonth && (
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency((insights.bestMonth as any).balance)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                      <span className="text-xs text-muted-foreground">Worst Month</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-rose-500">
                        {(insights.worstMonth as any)?.month || 'N/A'}
                      </p>
                      {insights.worstMonth && (
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency((insights.worstMonth as any).balance)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Note */}
          <Card className="bg-muted/20 border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Summary:</span> You've made {insights.totalTransactions} transactions totaling 
                    {formatCurrency(insights.totalIncome)} income and {formatCurrency(insights.totalExpense)} expenses.
                    {insights.savingRate > 20 ? ' Great saving rate!' : insights.savingRate > 0 ? ' Keep saving!' : ' Try to reduce expenses.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InsightsSection;