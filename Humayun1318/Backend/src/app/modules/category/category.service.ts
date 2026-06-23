import type {
  ICategoryDocument,
  ICategoryQuery,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from './category.interface';
import Category from './category.models';
import { normalizeCategoryName } from './category.utils';
import AppError from '../../errorHelpers/AppError';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { toObjectId } from '../../utils/toObjectId';

// ─────────────────────────────────────────────────────────────────────────────
// Creates a user-defined custom category.
// ─────────────────────────────────────────────────────────────────────────────
const createCategory = async (
  userId: string,
  payload: ICreateCategoryPayload,
): Promise<ICategoryDocument> => {
  const normalizedName = normalizeCategoryName(payload?.name);

  const existingSystemCategory = await Category.findOne({
    name: normalizedName,
    isSystem: true,
    isActive: true,
  });

  if (existingSystemCategory) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'This category already exists as a system category');
  }
  const existingUserCategory = await Category.findOne({
    name: normalizedName,
    userId: userId,
    isSystem: false,
    isActive: true,
  });

  if (existingUserCategory) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'You already created this category');
  }

  const category = await Category.create({
    userId,
    ...payload,
    isSystem: false, // users can never create system categories
  });

  return category;
};

// ─────────────────────────────────────────────────────────────────────────────
// Returns all categories visible to a user:
//   • Their own custom categories (userId matches)
//   • System categories (isSystem === true / userId === null)
// ─────────────────────────────────────────────────────────────────────────────
const getAllCategories = async (userId: string, query: ICategoryQuery) => {
  const rawQuery = {
    ...query,
  } as unknown as Record<string, string>;

  //   .paginate();
  const baseFilter: Record<string, any> = {
    $or: [
      { userId: toObjectId(userId) },
      { isSystem: true },
    ],
  };

  if (query?.searchTerm) {
    baseFilter.$and = [
      {
        $or: [
          { name: { $regex: query.searchTerm, $options: 'i' } },
          { type: { $regex: query.searchTerm, $options: 'i' } },
        ],
      },
    ];
  }

  const queryBuild = new QueryBuilder(
    Category.find(baseFilter).populate({
      path: 'userId',
      select: 'name email',
    }),
    rawQuery,
  );

  const built = queryBuild
    // .search(CATEGORY_SEARCHABLE_FIELDS) ❌
    .filter()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    built.build().lean<ICategoryDocument[]>(),
    queryBuild.getMeta(),
  ]);
  return { data, meta };
};

// ─────────────────────────────────────────────────────────────────────────────
// Fetches a single category, verifying the requester has read access.
// System categories are readable by anyone; custom categories only by owner.
// ─────────────────────────────────────────────────────────────────────────────
const getCategoryById = async (categoryId: string, userId: string): Promise<ICategoryDocument> => {
  const canAccess = await Category.isOwnerOrSystem(categoryId, userId);

  // Non-system category belongs to a different user — deny read.
  if (!canAccess) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'Access to this category is forbidden');
  }

  const category = await Category.findById(categoryId).lean<ICategoryDocument>();
  if (!category) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  }

  return category;
};

// ─────────────────────────────────────────────────────────────────────────────
// Updates a user-owned category.  System categories are immutable by design —
// mutations would silently break analytics for all other users who share them.
// ─────────────────────────────────────────────────────────────────────────────
const updateCategory = async (
  categoryId: string,
  userId: string,
  payload: IUpdateCategoryPayload,
): Promise<ICategoryDocument> => {
  const canAccess = await Category.isOwnerOrSystem(categoryId, userId);

  if (!canAccess) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to update this category');
  }
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  }

  // Immutability guard for system categories.
  if (category.isSystem) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'System categories cannot be modified');
  }

  // Ownership guard for custom categories.
  // if (!category.userId?.equals(userId)) {
  //   throw new AppError(
  //     HTTP_STATUS.FORBIDDEN,
  //     'You do not have permission to update this category',
  //   );
  // }

  // Apply only the provided fields — partial update (PATCH semantics).
  Object.assign(category, payload);
  await category.save();

  return category;
};

// ─────────────────────────────────────────────────────────────────────────────
// deleteCategory
// Soft-deletes by setting isActive = false.
// ─────────────────────────────────────────────────────────────────────────────
const deleteCategory = async (categoryId: string, userId: string): Promise<void> => {
  const canAccess = await Category.isOwnerOrSystem(categoryId, userId);

  if (!canAccess) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to delete this category');
  }
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  }

  if (category.isSystem) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'System categories cannot be deleted');
  }

  // if (!category.userId?.equals(userId)) {
  //   throw new AppError(
  //     HTTP_STATUS.FORBIDDEN,
  //     'You do not have permission to delete this category',
  //   );
  // }

  // Soft delete — set inactive, do not remove the document.
  category.isActive = false;
  await category.save();
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
