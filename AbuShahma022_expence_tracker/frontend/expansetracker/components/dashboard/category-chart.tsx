"use client"

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface CategoryData {
  category: string
  totalAmount: number
}

interface CategoryChartProps {
  data: CategoryData[]
}

export default function CategoryChart({
  data,
}: CategoryChartProps) {

  return (
    <div className="bg-card rounded-3xl border p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Category Summary
        </h2>

        <p className="text-sm text-muted-foreground">
          Expense distribution by category.
        </p>
      </div>

      <div className="w-full overflow-hidden">

        <ResponsiveContainer
          width="99%"
           aspect={2}>

          <PieChart>

            <Pie
              data={data}
              dataKey="totalAmount"
              nameKey="category"
              outerRadius={120}
              label
            />

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}