import { Schema, model } from 'mongoose';
import type { ICategoryDocument, ICategoryModel } from './category.interface';
import { CATEGORY_ICON, CATEGORY_TYPE, CATEGORY_VALIDATION } from './category.constants';
import { normalizeCategoryName } from './category.utils';

// ─────────────────────────────────────────────────────────────────────────────
// Schema definition
// ─────────────────────────────────────────────────────────────────────────────

const categorySchema = new Schema<ICategoryDocument, ICategoryModel>(
  {
    // -------------------------------------------------------------------------
    // userId is intentionally nullable.
    // null  → system category, visible to every authenticated user.
    // ObjectId → user-defined custom category, private to that user.
    // This single field replaces a separate SystemCategory collection.
    // -------------------------------------------------------------------------
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true, // queried on every user category list
    },

    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [
        CATEGORY_VALIDATION.NAME_MIN_LENGTH,
        `Name must be at least ${CATEGORY_VALIDATION.NAME_MIN_LENGTH} characters`,
      ],
      maxlength: [
        CATEGORY_VALIDATION.NAME_MAX_LENGTH,
        `Name cannot exceed ${CATEGORY_VALIDATION.NAME_MAX_LENGTH} characters`,
      ],
    },

    // income | expense — enforced both here and at the Zod layer so
    // invalid values never reach the database.
    type: {
      type: String,
      enum: {
        values: Object.values(CATEGORY_TYPE),
        message: '{VALUE} is not a valid category type',
      },
      required: [true, 'Category type is required'],
      trim: true,
      index: true,
    },

    // Icon slug resolved to a component by the frontend icon registry.
    icon: {
      type: String,
      enum: {
        values: Object.values(CATEGORY_ICON),
        message: '{VALUE} is not a valid icon slug',
      },
      trim: true,
      default: CATEGORY_ICON.OTHER,
    },

    // Validated by the Zod schema before hitting Mongoose, but we keep the
    // regex here as a last-resort database-level guard.
    colorHex: {
      type: String,
      trim: true,
      match: [
        CATEGORY_VALIDATION.COLOR_HEX_REGEX,
        'colorHex must be a valid hex colour (#RGB or #RRGGBB)',
      ],
      default: null,
    },

    // System categories are seeded once and must never be deleted.
    // The service layer checks this flag before allowing any mutation.
    isSystem: {
      type: Boolean,
      default: false,
    },

    // Soft-delete pattern — disabling preserves transaction history integrity.
    // Hard-deleting a category would orphan old transactions.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,

    // -------------------------------------------------------------------------
    // toJSON transform — controls the shape of every API response that
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
// ─────────────────────────────────────────────────────────────────────────────
categorySchema.index({ userId: 1, type: 1 }, { name: 'idx_cat_user_type' });

// ─────────────────────────────────────────────────────────────────────────────
// Static methods
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Authorization helper called by the service before any mutating operation.
 * Returns true when:
 *   • userId matches — the user owns the category, OR
 *   • userId is null — it is a system category (always accessible).
 */
categorySchema.statics.isOwnerOrSystem = async function (categoryId, userId): Promise<boolean> {
  const category = await this.findById(categoryId).select('userId isSystem');
  if (!category) return false;
  // System categories belong to nobody, so everyone can read them.
  if (category.isSystem || category.userId === null) return true;
  return category.userId.equals(userId);
};

// ─────────────────────────────────────────────────────────────────────────────
// Normalise name casing so "Food" and "food" are treated as the same category.
// We title-case only the first letter to respect acronyms like "ATM fees".
// ─────────────────────────────────────────────────────────────────────────────
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = normalizeCategoryName(this.name);
  }
  next();
});

categorySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as Record<string, unknown>;

  if (update?.name && typeof update.name === 'string') {
    update.name = normalizeCategoryName(update.name);
  }

  next();
});
// ─────────────────────────────────────────────────────────────────────────────
// Model export
// ─────────────────────────────────────────────────────────────────────────────
const Category = model<ICategoryDocument, ICategoryModel>('Category', categorySchema);

export default Category;
