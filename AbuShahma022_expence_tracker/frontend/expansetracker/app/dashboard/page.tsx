"use client"

import { useEffect, useState } from "react"

import {
  ArrowDown,
  Receipt,
  Wallet,
} from "lucide-react"

import StatsCard from "@/components/dashboard/stats-card"

import BudgetProgressCard
from "@/components/dashboard/budget-progress-card"

import MonthlyChart
from "@/components/dashboard/monthly-chart"

import CategoryChart
from "@/components/dashboard/category-chart"

import {
  getBudgetStatusApi,
  getExpenseSummaryApi,
  getCategorySummaryApi,
  getMonthlySummaryApi,
} from "@/services/dashboard.api"

import {
  useAppSelector,
} from "@/lib/hook"

interface SummaryData {
  totalExpense: number
  totalTransactions: number
  latestExpense: {
    title: string
    amount: number
  }
}

interface BudgetData {
  budgetAmount: number
  totalExpense: number
  remainingAmount: number
  percentageUsed: string
}

export default function DashboardPage() {

  // Redux User
  const user =
    useAppSelector(
      (state) => state.auth.user
    )

  const [summary, setSummary] =
    useState<SummaryData | null>(null)

  const [budget, setBudget] =
    useState<BudgetData | null>(null)

  const [monthlyData,
    setMonthlyData] =
    useState([])

  const [categoryData,
    setCategoryData] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  // Dashboard Data
  const getDashboardData =
    async () => {

      try {

        const summaryResponse =
          await getExpenseSummaryApi()

        const budgetResponse =
          await getBudgetStatusApi()

        setSummary(
          summaryResponse.data
        )

        setBudget(
          budgetResponse.data
        )

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }

  // Charts Data
  const getChartsData =
    async () => {

      try {

        const monthlyResponse =
          await getMonthlySummaryApi()

        const categoryResponse =
          await getCategorySummaryApi()

        setMonthlyData(
          monthlyResponse.data
        )

        setCategoryData(
          categoryResponse.data
        )

      } catch (error) {

        console.log(error)
      }
    }

  useEffect(() => {

    getDashboardData()

    getChartsData()

  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">

        <p className="text-sm text-muted-foreground">

          Loading dashboard...

        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Heading */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold tracking-tight dark:text-black">

            Dashboard

          </h1>

          <p className="mt-2 text-muted-foreground">

            Track your expenses and monitor your financial activity.

          </p>
        </div>

        {/* User Card */}
        <div className="w-full sm:w-auto">

          <div className="bg-card flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm">

            <img
              src={
                user?.image ||
                "/default-avatar.png"
              }
              alt="user"
              className="size-11 rounded-full border object-cover"
            />

            <div>

              <p className="text-sm text-muted-foreground">

                Welcome back

              </p>

              <h3 className="font-semibold">

                {user?.name}

              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <StatsCard
          title="Total Expense"
          amount={`$${summary?.totalExpense || 0}`}
          description="Total spent amount"
          icon={
            <Wallet className="size-6 text-blue-500" />
          }
        />

        <StatsCard
          title="Transactions"
          amount={`${
            summary?.totalTransactions || 0
          }`}
          description="Total transactions"
          icon={
            <Receipt className="size-6 text-green-500" />
          }
        />

        <StatsCard
          title="Latest Expense"
          amount={`${
            summary?.latestExpense?.amount || 0
          }`}
          description={
            summary?.latestExpense?.title ||
            "No expense"
          }
          icon={
            <ArrowDown className="size-6 text-red-500" />
          }
        />
      </div>

      {/* Budget */}
      {budget && (
        <BudgetProgressCard
          budgetAmount={
            budget.budgetAmount
          }
          totalExpense={
            budget.totalExpense
          }
          remainingAmount={
            budget.remainingAmount
          }
          percentageUsed={
            budget.percentageUsed
          }
        />
      )}

      {/* Charts */}
      <div className="grid min-w-0 gap-5 2xl:grid-cols-2">

        <MonthlyChart
          data={monthlyData}
        />

        <CategoryChart
          data={categoryData}
        />
      </div>
    </div>
  )
}