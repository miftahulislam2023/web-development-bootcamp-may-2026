import { Skeleton } from "@/components/ui/skeleton"

function SummarySkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-5 w-32" aria-hidden="true" />
      <Skeleton className="h-8 w-72" aria-hidden="true" />
      <Skeleton className="h-4 w-48" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" aria-hidden="true" />
        ))}
      </div>
    </section>
  )
}

export { SummarySkeleton }
