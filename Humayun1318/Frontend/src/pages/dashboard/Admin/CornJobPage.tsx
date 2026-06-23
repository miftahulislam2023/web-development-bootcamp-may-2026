import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useRunCronJobMutation } from "@/redux/features/admin/admin.api";

// ─── Result type ─────────────────────────────────────────────────────────────

interface CronResult {
  processed: number;
  created: number;
  failed: number;
  message?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CronJobPage() {
  const [runCronJob, { isLoading }] = useRunCronJobMutation();
  const [lastResult, setLastResult] = useState<CronResult | null>(null);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  const handleRun = async () => {
    const toastId = toast.loading("Processing recurring transactions…");
    try {
      const res = await runCronJob(undefined).unwrap();

      if (res.success) {
        const result: CronResult = res.data;
        setLastResult(result);
        setLastRunAt(new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }));
        toast.success(
          result.message ?? `Done — ${result.created} transaction(s) created.`,
          { id: toastId }
        );
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Cron job failed.", { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Cron Job</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manually process pending recurring transactions.
        </p>
      </div>

      {/* Explanation card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div>
          <h3 className="text-sm font-semibold">How it works</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            The system automatically scans the{" "}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              Recurring
            </span>{" "}
            collection daily and creates transactions for each active recurrence
            whose <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">nextDueDate</span> is
            due. Use this button to manually trigger that process if the
            scheduled job was missed or delayed.
          </p>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <TriangleAlert className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Running this multiple times on the same day is safe — already
            processed recurrences will be skipped automatically.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Run button */}
        <div className="flex items-center justify-between">
          <div>
            {lastRunAt ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                Last triggered: {lastRunAt}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Not triggered in this session.
              </p>
            )}
          </div>

          <Button size="lg" disabled={isLoading} onClick={handleRun} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Cron Manually
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Result card — shown after run */}
      {lastResult && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">Last Run Result</h3>

          <div className="grid grid-cols-3 gap-4">
            <ResultStat
              label="Processed"
              value={lastResult.processed}
              color="text-foreground"
            />
            <ResultStat
              label="Created"
              value={lastResult.created}
              color="text-emerald-600"
            />
            <ResultStat
              label="Failed"
              value={lastResult.failed}
              color={lastResult.failed > 0 ? "text-rose-600" : "text-muted-foreground"}
            />
          </div>

          {lastResult.message && (
            <p className="text-xs text-muted-foreground border-t border-border pt-3">
              {lastResult.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ResultStat ───────────────────────────────────────────────────────────────

function ResultStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}