export const CATEGORY_SEARCHABLE_FIELDS = ['name', 'type'];
export const CATEGORY_SORT_FIELDS = [
  'name',
  '-name',
  'createdAt',
  '-createdAt',
  'type',
  '-type',
] as const;
// ---------------------------------------------------------------------------
// Transaction direction — a category always belongs to one side of the ledger.
// Stored as a string in MongoDB so queries remain human-readable in Atlas.
// ---------------------------------------------------------------------------
export const CATEGORY_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type CategoryType = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

// ---------------------------------------------------------------------------
// System-seeded category icon slugs.
// These slugs are mapped to icon components on the frontend.
// Keeping them here prevents frontend/backend drift.
// ---------------------------------------------------------------------------
export const CATEGORY_ICON = {
  FOOD: 'food',
  RENT: 'rent',
  TRAVEL: 'travel',
  HEALTH: 'health',
  SHOPPING: 'shopping',
  ENTERTAINMENT: 'entertainment',
  EDUCATION: 'education',
  UTILITIES: 'utilities',
  SALARY: 'salary',
  BUSINESS: 'business',
  INVESTMENT: 'investment',
  GIFT: 'gift',
  OTHER: 'other',
} as const;

export type CategoryIcon = (typeof CATEGORY_ICON)[keyof typeof CATEGORY_ICON];

// ---------------------------------------------------------------------------
// Default hex colors for system categories.
// A named map keeps the seed script DRY and avoids magic strings.
// ---------------------------------------------------------------------------
export const CATEGORY_DEFAULT_COLORS: Record<string, string> = {
  food: '#EF9F27',
  rent: '#7F77DD',
  travel: '#1D9E75',
  health: '#E24B4A',
  shopping: '#D4537E',
  entertainment: '#5DCAA5',
  education: '#378ADD',
  utilities: '#888780',
  salary: '#639922',
  business: '#0F6E56',
  investment: '#3C3489',
  gift: '#D85A30',
  other: '#B4B2A9',
};

// ---------------------------------------------------------------------------
// Query defaults — prevents unbounded list queries at the service layer.
// ---------------------------------------------------------------------------
export const CATEGORY_QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 50,
  MAX_LIMIT: 100,
} as const;

// ---------------------------------------------------------------------------
// Validation constraints — shared by both the Mongoose schema and Zod schemas
// so there is exactly one authoritative source for every constraint.
// ---------------------------------------------------------------------------
export const CATEGORY_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  COLOR_HEX_REGEX: /^#([0-9A-Fa-f]{3}){1,2}$/,
} as const;

// ---------------------------------------------------------------------------
// System categories — seeded into the database on app startup if not already present.
// These are the default categories every user starts with; they can create their
// own custom categories in addition to these, but cannot modify or delete these.
// ---------------------------------------------------------------------------

export const systemCategories = [
  // ─────────────────────────────
  // Expense Categories
  // ─────────────────────────────
  {
    name: 'Food & Dining',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.FOOD,
    colorHex: CATEGORY_DEFAULT_COLORS.food,
    isSystem: true,
  },

  {
    name: 'Rent',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.RENT,
    colorHex: CATEGORY_DEFAULT_COLORS.rent,
    isSystem: true,
  },

  {
    name: 'Transportation',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.TRAVEL,
    colorHex: CATEGORY_DEFAULT_COLORS.travel,
    isSystem: true,
  },

  {
    name: 'Healthcare',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.HEALTH,
    colorHex: CATEGORY_DEFAULT_COLORS.health,
    isSystem: true,
  },

  {
    name: 'Shopping',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.SHOPPING,
    colorHex: CATEGORY_DEFAULT_COLORS.shopping,
    isSystem: true,
  },

  {
    name: 'Entertainment',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.ENTERTAINMENT,
    colorHex: CATEGORY_DEFAULT_COLORS.entertainment,
    isSystem: true,
  },

  {
    name: 'Education',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.EDUCATION,
    colorHex: CATEGORY_DEFAULT_COLORS.education,
    isSystem: true,
  },

  {
    name: 'Utilities',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.UTILITIES,
    colorHex: CATEGORY_DEFAULT_COLORS.utilities,
    isSystem: true,
  },

  {
    name: 'Gift & Donations',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.GIFT,
    colorHex: CATEGORY_DEFAULT_COLORS.gift,
    isSystem: true,
  },

  {
    name: 'Business Expense',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.BUSINESS,
    colorHex: CATEGORY_DEFAULT_COLORS.business,
    isSystem: true,
  },

  {
    name: 'Other Expense',
    type: CATEGORY_TYPE.EXPENSE,
    icon: CATEGORY_ICON.OTHER,
    colorHex: CATEGORY_DEFAULT_COLORS.other,
    isSystem: true,
  },

  // ─────────────────────────────
  // Income Categories
  // ─────────────────────────────
  {
    name: 'Salary',
    type: CATEGORY_TYPE.INCOME,
    icon: CATEGORY_ICON.SALARY,
    colorHex: CATEGORY_DEFAULT_COLORS.salary,
    isSystem: true,
  },

  {
    name: 'Freelance Income',
    type: CATEGORY_TYPE.INCOME,
    icon: CATEGORY_ICON.BUSINESS,
    colorHex: CATEGORY_DEFAULT_COLORS.business,
    isSystem: true,
  },

  {
    name: 'Investment Return',
    type: CATEGORY_TYPE.INCOME,
    icon: CATEGORY_ICON.INVESTMENT,
    colorHex: CATEGORY_DEFAULT_COLORS.investment,
    isSystem: true,
  },

  {
    name: 'Gift Received',
    type: CATEGORY_TYPE.INCOME,
    icon: CATEGORY_ICON.GIFT,
    colorHex: CATEGORY_DEFAULT_COLORS.gift,
    isSystem: true,
  },

  {
    name: 'Other Income',
    type: CATEGORY_TYPE.INCOME,
    icon: CATEGORY_ICON.OTHER,
    colorHex: CATEGORY_DEFAULT_COLORS.other,
    isSystem: true,
  },
];
