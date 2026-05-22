"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

type Transaction = {
  category_name: string;
  type: string;
  amount?: number;
};

export function CategoryRadarChart({
  type,
  transactions,
}: {
  type: string;
  transactions: Transaction[];
}) {
  const categoryTransactions = transactions.filter((t) => t.type === type);

  const aggregatedData = categoryTransactions.reduce(
    (acc, t) => {
      const existing = acc.find(
        (item) => item.category_name === t.category_name,
      );
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({
          category_name: t.category_name,
          value: 1,
        });
      }
      return acc;
    },
    [] as Array<{
      category_name: string;
      value: number;
    }>,
  );

  const chartConfig = {
    value: {
      label: "Count",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold opacity-90 flex items-center justify-between">
          <h2> {type === "income" ? "Incomes" : "Expenses"} by category</h2>
          <p>
            {type === "income" ? <BanknoteArrowDown /> : <BanknoteArrowUp />}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {aggregatedData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No information to show
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <RadarChart data={aggregatedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category_name" />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Radar dataKey="value" fill="var(--chart-3)" fillOpacity={0.6} />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
