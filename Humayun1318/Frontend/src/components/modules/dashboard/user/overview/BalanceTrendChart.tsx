// components/modules/dashboard/charts/BalanceTrendChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { useGetAllTransactionsQuery } from "@/redux/features/transactions/transactions.api";
import { useUser } from "@/hooks/useUser";
import { useMemo } from "react";

const prepareChartDataFromTransactions = (transactions: any[]) => {
  const currentYear = new Date().getFullYear();
  
  const monthsData: any = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, i, 1);
    monthsData.push({
      month: date.toLocaleString('default', { month: 'long' }),
      monthShort: date.toLocaleString('default', { month: 'short' }),
      monthIndex: i,
      income: 0,
      expense: 0,
      balance: 0
    });
  }
  
  transactions?.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();
    
    if (transactionYear === currentYear) {
      const amount = Number(transaction.amount) || 0;
      
      if (transaction.type === 'income') {
        monthsData[transactionMonth].income += amount;
      } else if (transaction.type === 'expense') {
        monthsData[transactionMonth].expense += amount;
      }
    }
  });
  
  let runningBalance = 0;
  monthsData.forEach((month: any) => {
    runningBalance = runningBalance + month.income - month.expense;
    month.balance = runningBalance;
  });
  
  return { data: monthsData, year: currentYear };
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-2.5 shadow-lg min-w-[180px]">
        <p className="text-xs font-semibold text-foreground mb-1.5">{data.month}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Income</span>
            <span className="text-xs font-semibold text-emerald-500">
              ₹{data.income.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Expense</span>
            <span className="text-xs font-semibold text-rose-500">
              ₹{data.expense.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="border-t border-border my-1"></div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-foreground">Balance</span>
            <span className="text-sm font-bold text-primary">
              ₹{data.balance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Main component to display the balance trend chart
const BalanceTrendChart = () => {
  const { data: transactionsData, isLoading, error } = useGetAllTransactionsQuery({});
  const { user: userData } = useUser();
  
  const userCurrency = userData?.currency || "USD";
  const transactions = transactionsData?.data || [];
  
  const { data: chartData, year } = useMemo(() => 
    prepareChartDataFromTransactions(transactions), 
    [transactions]
  );
  
  const hasData = chartData.some((item: any) => item.income > 0 || item.expense > 0);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Balance Trend
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{year}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-xs text-muted-foreground">Expense</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Balance</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-3 animate-pulse">
              <TrendingUp className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">Failed to load chart data</p>
            <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">No transaction data available</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(346, 77%, 49%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(346, 77%, 49%)" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                
                <XAxis 
                  dataKey="monthShort" 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  label={{ 
                    value: `Amount (${userCurrency})`, 
                    position: 'insideLeft', 
                    angle: -90,
                    style: { fontSize: '10px', fill: 'var(--foreground)' }
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value.toString();
                  }}
                  width={50}
                />
                
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  label={{ 
                    value: `Balance (${userCurrency})`, 
                    position: 'insideRight', 
                    angle: 90,
                    style: { fontSize: '10px', fill: 'var(--foreground)' }
                  }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value.toString();
                  }}
                  width={50}
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.08 }} />
                
                <Bar yAxisId="left" dataKey="income" name="Income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} barSize={35} />
                <Bar yAxisId="left" dataKey="expense" name="Expense" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} barSize={35} />
                <Line yAxisId="right" type="monotone" dataKey="balance" name="Balance" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>

            <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              📊 <span className="font-medium text-foreground">Green bars</span> = Monthly Income | 
              <span className="font-medium text-foreground ml-1"> Red bars</span> = Monthly Expense | 
              <span className="font-medium text-primary ml-1"> Line</span> = Running Balance
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceTrendChart;