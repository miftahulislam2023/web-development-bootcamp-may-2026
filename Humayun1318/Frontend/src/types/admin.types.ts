// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "suspended" | "deleted";

export interface AuthProvider {
  provider: string;
  providerId: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  currency: string;
  timezone: string;
  isVerified: boolean;
  auths: AuthProvider[];
  createdAt: string;
  updatedAt: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface UsersFiltersState {
  searchTerm: string;
  role: UserRole | "";
  status: UserStatus | "";
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  deletedUsers: number;
  totalAdmins: number;
  systemStatus: "healthy" | "warning" | "error";
}

// ─── Cron ─────────────────────────────────────────────────────────────────────

export type CronStatus = "success" | "failed" | "pending" | "never_run";

export interface CronJobInfo {
  lastRunAt: string | null;
  nextScheduledAt: string | null;
  lastRunStatus: CronStatus;
  message?: string;
}