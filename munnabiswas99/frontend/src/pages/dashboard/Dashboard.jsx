import React from "react";
import Cards from "../../components/dashboard/Cards";
import Barchart from "../../components/dashboard/Barchart";
import OverviewPieChart from "../../components/dashboard/OverviewPieChart";
import ExpenseLineChart from "../../components/dashboard/ExpenseLineChart";
import IncomeLineChart from "../../components/dashboard/IncomeLineChart";
import useDashboardData from "../../hooks/useDashboardData";

const Dashboard = () => {
  const { dashboardData, isLoading } = useDashboardData();
  console.log(dashboardData);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <Cards summary={dashboardData.summary}></Cards>
      <Barchart />
      <div className="md:flex gap-2 my-5 ">
        <IncomeLineChart recentIncome={dashboardData.recentIncome}></IncomeLineChart>
        <ExpenseLineChart recentExpense={dashboardData.recentExpense}></ExpenseLineChart>
      </div>
      <OverviewPieChart summary={dashboardData.summary}></OverviewPieChart>
    </div>
  );
};

export default Dashboard;
