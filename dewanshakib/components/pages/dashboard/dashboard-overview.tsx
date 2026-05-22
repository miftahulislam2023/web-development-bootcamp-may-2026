import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getTransactionHistoryData,
  getTransactionTotalsByUser,
  getYearlyTransactionHistoryData,
} from "@/utils/transactions";
import { IDashboardOverviewProps } from "@/interfaces/interfaces";
import DashboardRadarChart from "./dashboard-radar-chart";
import TransactionHistoryChart from "./ui/transaction-history-chart";
import DashboardStatsNumberTicker from "./ui/dashboard-stats-number-ticker";
import SelectMonth from "./ui/select-month";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardOverview({
  searchParams,
}: IDashboardOverviewProps) {
  const params = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const month = params?.month
    ? parseInt(params.month)
    : new Date().getMonth() + 1;

  const totals = session?.user
    ? await getTransactionTotalsByUser(session.user.id, month)
    : { income: 0, expense: 0 };

  const balance = totals.income - totals.expense;
  const transactionHistoryData = await getTransactionHistoryData(
    session?.user?.id as string,
  );

  const yearlyTransactionData = await getYearlyTransactionHistoryData(
    session?.user?.id as string,
  );

  return (
    <div className="py-10">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-bold text-2xl md:text-3xl">Overview</h1>
        <SelectMonth />
      </div>
      <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Income</CardDescription>
            <CardTitle>
              <DashboardStatsNumberTicker value={totals.income} />
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp color="green" />
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Expense</CardDescription>
            <CardTitle>
              <DashboardStatsNumberTicker value={totals.expense} />
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingDown color="red" />
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Balance</CardDescription>
            <CardTitle>
              <DashboardStatsNumberTicker value={balance} />
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Wallet />
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      <DashboardRadarChart userId={session?.user?.id as string} />
      <TransactionHistoryChart
        userId={session?.user?.id as string}
        initialMonthlyData={transactionHistoryData}
        initialYearlyData={yearlyTransactionData}
      />
    </div>
  );
}
