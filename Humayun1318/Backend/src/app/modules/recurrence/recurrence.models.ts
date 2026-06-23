import { Schema, model } from 'mongoose';
import { RECURRENCE_FREQUENCY, RECURRENCE_VALIDATION } from './recurrence.constants';
import type { IRecurrenceDocument, IRecurrenceModel } from './recurrence.interface';
import { TRANSACTION_TYPE, PAYMENT_METHOD } from '../transaction/transaction.constants';
import { computeNextDueDate } from './recurrence.utils';

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

const recurrenceSchema = new Schema<IRecurrenceDocument, IRecurrenceModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recurrence must belong to a user'],
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Recurrence must have a category'],
    },

    type: {
      type: String,
      enum: {
        values: Object.values(TRANSACTION_TYPE),
        message: '{VALUE} is not a valid transaction type',
      },
      required: [true, 'Transaction type is required'],
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [RECURRENCE_VALIDATION.AMOUNT_MIN, 'Amount must be greater than 0'],
    },

    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'BDT',
      maxlength: [3, 'Currency must be 3-letter ISO 4217 code'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [RECURRENCE_VALIDATION.DESCRIPTION_MAX_LENGTH, 'Description too long'],
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: {
        values: Object.values(PAYMENT_METHOD),
        message: '{VALUE} is not a valid payment method',
      },
      default: PAYMENT_METHOD.CASH,
    },

    frequency: {
      type: String,
      enum: {
        values: Object.values(RECURRENCE_FREQUENCY),
        message: '{VALUE} is not a valid frequency',
      },
      required: [true, 'Frequency is required'],
    },

    // ---------------------------------------------------------------------------
    // interval — "every N <frequency> units"
    // Default 1 = every single period (weekly, monthly etc.)
    // Example: interval=2, frequency=monthly → every 2 months
    // ---------------------------------------------------------------------------
    interval: {
      type: Number,
      default: 1,
      min: [RECURRENCE_VALIDATION.INTERVAL_MIN, 'Interval must be at least 1'],
      max: [
        RECURRENCE_VALIDATION.INTERVAL_MAX,
        `Interval cannot exceed ${RECURRENCE_VALIDATION.INTERVAL_MAX}`,
      ],
    },

    // ---------------------------------------------------------------------------
    // nextDueDate — THE central field of the entire module.
    //
    // The cron job does:
    //   Recurrence.find({ nextDueDate: { $lte: today }, isActive: true })
    //
    // For every match it creates a Transaction, then calls
    //   recurrence.advanceNextDueDate()
    // which advances this field by interval × frequency.
    //
    // This design means the cron job is stateless — it just looks at this one
    // field to know what to do next, with no other bookkeeping required.
    // ---------------------------------------------------------------------------
    nextDueDate: {
      type: Date,
      required: [true, 'nextDueDate is required'],
      index: true, // the cron query hits this index every single day
    },

    // null = runs forever; set a date to stop after that point.
    endDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    collection: 'recurrences',
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// indexes
//
// (userId, isActive) — user's active/inactive list view.
//
// (nextDueDate, isActive) — THE cron query index.
//   Without this, the daily cron would do a full collection scan across ALL
//   users' recurrences every night..
// ─────────────────────────────────────────────────────────────────────────────
recurrenceSchema.index({ userId: 1, isActive: 1 }, { name: 'idx_recurrence_user_active' });
recurrenceSchema.index(
  { nextDueDate: 1, isActive: 1 },
  { name: 'idx_recurrence_due_active' }, // cron query index — critical
);

// ─────────────────────────────────────────────────────────────────────────────
// Instance method — advanceNextDueDate
//
// Called by the cron job IMMEDIATELY after a transaction is generated for
// this recurrence.  Advances nextDueDate by one interval step and saves.
//
// Returns the new nextDueDate so the cron job can log it.
//
// WHY an instance method instead of a service function?
//   The date calculation logic belongs to the recurrence document itself.
//   It's an action the document performs on itself — a classic use case for
//   an instance method.  The cron job just calls it and moves on.
// ─────────────────────────────────────────────────────────────────────────────
recurrenceSchema.methods.advanceNextDueDate = async function (): Promise<Date> {
  const newDate = computeNextDueDate(this.nextDueDate, this.frequency, this.interval);

  // Auto-deactivate if we've passed the endDate.
  if (this.endDate && newDate > this.endDate) {
    this.isActive = false;
  } else {
    this.nextDueDate = newDate;
  }

  await this.save();
  return this.nextDueDate;
};

// ─────────────────────────────────────────────────────────────────────────────
// Static method — findDueToday
//
// Returns all active recurrences whose nextDueDate is today or earlier.
// The "earlier" case handles missed runs (e.g. server was down for 2 days).
//
// Called ONLY by the cron job — never by any HTTP endpoint.
// ─────────────────────────────────────────────────────────────────────────────
recurrenceSchema.statics.findDueToday = async function (): Promise<IRecurrenceDocument[]> {
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999); // end of today

  return this.find({
    isActive: true,
    nextDueDate: { $lte: todayEnd },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Model export
// ─────────────────────────────────────────────────────────────────────────────
const Recurrence = model<IRecurrenceDocument, IRecurrenceModel>('Recurrence', recurrenceSchema);

export default Recurrence;
