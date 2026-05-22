export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-text w-16" />
          <div className="skeleton-text w-24 h-6" />
          <div className="skeleton-text w-32" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="skeleton-text w-32 h-5" />
        <div className="skeleton-text w-16 h-4" />
      </div>
      <div className="space-y-3">
        <div className="skeleton h-40 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="skeleton-text w-12 h-4" />
      <div className="flex-1">
        <div className="skeleton-text w-24 mb-2" />
        <div className="skeleton-text w-16" />
      </div>
      <div className="skeleton-text w-16 h-5" />
    </div>
  );
}

export function SkeletonBox({ className = "h-20" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}
