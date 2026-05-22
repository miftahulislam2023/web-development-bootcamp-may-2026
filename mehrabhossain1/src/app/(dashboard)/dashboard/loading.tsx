/** Skeleton shown while the dashboard's project list is being fetched. */
export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">
            Your projects
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Create a site and start building.
          </p>
        </div>
        <div className="h-10 w-72 animate-pulse rounded-btn bg-black/5" />
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li
            key={i}
            className="overflow-hidden rounded-card border border-border bg-white shadow-card"
          >
            <div className="h-24 animate-pulse bg-black/5" />
            <div className="p-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-black/10" />
              <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-black/5" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
