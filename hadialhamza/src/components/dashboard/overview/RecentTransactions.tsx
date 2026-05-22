"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { formatCurrency } from "@/lib/currency";
import { Transaction } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/transactions?limit=4");
        if (res.ok && isMounted) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch {
        console.error("Failed to fetch recent transactions");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRecent();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">
            Recent Transactions
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Your latest financial activities
          </p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-2 group"
        >
          View All
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-16 h-4 ml-auto" />
                  <Skeleton className="w-10 h-3 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {transactions.map((t) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={t._id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-all group border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-muted/50 border border-border group-hover:scale-110 transition-transform",
                      t.categoryId?.color,
                    )}
                  >
                    <CategoryIcon
                      name={t.categoryId?.icon || "Tag"}
                      className="w-4 h-4"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      {new Date(t.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-black tabular-nums",
                      t.type === "income"
                        ? "text-emerald-500"
                        : "text-foreground",
                    )}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </p>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter opacity-60">
                    {t.categoryId?.name || "General"}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 border-2 border-dashed border-border rounded-2xl">
            <p className="text-sm font-bold text-muted-foreground">
              No transactions yet
            </p>
            <p className="text-xs text-muted-foreground/60">
              Start by adding your first record
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
