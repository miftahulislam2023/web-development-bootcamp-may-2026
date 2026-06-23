import type { Document, Model, Types } from 'mongoose';
import type { TransactionType } from '../transaction/transaction.constants';
import type { PaymentMethod } from '../transaction/transaction.constants';
import type { TRecurrenceFrequency } from './recurrence.constants';

// ---------------------------------------------------------------------------
// Core domain shape
// ---------------------------------------------------------------------------
export interface IRecurrence {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  paymentMethod?: PaymentMethod;

  frequency: TRecurrenceFrequency;

  // "Every N <frequency> units" — e.g. interval=2, frequency=weekly → every 2 week.
  // Default 1 covers the common case (every week, every month, etc.).
  interval: number;

  // THE KEY FIELD — the cron job queries { next_due_date: { $lte: today }, is_active: true }.
  // After each transaction is generated, this date is advanced by interval × frequency.
  nextDueDate: Date;

  // Optional hard stop. null means it runs indefinitely.
  endDate?: Date | null;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Mongoose Document
// ---------------------------------------------------------------------------
export interface IRecurrenceDocument extends IRecurrence, Document {
  _id: Types.ObjectId;

  /**
   * Instance method — advances nextDueDate by one interval step.
   * Called by the cron job immediately after a transaction is generated.
   * Returns the new nextDueDate so the caller can log it.
   */
  advanceNextDueDate(): Promise<Date>;
}

// ---------------------------------------------------------------------------
// Model with static methods
// ---------------------------------------------------------------------------
export interface IRecurrenceModel extends Model<IRecurrenceDocument> {
  /**
   * Returns all active recurrences whose nextDueDate is today or earlier.
   * Called exclusively by the cron job — not by any HTTP endpoint.
   */
  findDueToday(): Promise<IRecurrenceDocument[]>;
}

// ---------------------------------------------------------------------------
// DTO shapes
// ---------------------------------------------------------------------------

export interface ICreateRecurrencePayload {
  categoryId: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  description?: string;
  paymentMethod?: PaymentMethod;
  frequency: TRecurrenceFrequency;
  interval?: number;
  startDate: Date; // becomes the first nextDueDate
  endDate?: Date | null;
}

export interface IUpdateRecurrencePayload {
  amount?: number;
  description?: string;
  paymentMethod?: PaymentMethod;
  frequency?: TRecurrenceFrequency;
  interval?: number;
  nextDueDate?: Date;
  endDate?: Date | null;
  isActive?: boolean;
}

export interface IRecurrenceQuery {
  isActive?: boolean;
  frequency?: TRecurrenceFrequency;
  page?: number;
  limit?: number;
}
