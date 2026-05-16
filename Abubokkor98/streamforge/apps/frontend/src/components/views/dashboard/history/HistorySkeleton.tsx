import { Skeleton } from "@/components/ui/skeleton"

function HistorySkeleton() {
  return (
    <section className="space-y-4">
      <Skeleton className="h-7 w-48" aria-hidden="true" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" aria-hidden="true" />
        ))}
      </div>
    </section>
  )
}

export { HistorySkeleton }
