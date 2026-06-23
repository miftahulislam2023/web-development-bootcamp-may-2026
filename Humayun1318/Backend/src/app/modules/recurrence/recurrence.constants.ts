export const RECURRENCE_SEARCHABLE_FIELDS = ['description', 'type', 'frequency', 'paymentMethod'];

export const RECURRENCE_SORT_FIELDS = [
  'nextDueDate',
  'amount',
  'createdAt',
  '-nextDueDate',
  '-amount',
  '-createdAt',
] as const;
// ---------------------------------------------------------------------------
// Frequency — how often a recurrence fires.
// Stored as a string slug in MongoDB for human-readable Atlas queries.
// ---------------------------------------------------------------------------
export const RECURRENCE_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type TRecurrenceFrequency = (typeof RECURRENCE_FREQUENCY)[keyof typeof RECURRENCE_FREQUENCY];

// ---------------------------------------------------------------------------
// Cron expression map — the scheduler reads these to know when to fire.
//
// WHY a map instead of storing raw cron strings in MongoDB?
//   • Validated set: only known frequencies are ever run.
//   • Single change point: if "monthly" cron changes, only this file updates.
//   • The DB stores "monthly"; the scheduler resolves it here at runtime.
// ---------------------------------------------------------------------------
export const FREQUENCY_CRON_MAP: Record<TRecurrenceFrequency, string> = {
  daily: '0 0 * * *', // midnight every day
  weekly: '0 0 * * 1', // midnight every Monday
  monthly: '0 0 1 * *', // midnight on the 1st of every month
  yearly: '0 0 1 1 *', // midnight on 1st January every year
};

// ---------------------------------------------------------------------------
// The master cron schedule — runs once a day at 00:05 and processes ALL
// due recurrences in one pass.
//
// WHY one master job instead of per-frequency crons?
//   • Simpler to reason about: one log entry, one place to debug.
//   • next_due_date field handles exact timing — the cron just triggers the
//     sweep; the DB filter does the precision work.
//   • Avoids race conditions between multiple concurrent cron jobs.
// ---------------------------------------------------------------------------
export const RECURRENCE_MASTER_CRON = '5 0 * * *'; // 00:05 every day

// ---------------------------------------------------------------------------
// Query defaults
// ---------------------------------------------------------------------------
export const RECURRENCE_QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ---------------------------------------------------------------------------
// Validation constraints
// ---------------------------------------------------------------------------
export const RECURRENCE_VALIDATION = {
  AMOUNT_MIN: 0.01,
  DESCRIPTION_MAX_LENGTH: 500,
  INTERVAL_MIN: 1,
  INTERVAL_MAX: 365, // "every 365 days" is the practical ceiling
} as const;
