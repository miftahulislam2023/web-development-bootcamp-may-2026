import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_TIMEZONES,
  UserRole,
  UserStatus,
  USER_VALIDATION,
} from './user.constants';
import type { IUserDocument, IUserModel } from './user.interface';
import { AuthProvider } from './user.interface';
import { envVars } from '../../config/env';
import { sanitizeDocument } from './user.utils';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTH ENTRY SUB-SCHEMA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const authEntrySchema = new Schema(
  {
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: [true, 'Auth provider is required'],
    },
    providerId: {
      type: String,
      required: [true, 'Provider ID is required'],
      trim: true,
    },
  },
  { _id: false, versionKey: false },
);

// ─────────────────────────────────────────────────────────────────────────────
// Schema definition
// ─────────────────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [
        USER_VALIDATION.NAME_MIN_LENGTH,
        `Name must be at least ${USER_VALIDATION.NAME_MIN_LENGTH} characters`,
      ],
      maxlength: [
        USER_VALIDATION.NAME_MAX_LENGTH,
        `Name cannot exceed ${USER_VALIDATION.NAME_MAX_LENGTH} characters`,
      ],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },

    // -------------------------------------------------------------------------
    // Password is optional at schema level to support future OAuth providers
    // where no password is set.  The Zod layer enforces it for email/password
    // registration.  We never select password by default (select: false) so it
    // is never accidentally exposed in API responses.
    // -------------------------------------------------------------------------
    password: {
      type: String,
      minlength: [
        USER_VALIDATION.PASSWORD_MIN_LENGTH,
        `Password must be at least ${USER_VALIDATION.PASSWORD_MIN_LENGTH} characters`,
      ],
      maxlength: [
        USER_VALIDATION.PASSWORD_MAX_LENGTH,
        `Password cannot exceed ${USER_VALIDATION.PASSWORD_MAX_LENGTH} characters`,
      ],
      select: false, // NEVER returned by default — must be explicitly requested
    },

    avatarUrl: {
      type: String,
      trim: true,
      maxlength: [USER_VALIDATION.AVATAR_URL_MAX_LENGTH, 'Avatar URL is too long'],
      default: null,
    },

    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: '{VALUE} is not a valid role',
      },
      default: UserRole.USER,
    },

    auths: {
      type: [authEntrySchema],
      required: [true, 'At least one auth provider is required'],
    },

    status: {
      type: String,
      enum: {
        values: Object.values(UserStatus),
        message: '{VALUE} is not a valid status',
      },
      default: UserStatus.ACTIVE,
    },

    currency: {
      type: String,
      enum: {
        values: SUPPORTED_CURRENCIES,
        message: '{VALUE} is not a supported currency',
      },
      default: 'BDT',
    },

    timezone: {
      type: String,
      enum: {
        values: SUPPORTED_TIMEZONES,
        message: '{VALUE} is not a supported timezone',
      },
      default: 'Asia/Dhaka',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // -------------------------------------------------------------------------
    // toJSON transform — the single place where we decide what leaves the DB.
    // This runs on every res.json(user) call automatically.
    // -------------------------------------------------------------------------
    toJSON: {
      virtuals: true,
      transform: sanitizeDocument,
    },

    toObject: {
      virtuals: true,
      transform: sanitizeDocument,
    },
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true, name: 'idx_users_email_unique' });

// ─────────────────────────────────────────────────────────────────────────────
// Pre-save hook — hash the password whenever it is set or modified.
// ─────────────────────────────────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash when the password field has been touched.
  // Skipping unchanged passwords avoids re-hashing on every profile save.
  if (!this.isModified('password') || !this.password) return next();

  this.password = await bcrypt.hash(this.password, Number(envVars.BCRYPT_SALT_ROUND));
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Instance methods
// ─────────────────────────────────────────────────────────────────────────────
/**
 * comparePassword
 * Requires the document to have been fetched with .select('+password').
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * isLoginAllowed
 * A suspended or soft-deleted account must not be able to log in.
 */
userSchema.methods.isLoginAllowed = function (): boolean {
  return this.status === UserStatus.ACTIVE;
};

/**
 *   user.hasAuthProvider(AuthProvider.LOCAL)  → password have or not
 *   user.hasAuthProvider(AuthProvider.GOOGLE) → Google linked or not
 */
userSchema.methods.hasAuthProvider = function (
  this: IUserDocument,
  provider: AuthProvider,
): boolean {
  return this.auths.some((entry) => entry.provider === provider);
};

// ─────────────────────────────────────────────────────────────────────────────
// Static methods
// ─────────────────────────────────────────────────────────────────────────────
userSchema.statics.findByEmail = function (email: string): Promise<IUserDocument | null> {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+password');
};

userSchema.statics.isEmailTaken = async function (
  email: string,
  excludeUserId?: string,
): Promise<boolean> {
  const query: Record<string, unknown> = {
    email: email.toLowerCase().trim(),
  };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }
  const user = await this.findOne(query).select('_id');
  return !!user;
};

// ─────────────────────────────────────────────────────────────────────────────
// Model export
// ─────────────────────────────────────────────────────────────────────────────
const User = model<IUserDocument, IUserModel>('User', userSchema);
export default User;
