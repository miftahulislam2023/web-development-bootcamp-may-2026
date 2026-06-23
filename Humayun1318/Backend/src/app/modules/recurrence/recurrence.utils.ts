// ─────────────────────────────────────────────────────────────────────────────
// Helper — compute next due date
//
// Pure function (no side effects) so it can be tested without a DB connection.
// Given a current date + frequency + interval, returns the next fire date.
//
// WHY not use a date library here?
//   node-cron itself doesn't need dates; only the recurrence advance logic does.
//   Using native Date keeps the dependency count low.
//   For production, consider replacing with date-fns addMonths / addWeeks etc.
//   to handle edge cases like Feb 30 overflow.

import { RECURRENCE_FREQUENCY } from './recurrence.constants';

// ─────────────────────────────────────────────────────────────────────────────
export const computeNextDueDate = (from: Date, frequency: string, interval: number): Date => {
  const next = new Date(from);

  switch (frequency) {
    case RECURRENCE_FREQUENCY.DAILY:
      next.setDate(next.getDate() + interval);
      break;
    case RECURRENCE_FREQUENCY.WEEKLY:
      next.setDate(next.getDate() + 7 * interval);
      break;
    case RECURRENCE_FREQUENCY.MONTHLY:
      next.setMonth(next.getMonth() + interval);
      break;
    case RECURRENCE_FREQUENCY.YEARLY:
      next.setFullYear(next.getFullYear() + interval);
      break;
  }

  return next;
};
