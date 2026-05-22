"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function TransactionItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl">
      <div className="flex items-center gap-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <div className="flex gap-2">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right space-y-2">
          <Skeleton className="w-20 h-5 ml-auto" />
          <Skeleton className="w-12 h-3 ml-auto" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TransactionStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}
