import { USER_SEARCHABLE_FIELDS, UserStatus } from './user.constants';
import type {
  IAuthEntry,
  IAuthTokens,
  IChangePasswordPayload,
  IRegisterPayload,
  IUpdateProfilePayload,
  IUserDocument,
  IUserQuery,
  IUserAnalytics,
} from './user.interface';
import { AuthProvider } from './user.interface';
import AppError from '../../errorHelpers/AppError';
import User from './user.models';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';
import { createUserTokens } from '../../utils/userTokens';
import { QueryBuilder } from '../../builder/QueryBuilder';

// ─────────────────────────────────────────────────────────────────────────────
// register
// ─────────────────────────────────────────────────────────────────────────────
const register = async (payload: IRegisterPayload & { auths?: IAuthEntry[] }) => {
  // Check for duplicate email before hitting the unique index.
  const emailTaken = await User.isEmailTaken(payload.email);
  if (emailTaken) {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser?.status === UserStatus.DELETED) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'An account with this email address was previously deleted. Please contact support if you believe this is a mistake.',
      );
    }
    throw new AppError(HTTP_STATUS.CONFLICT, 'An account with this email address already exists');
  }

  // Normalize auths: set providerId to email
  payload.auths = payload?.auths?.map(() => ({
    provider: AuthProvider.LOCAL,
    providerId: payload?.email,
  })) || [
      {
        provider: AuthProvider.LOCAL,
        providerId: payload?.email,
      },
    ];

  // //check if CREDENTIALS provider exists
  const hasCredentialsProvider = payload.auths.some((auth) => auth.provider === AuthProvider.LOCAL);

  // local provider must have password
  if (hasCredentialsProvider && !payload.password) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Password is required for credentials authentication',
    );
  }

  // The pre-save hook hashes the password — we pass the plain-text value here.
  const user = await User.create(payload);

  if (!user) {
    throw new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to create user');
  }

  // Generate auth tokens for the newly registered user.
  const tokens: IAuthTokens = createUserTokens(user);

  return { user, tokens };
};

// ─────────────────────────────────────────────────────────────────────────────
// getMe — fetch the requesting user's own profile
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (userId: string): Promise<IUserDocument> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  if (user?.status === UserStatus.DELETED) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Your account has been deleted. please contact support.',
    );
  }

  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// updateProfile
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (
  userId: string,
  payload: IUpdateProfilePayload,
): Promise<IUserDocument> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  if (user?.status === UserStatus.DELETED) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Your account has been deleted. Profile cannot be updated.',
    );
  }

  Object.assign(user, payload);
  await user.save();

  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// changePassword
// ─────────────────────────────────────────────────────────────────────────────
const changePassword = async (userId: string, payload: IChangePasswordPayload): Promise<void> => {
  // Explicitly select password because it has select:false on the schema.
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  const currentPasswordMatch = await user.comparePassword(payload.currentPassword);
  if (!currentPasswordMatch) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
  }

  // Assign plain-text — the pre-save hook will hash it before persisting.
  user.password = payload.newPassword;
  await user.save();
};

// ─────────────────────────────────────────────────────────────────────────────
// deleteOwnAccount — soft delete by the user themselves
// ─────────────────────────────────────────────────────────────────────────────
const deleteOwnAccount = async (userId: string, password: string): Promise<void> => {
  if (!password) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Password is required to delete account');
  }
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  // Require password confirmation before soft-deleting the account.
  const match = await user.comparePassword(password);
  if (!match) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      'Password confirmation failed. Account was not deleted.',
    );
  }

  user.status = UserStatus.DELETED;
  await user.save();
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin: getAllUsers
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (
  query: IUserQuery,
) => {
  const rawQuery = {
    ...query,
  } as unknown as Record<string, string>;

  const queryBuilder = new QueryBuilder(
    User.find(),
    rawQuery,
  );

  const built = queryBuilder
    .search(USER_SEARCHABLE_FIELDS) // Define USER_SEARCHABLE_FIELDS = ['name', 'email']
    .filter() // This will handle role, status filters automatically
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    built.build().lean<IUserDocument[]>(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin: getUserById
// ─────────────────────────────────────────────────────────────────────────────
const getUserById = async (userId: string): Promise<IUserDocument> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin: updateUserStatus — suspend / reactivate / soft-delete
// ─────────────────────────────────────────────────────────────────────────────
const updateUserStatus = async (targetUserId: string, status: string): Promise<IUserDocument> => {
  const user = await User.findById(targetUserId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  user.status = status as IUserDocument['status'];
  await user.save();

  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin: getAnalytics — retrieve system analytics about users
// ─────────────────────────────────────────────────────────────────────────────
const getAnalytics = async (): Promise<IUserAnalytics> => {
  // Execute all count operations in parallel for better performance
  const [totalUsers, activeUsers, suspendedUsers, deletedUsers, totalAdmins] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: UserStatus.ACTIVE }),
    User.countDocuments({ status: UserStatus.SUSPENDED }),
    User.countDocuments({ status: UserStatus.DELETED }),
    User.countDocuments({ role: 'admin' }),
  ]);

  // Determine system status based on suspended/deleted users ratio
  const problemUsers = suspendedUsers + deletedUsers;
  const problemRatio = totalUsers > 0 ? problemUsers / totalUsers : 0;

  // If more than 20% of users are suspended or deleted, show warning
  const systemStatus = problemRatio > 0.2 ? 'warning' : 'healthy';

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
    deletedUsers,
    totalAdmins,
    systemStatus,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const userService = {
  register,
  getMe,
  updateProfile,
  changePassword,
  deleteOwnAccount,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAnalytics,
};
