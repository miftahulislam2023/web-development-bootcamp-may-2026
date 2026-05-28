'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IncomeExpenseChart, CategoryPieChart } from '@/components/DashboardCharts';
import { SmartInsights } from '@/components/SmartInsights';
import { ArrowDownIcon, ArrowUpIcon, Wallet } from 'lucide-react';
import { format } from 'date-fns';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function DashboardClient({ totals, categoryData, dailyData, recentTransactions }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-muted h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">৳{totals.balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Overall balance</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-muted h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Income
              </CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-full">
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">৳{totals.income.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-muted h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Expenses
              </CardTitle>
              <div className="p-2 bg-rose-500/10 rounded-full">
                <ArrowDownIcon className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">৳{totals.expense.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Smart Insights Row */}
      <motion.div variants={itemVariants}>
        <SmartInsights 
          totals={totals} 
          categoryData={categoryData} 
          dailyData={dailyData} 
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-muted h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Income vs Expense (30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart data={dailyData} />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-muted h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Expenses by Category (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryPieChart data={categoryData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-muted hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent transactions.</p>
              ) : (
                recentTransactions.map((tx, index) => (
                  <motion.div 
                    key={tx._id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-md transition-colors -mx-2"
                  >
                    <div>
                      <p className="font-medium">{tx.category}</p>
                      <p className="text-sm text-muted-foreground" suppressHydrationWarning>{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className={`font-semibold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-foreground'}`}>
                      {tx.type === 'Income' ? '+' : '-'}৳{tx.amount.toFixed(2)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
