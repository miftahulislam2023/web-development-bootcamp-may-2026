import cron from 'node-cron';
import { RECURRENCE_MASTER_CRON } from '../modules/recurrence/recurrence.constants';
import { recurrenceService } from '../modules/recurrence/recurrence.service';

// ─────────────────────────────────────────────────────────────────────────────
// registerRecurrenceCron
//
// Call this function ONCE inside your app.ts / server.ts AFTER the MongoDB
// connection is established.
//
// WHY after DB connect?
//   The cron fires at midnight.  If the server has not connected to MongoDB yet
//   the service call would throw.  Registering after the connection guarantees
//   the DB is always ready when the job runs.
// ─────────────────────────────────────────────────────────────────────────────
export const registerRecurrenceCron = (): void => {
  // ---------------------------------------------------------------------------
  // validate: true — node-cron validates the expression at registration time
  // and throws immediately if it is malformed, rather than failing silently at
  // runtime.
  //
  // scheduled: true — the job starts running immediately after registration.
  //
  // timezone — always set explicitly so the job fires at the correct local
  // midnight regardless of the server's OS timezone.
  // Change 'Asia/Dhaka' to your deployment timezone.
  // ---------------------------------------------------------------------------
  const task = cron.schedule(
    RECURRENCE_MASTER_CRON,
    async () => {
      console.log(`[RecurrenceCron] Starting job at ${new Date().toISOString()}`);

      try {
        const result = await recurrenceService.createTransactionsForDueRecurrences();

        console.log(
          `[RecurrenceCron] Done — processed: ${result.processed}, ` +
            `created: ${result.created}, failed: ${result.failed}`,
        );

        // Log individual failures without crashing — the next run will retry
        // anything that failed because advanceNextDueDate was not called.
        if (result.errors.length > 0) {
          console.error('[RecurrenceCron] Errors:', JSON.stringify(result.errors, null, 2));
        }
      } catch (err) {
        // A top-level catch ensures an unhandled exception in the service
        // never kills the cron process itself.
        console.error('[RecurrenceCron] Fatal error:', err);
      }
    },
    {
      timezone: 'Asia/Dhaka', // ← change to your deployment timezone
    },
  );

  // Ensure the cron job starts immediately after registration.
  task.start();

  // Log confirmation so server startup logs are clear.
  console.log(`[RecurrenceCron] Registered — schedule: "${RECURRENCE_MASTER_CRON}" (Asia/Dhaka)`);

  // Return the task object so callers can stop it if needed (e.g. in tests).
  // We store it on the module-level variable below for graceful shutdown.
  cronTask = task;
};

// ─────────────────────────────────────────────────────────────────────────────
// stopRecurrenceCron
//
// Call this in your graceful shutdown handler so the cron is cleanly stopped
// before the process exits.
//
// Example in server.ts:
//   process.on('SIGTERM', () => {
//     stopRecurrenceCron();
//     server.close(() => process.exit(0));
//   });
// ─────────────────────────────────────────────────────────────────────────────
let cronTask: ReturnType<typeof cron.schedule> | null = null;

export const stopRecurrenceCron = (): void => {
  if (cronTask) {
    cronTask.stop();
    console.log('[RecurrenceCron] Stopped.');
    cronTask = null;
  }
};
