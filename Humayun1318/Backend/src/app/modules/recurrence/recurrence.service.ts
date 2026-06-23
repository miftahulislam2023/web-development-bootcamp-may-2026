import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errorHelpers/AppError';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';
import Category from '../category/category.models';
import { normalizeCategoryName } from '../category/category.utils';
import Transaction from '../transaction/transaction.models';
import User from '../user/user.models';
import { RECURRENCE_SEARCHABLE_FIELDS } from './recurrence.constants';
import type {
  ICreateRecurrencePayload,
  IRecurrenceDocument,
  IRecurrenceQuery,
  IUpdateRecurrencePayload,
} from './recurrence.interface';
import Recurrence from './recurrence.models';

// ─────────────────────────────────────────────────────────────────────────────
// createRecurrence
// ─────────────────────────────────────────────────────────────────────────────
const createRecurrence = async (
  userId: string,
  payload: ICreateRecurrencePayload,
): Promise<IRecurrenceDocument> => {
  // Validate category ownership + type match (same guard as transaction service).
  const category = await Category.findOne({
    _id: payload.categoryId,
    $or: [{ userId }, { isSystem: true }],
    isActive: true,
  }).lean();

  if (!category) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Category not found or not accessible');
  }

  if (category.type !== payload.type) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `Transaction type "${payload.type}" does not match category type "${category.type}"`,
    );
  }
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  const { startDate, ...rest } = payload;

  const recurrence = await Recurrence.create({
    userId,
    currency: user?.currency,
    ...rest,
    nextDueDate: startDate, // startDate becomes the first nextDueDate
  });

  return recurrence.populate({ path: 'categoryId', select: 'name type icon colorHex' });
};

// ─────────────────────────────────────────────────────────────────────────────
// getAllRecurrences
// ─────────────────────────────────────────────────────────────────────────────
const getAllRecurrences = async (userId: string, query: IRecurrenceQuery) => {
  const rawQuery = {
    ...query,
    userId,
  } as unknown as Record<string, string>;

  console.log('raw query', rawQuery);

  const queryBuild = new QueryBuilder(
    Recurrence.find().populate({
      path: 'categoryId',
      select: 'name type icon colorHex',
    }),
    rawQuery,
  );

  const built = queryBuild.search(RECURRENCE_SEARCHABLE_FIELDS).filter().sort().paginate();

  const [data, meta] = await Promise.all([
    built.build().lean<IRecurrenceDocument[]>(),
    queryBuild.getMeta(),
  ]);
  return { data, meta };
};

// ─────────────────────────────────────────────────────────────────────────────
// getRecurrenceById
// ─────────────────────────────────────────────────────────────────────────────
const getRecurrenceById = async (
  recurrenceId: string,
  userId: string,
): Promise<IRecurrenceDocument> => {
  const recurrence = await Recurrence.findOne({
    _id: recurrenceId,
    userId,
  }).populate({ path: 'categoryId', select: 'name type icon colorHex' });

  if (!recurrence) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Recurrence not found');
  }

  return recurrence;
};

// ─────────────────────────────────────────────────────────────────────────────
// updateRecurrence
// ─────────────────────────────────────────────────────────────────────────────
const updateRecurrence = async (
  recurrenceId: string,
  userId: string,
  payload: IUpdateRecurrencePayload,
): Promise<IRecurrenceDocument> => {
  const recurrence = await Recurrence.findOne({ _id: recurrenceId, userId });

  if (!recurrence) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Recurrence not found');
  }

  Object.assign(recurrence, payload);
  await recurrence.save();

  return recurrence.populate({ path: 'categoryId', select: 'name type icon colorHex' });
};

// ─────────────────────────────────────────────────────────────────────────────
// deleteRecurrence
//
// Hard delete — the recurrence rule itself has no historical value once stopped.
// The transactions it already generated remain untouched (they have their own
// documents in the transactions collection with recurrence_id stamps).
// ─────────────────────────────────────────────────────────────────────────────
const deleteRecurrence = async (recurrenceId: string, userId: string): Promise<void> => {
  const result = await Recurrence.findOneAndDelete({ _id: recurrenceId, userId });

  if (!result) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Recurrence not found');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// createTransactionsForDueRecurrences  ← CRON JOB ENTRY POINT
//
// This is the only function the cron job calls.  Everything else in this
// service is for HTTP endpoints.
//
// Algorithm:
//   1. Find all active recurrences whose nextDueDate <= today.
//   2. For each: create a Transaction stamped with recurrenceId.
//   3. Advance nextDueDate (or deactivate if past endDate).
//   4. Return a summary for the cron job's log output.
//
// WHY is this in the service and not in the cron file?
//   The cron file should only handle scheduling concerns (when to run).
//   All DB logic lives in the service so it can be:
//     • Unit-tested without a real cron scheduler.
//     • Triggered manually via an admin endpoint if needed.
//     • Re-run safely if the cron fires twice (no duplicate guard needed
//       because advanceNextDueDate moves nextDueDate forward immediately).
// ─────────────────────────────────────────────────────────────────────────────
const createTransactionsForDueRecurrences = async (): Promise<{
  processed: number;
  created: number;
  failed: number;
  errors: Array<{ recurrenceId: string; error: string }>;
}> => {
  const dueRecurrences = await Recurrence.findDueToday();

  let created = 0;
  let failed = 0;
  const errors: Array<{ recurrenceId: string; error: string }> = [];

  for (const recurrence of dueRecurrences) {
    try {
      const category = await Category.findOne({
        _id: recurrence?.categoryId,
        $or: [{ userId: recurrence?.userId }, { isSystem: true }],
        isActive: true,
      }).lean();

      if (!category) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, 'Category not found or not accessible');
      }
      // -----------------------------------------------------------------------
      // Create the transaction.
      // recurrenceId links back to the rule that generated it.
      // isRecurring = true flags it as auto-generated (useful for UI display).
      // -----------------------------------------------------------------------
      await Transaction.create({
        userId: recurrence?.userId,
        categoryId: recurrence?.categoryId,
        type: recurrence?.type,
        categoryName: normalizeCategoryName(category?.name),
        amount: recurrence?.amount,
        currency: recurrence?.currency,
        description: recurrence.description ?? `Auto: ${recurrence.frequency} transaction`,
        paymentMethod: recurrence?.paymentMethod ?? `cash`,
        date: new Date(), // today — the date it was actually generated
        isRecurring: true,
        recurrenceId: recurrence._id, // FK stamp — see transaction model update note
      });

      // Advance nextDueDate AFTER successful transaction creation.
      // If transaction.create() throws, nextDueDate is NOT advanced, so the
      // cron will retry tomorrow — natural retry behaviour.
      await recurrence.advanceNextDueDate();

      created++;
    } catch (err) {
      failed++;
      errors.push({
        recurrenceId: recurrence._id.toString(),
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    processed: dueRecurrences.length,
    created,
    failed,
    errors,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const recurrenceService = {
  createRecurrence,
  getAllRecurrences,
  getRecurrenceById,
  updateRecurrence,
  deleteRecurrence,
  createTransactionsForDueRecurrences, // consumed by cron job
};
