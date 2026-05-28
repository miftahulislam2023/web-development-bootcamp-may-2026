import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Summary Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm border-muted h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded mt-2"></div>
              <div className="h-3 w-20 bg-muted rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="shadow-sm border-muted h-full">
            <CardHeader>
              <div className="h-5 w-48 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-75 w-full bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions Skeleton */}
      <Card className="shadow-sm border-muted">
        <CardHeader>
          <div className="h-5 w-40 bg-muted rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
                <div className="h-5 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
