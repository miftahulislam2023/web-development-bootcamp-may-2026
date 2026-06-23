import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";
export type { ILogin } from "./auth.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number,
    page: number,
    totalPages: number,
    limit: number
  }
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
    icon: LucideIcon;
  }[];
}

export type TRole = "admin" | "user";

type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "user" | "admin";
  auths: {
    provider: string;
    providerId: string;
  }[];
  status: "active" | "inactive" | "blocked";
  currency: string;
  timezone: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface IAuth {
  provider: string;
  providerId: string;
}

export interface ICategory {
  _id: string;
  // FK to users collection. null means a system-level category visible to all.
  userId: string | null;

  name: string;

  // Determines which side of the ledger this category belongs to.
  type: CategoryType;

  // Optional UI enrichment — resolved by the frontend icon registry.
  icon?: string;
  colorHex?: string;

  // System categories are seeded at startup and cannot be deleted by users.
  isSystem: boolean;

  // Soft-disable without deleting — preserves historical transaction links.
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
export const CATEGORY_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type CategoryType = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

// ─── Enums (mirror backend constants) ────────────────────────────────────────

export const TRANSACTION_TYPE = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;
export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export const PAYMENT_METHOD = {
  CASH: "cash",
  CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  MOBILE_BANKING: "mobile_banking",
  OTHER: "other",
} as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const RECURRENCE_FREQUENCY = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;
export type TRecurrenceFrequency =
  (typeof RECURRENCE_FREQUENCY)[keyof typeof RECURRENCE_FREQUENCY];

// ─── Transaction ─────────────────────────────────────────────────────────────

export interface ITransaction {
  _id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string | null;
  paymentMethod: PaymentMethod;
  tags: string[];
  date: string; // ISO string
  recurrenceId?: string | null;
  isRecurring: boolean;
  referenceNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Recurrence ──────────────────────────────────────────────────────────────

export interface IRecurrence {
  _id: string;
  userId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string | null;
  paymentMethod: PaymentMethod;
  frequency: TRecurrenceFrequency;
  interval: number;
  nextDueDate: string;
  endDate?: string | null;
  isActive: boolean;
}

// ─── Category (minimal — for select dropdown) ─────────────────────────────────

export interface CategoryOption {
  _id: string;
  name: string;
  type: TransactionType;
}

// ─── Filter / Query params ────────────────────────────────────────────────────

export interface TransactionFiltersState {
  search: string;
  type: TransactionType | "";
  paymentMethod: PaymentMethod | "";
  categoryId: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};