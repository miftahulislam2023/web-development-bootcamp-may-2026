// ---------------------------------------------------------------------------
// Transaction type — mirrors Category.type so a transaction can be validated
// against its category's ledger side.
// ---------------------------------------------------------------------------

export const TRANSACTION_SEARCHABLE_FIELDS = [
  'description',
  'referenceNote',
  'categoryName',
  'paymentMethod',
];

export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

// ---------------------------------------------------------------------------
// Payment method — the channel through which money moved.
// Stored as lowercase slugs for database consistency.
// ---------------------------------------------------------------------------
export const PAYMENT_METHOD = {
  CASH: 'cash',
  CARD: 'card',
  MOBILE_BANKING: 'mobile_banking',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  OTHER: 'other',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

// ---------------------------------------------------------------------------
// Sort fields — the set of fields a client is allowed to sort by.
// Whitelisting here prevents arbitrary sort injection.
// ---------------------------------------------------------------------------
export const TRANSACTION_SORT_FIELDS = [
  'date',
  'amount',
  'createdAt',
  '-date',
  '-amount',
  '-createdAt',
  'type',
  '-type',
  'categoyName',
  '-categoryName',
] as const;

export type TransactionSortField = (typeof TRANSACTION_SORT_FIELDS)[number];

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

// ---------------------------------------------------------------------------
// Pagination defaults
// ---------------------------------------------------------------------------
export const TRANSACTION_QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  SORT_FIELD: 'date' as TransactionSortField,
  SORT_ORDER: 'desc' as SortOrder,
} as const;

// ---------------------------------------------------------------------------
// Validation constraints
// ---------------------------------------------------------------------------
export const TRANSACTION_VALIDATION = {
  AMOUNT_MIN: 0.01,
  DESCRIPTION_MAX_LENGTH: 500,
  REFERENCE_NOTE_MAX_LENGTH: 200,
  TAGS_MAX_COUNT: 10,
  TAG_MAX_LENGTH: 30,
} as const;
