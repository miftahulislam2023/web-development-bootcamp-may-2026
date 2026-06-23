import type { Document, Model, Types } from 'mongoose';
import type {
  SupportedCurrency,
  SupportedTimezone,
  UserRoleType,
  UserStatusType,
} from './user.constants';

// authProvider types
export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

// authentication providers
export interface IAuthEntry {
  provider: AuthProvider;
  providerId: string;
}

// ---------------------------------------------------------------------------
// Core domain shape — plain data, no Mongoose noise.
// ---------------------------------------------------------------------------
export interface IUser {
  name: string;
  email: string;

  password?: string;

  avatarUrl?: string;

  role: UserRoleType; // user | admin
  status: UserStatusType; // active | suspended | deleted

  auths: IAuthEntry[];
  currency: SupportedCurrency;

  // IANA timezone string — used for grouping transactions by "day" correctly
  // regardless of where the server is deployed.
  timezone: SupportedTimezone;
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;

  // -------------------------------------------------------------------------
  // Instance methods
  // Declared here so TypeScript knows about them on any returned document.
  // -------------------------------------------------------------------------

  comparePassword(candidatePassword: string): Promise<boolean>;
  isLoginAllowed(): boolean;
  hasAuthProvider(provider: AuthProvider): boolean;
}

// ---------------------------------------------------------------------------
// Static methods on the Model constructor.
// Defined here so TypeScript can resolve them when called as User.findByEmail().
// ---------------------------------------------------------------------------
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// DTO shapes — what the HTTP layer accepts and what the service returns.
// ---------------------------------------------------------------------------

/** Payload accepted during registration. */
export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  currency?: SupportedCurrency;
  timezone?: SupportedTimezone;
}

/** Payload accepted during login. */
export interface ILoginPayload {
  email: string;
  password: string;
}

/** What the auth service returns after a successful login. */
export interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
}

/** Payload accepted when a user updates their own profile. */
export interface IUpdateProfilePayload {
  name?: string;
  avatarUrl?: string;
  currency?: SupportedCurrency;
  timezone?: SupportedTimezone;
}

/** Payload accepted when a user changes their password. */
export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Parsed query parameters for admin user list. */
export interface IUserQuery {
  role?: UserRoleType;
  status?: UserStatusType;
  searchTerm?: string; // matches name or email
  page?: number;
  limit?: number;
}

export type IUserPublicProfile = Omit<IUser, 'password'> & {
  id: string;
};

/** Admin analytics data response. */
export interface IUserAnalytics {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  deletedUsers: number;
  totalAdmins: number;
  systemStatus: 'healthy' | 'warning';
}
