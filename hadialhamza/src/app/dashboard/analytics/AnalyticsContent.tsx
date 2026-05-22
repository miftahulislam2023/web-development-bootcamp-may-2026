"use client";

import { useState, useEffect, useCallback } from "react";
import SpendingTrends from "@/components/dashboard/analytics/SpendingTrends";
import ExpenseDistribution from "@/components/dashboard/analytics/ExpenseDistribution";
import SmartInsights from "@/components/dashboard/analytics/SmartInsights";
import PerformanceSummary from "@/components/dashboard/analytics/PerformanceSummary";
import SelectGroup from "@/components/ui/SelectGroup";
import { Calendar } from "lucide-react";

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last Year", value: "1y" },
];

export default function AnalyticsContent() {
  const [spendingData, setSpendingData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState("6m");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // We pass the range as a query param to make it dynamic
      const [spendingRes, distRes, insightsRes] = await Promise.all([
        fetch(`/api/analytics/spending?range=${range}`),
        fetch(`/api/analytics/categories?range=${range}`),
        fetch(`/api/analytics/insights?range=${range}`)
      ]);

      if (spendingRes.ok) setSpendingData(await spendingRes.json());
      if (distRes.ok) setDistributionData(await distRes.json());
      if (insightsRes.ok) setInsights(await insightsRes.json());
    } catch (error) {
      console.error("Analytics Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    let isMounted = true;
    
    const initFetch = async () => {
      await fetchData();
    };

    if (isMounted) initFetch();
    return () => { isMounted = false; };
  }, [fetchData]);

  const currentMonth = spendingData[spendingData.length - 1];
  const prevMonth = spendingData[spendingData.length - 2];

  return (
    <>
      {/* Dynamic Filter Section */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-64">
          <SelectGroup
            value={range}
            onChange={(val) => setRange(val as string)}
            options={RANGE_OPTIONS}
            icon={<Calendar className="w-4 h-4" />}
            className="bg-card border-border h-12 shadow-sm rounded-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SpendingTrends data={spendingData} isLoading={isLoading} />
        <ExpenseDistribution data={distributionData} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SmartInsights insights={insights} isLoading={isLoading} />
        <PerformanceSummary 
          currentMonth={currentMonth} 
          prevMonth={prevMonth} 
          isLoading={isLoading} 
        />
      </div>
    </>
  );
}
