// ---------------------------------------------------------------------------
// User roles
// ---------------------------------------------------------------------------
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// ---------------------------------------------------------------------------
// Account status
// ---------------------------------------------------------------------------
export const UserStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

// ---------------------------------------------------------------------------
// Supported currencies (ISO 4217 codes)
// ---------------------------------------------------------------------------
export const SUPPORTED_CURRENCIES = [
  'BDT',
  'USD',
  'EUR',
  'GBP',
  'INR',
  'AED',
  'SAR',
  'SGD',
  'CAD',
  'AUD',
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

// ---------------------------------------------------------------------------
// Supported timezones
// ---------------------------------------------------------------------------
export const SUPPORTED_TIMEZONES = [
  'Asia/Dhaka',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Australia/Sydney',
] as const;

export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number];

// ---------------------------------------------------------------------------
// Validation constraints
// ---------------------------------------------------------------------------
export const USER_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 60,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
  AVATAR_URL_MAX_LENGTH: 500,
} as const;

// ---------------------------------------------------------------------------
// Query defaults for paginated user lists (admin use).
// ---------------------------------------------------------------------------
export const USER_QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const USER_SEARCHABLE_FIELDS = ['name', 'email']