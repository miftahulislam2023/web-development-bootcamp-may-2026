export type ClassValue = string | number | false | null | undefined;

/** Joins truthy class values into a single space-separated className. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
