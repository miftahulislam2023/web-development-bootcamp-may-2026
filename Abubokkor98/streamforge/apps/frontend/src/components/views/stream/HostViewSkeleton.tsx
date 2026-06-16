import { Skeleton } from "@/components/ui/skeleton"

function HostViewSkeleton() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Skeleton className="size-9 rounded-md" aria-hidden="true" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" aria-hidden="true" />
          <Skeleton className="h-3 w-20" aria-hidden="true" />
        </div>
      </header>
      <section className="flex flex-1 items-center justify-center bg-black/95">
        <Skeleton
          className="aspect-video w-full max-w-4xl rounded-lg"
          aria-hidden="true"
        />
      </section>
      <footer className="flex justify-center border-t border-border py-4">
        <Skeleton className="h-12 w-40 rounded-full" aria-hidden="true" />
      </footer>
    </main>
  )
}

export { HostViewSkeleton }
