export default function DashboardLoading() {
  return (
    <div className="flex min-h-[40vh] flex-col gap-4 p-6">
      <div className="h-8 w-48 animate-pulse rounded-md bg-[var(--muted)]" />
      <div className="h-32 w-full max-w-3xl animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="h-32 w-full max-w-3xl animate-pulse rounded-lg bg-[var(--muted)]" />
    </div>
  );
}
