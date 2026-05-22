"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getTransactionHistoryData } from "@/utils/transactions";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-3)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function TransactionHistoryChart({
  userId,
  initialMonthlyData,
}: {
  userId: string;
  initialMonthlyData: { day: number; income: number; expense: number }[];
  initialYearlyData: { month: string; income: number; expense: number }[];
}) {
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = React.useState(initialMonthlyData);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async (m: number, y: number) => {
    setLoading(true);
    const data = await getTransactionHistoryData(userId, m, y);
    setMonthlyData(data);
    setLoading(false);
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    fetchData(newMonth, year);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    fetchData(month, newYear);
  };

  const filteredData = React.useMemo(() => {
    const now = new Date(year, month - 1);
    const startDate = new Date(now);

    return monthlyData
      .filter((item) => {
        const itemDate = new Date(year, month - 1, item.day);
        return itemDate >= startDate;
      })
      .map((item) => ({
        ...item,
        date: `${year}-${String(month).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`,
      }));
  }, [monthlyData, month, year]);

  return (
    <Card className="mt-10">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-2xl font-bold">
            Transaction History
          </CardTitle>
          <CardDescription>
            Showing income and expense for the selected period
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={year.toString()}
            onValueChange={(value) => handleYearChange(Number(value))}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={month.toString()}
            onValueChange={(value) => handleMonthChange(Number(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center">
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No information to show
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-expense)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-expense)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value.toString()}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value,payload) => {
                      if (payload && payload.length > 0) {
                        const day = payload[0].payload.day;
                        return `${months[month - 1].label} ${day}, ${year}`;
                      }
                      return `${months[month - 1].label}, ${year}`;
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="income"
                type="natural"
                fill="url(#fillIncome)"
                stroke="var(--color-income)"
                stackId="a"
              />
              <Area
                dataKey="expense"
                type="natural"
                fill="url(#fillExpense)"
                stroke="var(--color-expense)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
