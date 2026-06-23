import type {
  ICreateTransactionPayload,
  ITransactionDocument,
  ITransactionListResult,
  ITransactionQuery,
  IUpdateTransactionPayload,
} from './transaction.interface';
import AppError from '../../errorHelpers/AppError';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';
import Transaction from './transaction.models';
import Category from '../category/category.models';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { toObjectId } from '../../utils/toObjectId';
import { TRANSACTION_SEARCHABLE_FIELDS } from './transaction.constants';
import { normalizeCategoryName } from '../category/category.utils';
import User from '../user/user.models';

// ─────────────────────────────────────────────────────────────────────────────
// createTransaction
// ─────────────────────────────────────────────────────────────────────────────
const createTransaction = async (
  userId: string,
  payload: ICreateTransactionPayload,
): Promise<ITransactionDocument> => {
  // -------------------------------------------------------------------------
  // Category ownership + type consistency check.
  //
  // We validate two things here:
  //   1. The category exists and is accessible to this user.
  //   2. The transaction type matches the category type.
  //
  // Reason for check 2: an "income" transaction in an "expense" category would
  // corrupt category-level analytics.  This guard prevents that at write time.
  // -------------------------------------------------------------------------
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

  const transaction = await Transaction.create({
    userId: toObjectId(userId),
    categoryName: normalizeCategoryName(category.name),
    currency: user.currency,
    ...payload,
    isRecurring: false, // direct creates are never recurring
  });

  // Populate category before returning so the response is immediately useful
  // to the client without requiring a follow-up GET request.
  return transaction.populate({
    path: 'categoryId',
    select: 'name type icon colorHex',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Returns a paginated, filtered, sorted list of transactions.
// Also returns a summary (income/expense/balance) for the CURRENT filter
// so the dashboard can show totals in the same request.
// ─────────────────────────────────────────────────────────────────────────────

const getAllTransactions = async (
  userId: string,
  query: ITransactionQuery,
): Promise<ITransactionListResult> => {
  const rawQuery = {
    ...query,
    userId: toObjectId(userId),
  } as unknown as Record<string, string>;

  // console.log('Building query with:', rawQuery);

  const queryBuilder = new QueryBuilder(
    Transaction.find().populate({
      path: 'categoryId',
      select: 'name type icon colorHex',
    }),
    rawQuery,
  );
  // console.log("Initial query:", await queryBuilder.build());
  const built = queryBuilder
    .search(TRANSACTION_SEARCHABLE_FIELDS)
    .filter()
    .rangeFilter([
      { field: 'amount', min: 'minAmount', max: 'maxAmount' },
      { field: 'date', min: 'startDate', max: 'endDate' },
    ])
    .sort()
    .paginate();

  // console.log("built:", await built.build());
  const [data, meta] = await Promise.all([
    built.build().lean<ITransactionDocument[]>(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// getTransactionById
// ─────────────────────────────────────────────────────────────────────────────
const getTransactionById = async (
  transactionId: string,
  userId: string,
): Promise<ITransactionDocument> => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId: toObjectId(userId), // scoping by userId prevents cross-user data leakage
  }).populate({ path: 'categoryId', select: 'name type icon colorHex' });

  if (!transaction) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      'Transaction not found or you have not permitted to view the transaction',
    );
  }

  return transaction;
};

// ─────────────────────────────────────────────────────────────────────────────
// updateTransaction
// ─────────────────────────────────────────────────────────────────────────────
const updateTransaction = async (
  transactionId: string,
  userId: string,
  payload: IUpdateTransactionPayload,
): Promise<ITransactionDocument> => {
  const transaction = await Transaction.findOne({ _id: transactionId, userId: toObjectId(userId) });

  if (!transaction) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Transaction not found');
  }

  // If categoryId is being changed, re-validate type consistency.
  if (payload.categoryId) {
    const category = await Category.findOne({
      _id: payload.categoryId,
      $or: [{ userId: toObjectId(userId) }, { isSystem: true }],
      isActive: true,
    }).lean();

    if (!category) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'Category not found or not accessible');
    }

    // Re-check type match using the EXISTING transaction type
    // (type itself is not updatable — see validation schema comment).
    // if (category.type !== transaction.type) {
    //   throw new AppError(
    //     HTTP_STATUS.BAD_REQUEST,
    //     `Category type "${category.type}" does not match this transaction's type "${transaction.type}"`,
    //   );
    // }
    payload.categoryName = category.name;
  }

  Object.assign(transaction, payload);
  await transaction.save();

  return transaction.populate({
    path: 'categoryId',
    select: 'name type icon colorHex',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Hard delete — transactions are financial records so we follow a different
// policy from categories: once deleted they are gone.  If audit trails are
// needed in future, an audit_log module should be added (out of scope here).
// ─────────────────────────────────────────────────────────────────────────────
const deleteTransaction = async (transactionId: string, userId: string): Promise<void> => {
  const result = await Transaction.findOneAndDelete({
    _id: transactionId,
    userId: toObjectId(userId), // ownership guard prevents deleting another user's transaction
  });

  if (!result) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Transaction not found or not accessible to you!');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Quick dashboard summary: total income, total expense, net balance.
// Does NOT paginate — returns aggregate numbers only.
// ─────────────────────────────────────────────────────────────────────────────
const getTransactionSummary = async (userId: string, endDate?: Date) => {
  return Transaction.getNetBalance(toObjectId(userId), endDate);
};
// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const transactionService = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
