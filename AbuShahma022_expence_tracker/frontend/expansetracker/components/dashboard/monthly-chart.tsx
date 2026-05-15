"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface MonthlyData {
  month: string
  totalAmount: number
}

interface MonthlyChartProps {
  data: MonthlyData[]
}

export default function MonthlyChart({
  data,
}: MonthlyChartProps) {

  return (
    <div className="bg-card rounded-3xl border p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Monthly Expenses
        </h2>

        <p className="text-sm text-muted-foreground">
          Overview of monthly spending.
        </p>
      </div>

      <div className="w-full overflow-hidden">

        <ResponsiveContainer
          width="99%"
           aspect={2}>

          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="totalAmount"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}