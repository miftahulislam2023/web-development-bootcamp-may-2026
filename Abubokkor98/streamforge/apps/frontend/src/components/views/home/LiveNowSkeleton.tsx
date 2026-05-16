function LiveNowSkeleton() {
  return (
    <section className="px-6 py-16 md:px-8" aria-label="Loading live streams">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 h-7 w-40 animate-pulse rounded-md bg-muted" />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <li
              key={index}
              className="overflow-hidden rounded-xl border border-border/40 bg-card/30"
            >
              <div className="aspect-video animate-pulse bg-muted" />
              <div className="space-y-2 p-3.5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { LiveNowSkeleton }
