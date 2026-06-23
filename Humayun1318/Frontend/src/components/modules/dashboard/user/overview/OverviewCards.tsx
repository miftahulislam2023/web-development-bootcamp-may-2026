// components/modules/dashboard/overview/OverviewCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { useGetTransactionSummaryQuery } from "@/redux/features/transactions/transactions.api";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useUser } from "@/hooks/useUser";

const OverviewCards = () => {
  const { data, isLoading, error } = useGetTransactionSummaryQuery({});
  const { user: userData } = useUser();
  
  const userCurrency = userData?.currency || "USD";
  const totalIncome = (data as any)?.income ?? 0;
  const totalExpense = (data as any)?.expense ?? 0;
  const netBalance = (data as any)?.balance ?? 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: userCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const cards = [
    {
      title: "Net Balance",
      value: netBalance,
      icon: Wallet,
      iconColor: "text-primary",
      borderColor: "border-l-primary",
      bgGradient: "from-primary/5 to-transparent",
      valueColor: "text-foreground",
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      iconColor: "text-emerald-500",
      borderColor: "border-l-emerald-500",
      bgGradient: "from-emerald-500/5 to-transparent",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Expense",
      value: totalExpense,
      icon: TrendingDown,
      iconColor: "text-rose-500",
      borderColor: "border-l-rose-500",
      bgGradient: "from-rose-500/5 to-transparent",
      valueColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {isLoading ? (
        // Loading skeletons
        [1, 2, 3].map((_, index) => (
          <Card key={index} className="relative overflow-hidden border border-border bg-card">
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <div className="w-5 h-5 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))
      ) : error ? (
        // Error state
        <Card className="col-span-3 relative overflow-hidden border border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="relative p-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              Failed to load transaction summary. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        // Cards with data
        cards.map((card, index) => (
          <Card
            key={index}
            className={`
              relative overflow-hidden
              border border-border 
              bg-card
              ${card.borderColor} border-l-4
              hover:shadow-lg transition-all duration-200
              hover:scale-[1.02] cursor-default
            `}
          >
            <div
              className={`
                absolute inset-0 bg-gradient-to-br ${card.bgGradient}
                pointer-events-none
              `}
            />

            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold ${card.valueColor}`}>
                    {formatCurrency(card.value)}
                  </p>
                </div>

                <div className={`p-2.5 rounded-lg bg-muted/50 ${card.iconColor}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>

              <div className="h-px bg-border my-3" />
              <p className="text-xs text-muted-foreground">
                Current period overview
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OverviewCards;