import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Barchart = () => {

   const axiosSecure = useAxiosSecure();
   
   const {data: incomeExpenseData = []} = useQuery({
    queryKey: ["income-expense"],
    queryFn: async () => {
      const res = await axiosSecure.get("/income-expense");
      return res.data;
    }
   })

   console.log(incomeExpenseData);
  return (
    <div className="w-full h-88 md:h-120 bg-gray-200 rounded-3xl p-4 md:p-6 shadow-lg mt-5 border-2 border-gray-300">
      
      <h1 className="text-lg md:text-2xl font-semibold mb-4">
        Income & Expense Overview
      </h1>

      <ResponsiveContainer width="100%" height="90%">
        
        <BarChart
          data={incomeExpenseData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#d1d5db"
          />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
          />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="income"
            fill="#8b5cf6"
            radius={[10, 10, 0, 0]}
          />

          <Bar
            dataKey="expense"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>

      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;