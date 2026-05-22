'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const PIE_COLORS = [
  '#6f37f0', // primary
  '#805af8', // secondary primary
  '#9e89fc', // Bright lavender
  '#bfb4fe', // Lavender active
  '#dad5ff', // Soft border lavender
  '#501fb8', // primary in dark mode
  '#431b97', // Very deep purple
  '#2e1176', // dark cards
];

const INCOME_COLOR = '#9e89fc';
const EXPENSE_COLOR = '#ff656c';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl p-4 text-sm animate-in fade-in zoom-in-95 duration-200">
        {label && <p className="font-semibold mb-3 text-foreground">{label}</p>}
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-sm" 
                  style={{ backgroundColor: entry.color || entry.payload.fill }} 
                />
                <span className="text-muted-foreground font-medium capitalize">{entry.name}</span>
              </div>
              <span className="font-bold text-foreground">
                ৳{Number(entry.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function IncomeExpenseChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-87.5 w-full animate-pulse bg-muted/30 rounded-xl mt-4"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-87.5 mt-4 items-center justify-center text-muted-foreground border border-dashed rounded-xl">
        No data available for the last 30 days.
      </div>
    );
  }

  return (
    <div className="h-87.5 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INCOME_COLOR} stopOpacity={1}/>
              <stop offset="100%" stopColor={INCOME_COLOR} stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EXPENSE_COLOR} stopOpacity={1}/>
              <stop offset="100%" stopColor={EXPENSE_COLOR} stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" strokeOpacity={0.15} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            dy={10}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            dx={-10}
            tickFormatter={(value) => `৳${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'var(--muted)', opacity: 0.4 }} 
          />
          <Bar dataKey="income" name="Income" fill="url(#incomeGradient)" radius={[6, 6, 0, 0]} maxBarSize={45} />
          <Bar dataKey="expense" name="Expense" fill="url(#expenseGradient)" radius={[6, 6, 0, 0]} maxBarSize={45} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ data }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-87.5 w-full animate-pulse bg-muted/30 rounded-xl mt-4"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-87.5 mt-4 items-center justify-center text-muted-foreground border border-dashed rounded-xl">
        No expense data for this month.
      </div>
    );
  }

  return (
    <div className="h-87.5 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={85}
            outerRadius={120}
            paddingAngle={6}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={PIE_COLORS[index % PIE_COLORS.length]} 
                className="hover:opacity-80 transition-opacity duration-300 outline-none cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-sm font-medium text-foreground ml-2">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
