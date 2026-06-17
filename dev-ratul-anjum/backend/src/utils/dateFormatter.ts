import {
  formatDistanceToNow,
  format,
  differenceInHours,
  differenceInDays,
} from "date-fns";

/**
 * Returns a relative time string like "2 weeks ago"
 * @param {Date} date - The date to compare with now
 */
export const getRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Returns a formatted absolute date like "2 Oct 2025"
 * @param {Date} date - The date to format
 */
export const getFormattedDate = (date: Date) => {
  return format(date, "d MMM yyyy");
};

/**
 * Formats datetime based on recency:
 * - < 24 hours  → time (07:25)
 * - < 7 days    → weekday (Saturday)
 * - otherwise   → date (31/01/2026)
 */
export const formatContextualDateTime = (date: Date) => {
  const now = new Date();

  const hoursDiff = differenceInHours(now, date);
  const daysDiff = differenceInDays(now, date);

  if (hoursDiff < 24) {
    return format(date, "HH:mm");
  }

  if (daysDiff < 7) {
    return format(date, "EEEE");
  }

  return format(date, "dd/MM/yyyy");
};

export const formatBDT = (amount: number) => {
  return amount.toLocaleString("en-BD");
};
