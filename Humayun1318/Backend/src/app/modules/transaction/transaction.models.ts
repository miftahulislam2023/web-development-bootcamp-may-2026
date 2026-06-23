import { Schema, model } from 'mongoose';
import { PAYMENT_METHOD, TRANSACTION_TYPE, TRANSACTION_VALIDATION } from './transaction.constants';
import type { ITransactionDocument, ITransactionModel } from './transaction.interface';
import { normalizeTags } from './transaction.utils';

// ─────────────────────────────────────────────────────────────────────────────
// Schema definition
// ─────────────────────────────────────────────────────────────────────────────

const transactionSchema = new Schema<ITransactionDocument, ITransactionModel>(
  {
    // -------------------------------------------------------------------------
    // userId — stamped at service level.  index:true because EVERY query
    // on this collection is scoped to a specific user; without this index
    // Mongo would do a full collection scan on every request.
    // -------------------------------------------------------------------------
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to a user'],
      index: true,
    },

    // FK to categories — always required for analytics grouping.
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Transaction must have a category'],
      index: true,
    },
    categoryName: {
      // handle from service layer not from frontend
      type: String,
      required: [true, 'Category name is required'],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(TRANSACTION_TYPE),
        message: '{VALUE} is not a valid transaction type',
      },
      required: [true, 'Transaction type is required'],
    },

    // Minimum amount guard at schema level as a safety net below Zod.
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [TRANSACTION_VALIDATION.AMOUNT_MIN, 'Amount must be greater than 0'],
    },

    currency: {
      type: String,
      trim: true,
      uppercase: true, // always store as "BDT", "USD", not "bdt"
      default: 'BDT',
      maxlength: [3, 'Currency code must be 3 characters (ISO 4217)'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        TRANSACTION_VALIDATION.DESCRIPTION_MAX_LENGTH,
        `Description cannot exceed ${TRANSACTION_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
      ],
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

    tags: {
      type: [String],
      default: [],
      validate: {
        validator(v: string[]) {
          return (
            v.length <= TRANSACTION_VALIDATION.TAGS_MAX_COUNT &&
            v.every((t) => t.length <= TRANSACTION_VALIDATION.TAG_MAX_LENGTH)
          );
        },
        message: `Tags: max ${TRANSACTION_VALIDATION.TAGS_MAX_COUNT} items, each ≤ ${TRANSACTION_VALIDATION.TAG_MAX_LENGTH} chars`,
      },
    },

    // -------------------------------------------------------------------------
    // date vs createdAt:
    //   • date     = when the transaction HAPPENED (user-specified, can be past)
    //   • createdAt = when the record was CREATED in the database
    // Analytics always group by `date` so users can backfill old transactions.
    // -------------------------------------------------------------------------
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      index: true, // range queries on date are very common
    },

    // FK reference
    recurrenceId: {
      type: Schema.Types.ObjectId,
      ref: 'Recurrence',
      default: null,
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    referenceNote: {
      type: String,
      trim: true,
      maxlength: [
        TRANSACTION_VALIDATION.REFERENCE_NOTE_MAX_LENGTH,
        `Reference note cannot exceed ${TRANSACTION_VALIDATION.REFERENCE_NOTE_MAX_LENGTH} characters`,
      ],
      default: null,
    },
  },
  {
    timestamps: true,

    // -------------------------------------------------------------------------
    // toJSON transform — safe API output.
    // Rename _id → id and strip __v.
    // -------------------------------------------------------------------------
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
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// indexes
//
// (userId, date DESC) — the default list view is "my transactions, newest first".
//   This index covers the sort without a separate sort stage.
//
// (userId, categoryId) — category-filtered analytics: "show me all Food expenses".
//
// (userId, type) — ledger-side filtering: "show me all income".
//
// (userId, date, type) — monthly income vs expense summary — the aggregation
//   pipeline $match stage hits this compound index directly.
// ─────────────────────────────────────────────────────────────────────────────
transactionSchema.index({ userId: 1, date: -1 }, { name: 'idx_txn_user_date' });
transactionSchema.index({ userId: 1, categoryId: 1 }, { name: 'idx_txn_user_category' });
transactionSchema.index({ userId: 1, type: 1 }, { name: 'idx_txn_user_type' });
transactionSchema.index({ userId: 1, date: -1, type: 1 }, { name: 'idx_txn_user_date_type' });

// ─────────────────────────────────────────────────────────────────────────────
// Static methods
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Uses an aggregation pipeline to calculate totals without loading individual
 * Returns { income, expense, balance } for quick dashboard widgets.
 */
transactionSchema.statics.getNetBalance = async function (userId: string, toDate?: Date) {
  const matchStage: Record<string, unknown> = { userId };
  if (toDate) matchStage.date = { $lte: toDate };

  const [summary] = await this.aggregate([
    { $match: matchStage },

    {
      $group: {
        _id: null,

        income: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
          },
        },

        expense: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        income: 1,
        expense: 1,
        balance: {
          $subtract: ['$income', '$expense'],
        },
      },
    },
  ]);

  return (
    summary ?? {
      income: 0,
      expense: 0,
      balance: 0,
    }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Pre-save hook
//
// Normalise tags: trim whitespace, lowercase, deduplicate.
// ─────────────────────────────────────────────────────────────────────────────
transactionSchema.pre('save', function (next) {
  if (this.isModified('tags') && Array.isArray(this.tags)) {
    this.tags = normalizeTags(this.tags);
  }
  next();
});

transactionSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as Record<string, unknown>;

  if (Array.isArray(update.tags)) {
    update.tags = normalizeTags(update.tags as string[]);
  }
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Model export
// ─────────────────────────────────────────────────────────────────────────────
const Transaction = model<ITransactionDocument, ITransactionModel>(
  'Transaction',
  transactionSchema,
);

export default Transaction;
