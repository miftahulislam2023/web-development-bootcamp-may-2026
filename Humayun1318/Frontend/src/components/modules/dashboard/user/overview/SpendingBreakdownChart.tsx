// components/modules/dashboard/charts/SpendingBreakdownChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { TrendingDown, DollarSign } from "lucide-react";
import { useGetAllTransactionsQuery } from "@/redux/features/transactions/transactions.api";
import { useUser } from "@/hooks/useUser";
import { useMemo } from "react";

const prepareSpendingDataFromTransactions = (transactions: any[], currency: string) => {
  const expenses = transactions?.filter(t => t.type === 'expense') || [];
  
  const categoryMap = new Map();
  
  expenses.forEach(expense => {
    const categoryName = expense.categoryName || 'Uncategorized';
    const amount = Number(expense.amount) || 0;
    
    if (categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, categoryMap.get(categoryName) + amount);
    } else {
      categoryMap.set(categoryName, amount);
    }
  });
  
  const totalExpenses = Array.from(categoryMap.values()).reduce((sum, value) => sum + value, 0);
  
  const spendingData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
      formattedValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    }))
    .sort((a, b) => b.value - a.value);
  
  return { spendingData, totalExpenses };
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-foreground mb-1">{data.name}</p>
        <p className="text-lg font-bold text-primary">{data.formattedValue}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {data.percentage.toFixed(1)}% of total expenses
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  if (percent < 0.05) return null;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="var(--foreground)"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SpendingBreakdownChart = () => {
  const { data: transactionsData, isLoading, error } = useGetAllTransactionsQuery({ limit: 100 });
  const { user: userData } = useUser();
  
  const userCurrency = userData?.currency || "USD";
  const transactions = transactionsData?.data || [];
  
  const { spendingData, totalExpenses } = useMemo(() => 
    prepareSpendingDataFromTransactions(transactions, userCurrency), 
    [transactions, userCurrency]
  );
  
  const topCategory = spendingData[0];

  const COLORS = [
    "var(--primary)",
    "hsl(142, 76%, 36%)",
    "hsl(346, 77%, 49%)",
    "hsl(38, 92%, 50%)",
    "hsl(262, 83%, 58%)",
    "hsl(187, 92%, 43%)",
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Spending Breakdown
            </CardTitle>
          </div>
          
          {!isLoading && !error && spendingData.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {spendingData.length} categories
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4 animate-pulse">
              <DollarSign className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">Loading Spending Data</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Please wait while we fetch your expense data...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-4">
              <DollarSign className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-base font-medium text-red-600 dark:text-red-400 mb-1">Failed to Load Data</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Unable to load spending breakdown. Please try again later.
            </p>
          </div>
        ) : spendingData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <DollarSign className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">No Expense Data</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add expense transactions to see your spending breakdown by category
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Highest Spending</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{topCategory.name}</p>
                <p className="text-sm font-bold text-rose-500">{topCategory.formattedValue}</p>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${topCategory.percentage}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {topCategory.percentage.toFixed(1)}% of total expenses
              </p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {spendingData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-base font-bold text-foreground">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: userCurrency,
                    minimumFractionDigits: 2
                  }).format(totalExpenses)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Average per category</p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: userCurrency,
                    minimumFractionDigits: 2
                  }).format(totalExpenses / spendingData.length)}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingBreakdownChart;