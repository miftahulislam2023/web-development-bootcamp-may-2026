'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

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
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function SmartInsights({ totals, categoryData, dailyData }) {
  // Generate insights based on data
  const insights = [];

  const income = totals.income || 0;
  const expense = totals.expense || 0;

  // Insight 1: Savings Rate / Overall Health
  if (income > 0) {
    const savingsRate = ((income - expense) / income) * 100;
    if (savingsRate >= 20) {
      insights.push({
        id: 'savings-good',
        icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
        title: "Excellent Financial Health",
        description: `You are saving ${savingsRate.toFixed(1)}% of your income this month. Keep up the great work!`,
        color: 'bg-emerald-500/10 border-emerald-500/20',
      });
    } else if (savingsRate >= 0) {
      insights.push({
        id: 'savings-ok',
        icon: <Target className="w-5 h-5 text-blue-500" />,
        title: "On Track",
        description: `You are saving ${savingsRate.toFixed(1)}% of your income. Consider finding small ways to reduce expenses to hit that 20% mark.`,
        color: 'bg-blue-500/10 border-blue-500/20',
      });
    } else {
      insights.push({
        id: 'savings-bad',
        icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
        title: "Overspending Alert",
        description: `Your expenses exceed your income by ৳${(expense - income).toFixed(2)}. Time to review your budget!`,
        color: 'bg-rose-500/10 border-rose-500/20',
      });
    }
  }

  // Insight 2: Top Expense Category
  if (categoryData && categoryData.length > 0) {
    const topCategory = categoryData.reduce((prev, current) => (prev.value > current.value ? prev : current), categoryData[0]);
    if (topCategory.value > 0) {
      const percentage = income > 0 ? ((topCategory.value / income) * 100).toFixed(1) : ((topCategory.value / expense) * 100).toFixed(1);
      insights.push({
        id: 'top-category',
        icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
        title: `Watch out for ${topCategory.name}`,
        description: `You've spent ৳${topCategory.value.toFixed(2)} on ${topCategory.name}, which is ${percentage}% of your ${income > 0 ? 'income' : 'total expenses'}.`,
        color: 'bg-amber-500/10 border-amber-500/20',
      });
    }
  }

  // Insight 3: Daily Average
  if (expense > 0) {
    const today = new Date().getDate();
    const dailyAverage = expense / today;
    insights.push({
      id: 'daily-avg',
      icon: <BrainCircuit className="w-5 h-5 text-indigo-500" />,
      title: "Daily Spending Rate",
      description: `You are spending an average of ৳${dailyAverage.toFixed(2)} per day. Pace yourself to stay within budget.`,
      color: 'bg-indigo-500/10 border-indigo-500/20',
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'no-data',
      icon: <Lightbulb className="w-5 h-5 text-muted-foreground" />,
      title: "Not enough data",
      description: "Add more transactions to see AI-powered insights about your spending habits.",
      color: 'bg-muted/50 border-border',
    });
  }

  return (
    <Card className="shadow-sm border-muted overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <BrainCircuit className="w-32 h-32" />
      </div>
      <CardHeader className="pb-3 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Smart Insights
              <span className="text-[10px] uppercase tracking-wider font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">AI Advisor</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Automated financial analysis</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="divide-y"
        >
          {insights.map((insight) => (
            <motion.div 
              key={insight.id} 
              variants={itemVariants}
              className={`p-4 flex gap-4 transition-colors hover:bg-muted/30`}
            >
              <div className={`mt-0.5 shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${insight.color}`}>
                {insight.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
