import type { Document, Model, Types } from 'mongoose';
import type { CategoryType } from './category.constants';

// ---------------------------------------------------------------------------
// Core domain shape — plain data.
// Used in service return types and DTOs.
// ---------------------------------------------------------------------------
export interface ICategory {
  // FK to users collection. null means a system-level category visible to all.
  userId: Types.ObjectId | null;

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

// ---------------------------------------------------------------------------
// Mongoose Document — the shape of a raw document returned from queries.
// Kept separate from ICategory so we can talk about "business data" vs
// "database document" without confusion.
// ---------------------------------------------------------------------------
export interface ICategoryDocument extends ICategory, Document {
  _id: Types.ObjectId;
}

// ---------------------------------------------------------------------------
// Static methods on the Model constructor.
// Defined here so TypeScript knows about them when we call Category.isOwner().
// ---------------------------------------------------------------------------
export interface ICategoryModel extends Model<ICategoryDocument> {
  /**
   * Returns true when the given user either owns the category
   * or it is a system-level category (userId === null).
   */
  isOwnerOrSystem(
    categoryId: Types.ObjectId | string,
    userId: Types.ObjectId | string,
  ): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// DTO shapes — what the HTTP layer sends in and what the service returns.
// ---------------------------------------------------------------------------

/** Payload accepted when creating a new category. */
export interface ICreateCategoryPayload {
  name: string;
  type: CategoryType;
  icon?: string;
  colorHex?: string;
}

/** Payload accepted when updating an existing category. */
export interface IUpdateCategoryPayload {
  name?: string;
  icon?: string;
  colorHex?: string;
  isActive?: boolean;
}

/** Parsed query parameters for listing categories. */
export interface ICategoryQuery {
  type?: CategoryType;
  isActive?: boolean;
  includeSystem?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  searchTerm?: string;
}
