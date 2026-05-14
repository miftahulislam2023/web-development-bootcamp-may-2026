export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Bills & Utilities",
  "Healthcare",
  "Entertainment",
  "Education",
  "Travel",
  "Savings",
  "Salary",
  "Other",
];

// Icon emojis for categories
export const CATEGORY_ICON_NAMES = {
  "Food & Dining": "🍗",
  Transportation: "🚗",
  Shopping: "🛍️",
  "Bills & Utilities": "💡",
  Healthcare: "💊",
  Entertainment: "🎬",
  Education: "🎓",
  Travel: "✈️",
  Savings: "🏦",
  Salary: "💰",
  Other: "📦",
};

// Legacy export for backward compatibility
export const CATEGORY_ICONS = CATEGORY_ICON_NAMES;

export const CATEGORY_COLORS = {
  "Food & Dining": "#f59e0b",
  Transportation: "#3b82f6",
  Shopping: "#ec4899",
  "Bills & Utilities": "#6366f1",
  Healthcare: "#10b981",
  Entertainment: "#f97316",
  Education: "#8b5cf6",
  Travel: "#06b6d4",
  Savings: "#059669",
  Salary: "#22c55e",
  Other: "#94a3b8",
};

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "BDT",
  "INR",
  "CAD",
  "AUD",
  "JPY",
  "SGD",
  "AED",
];

export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BDT: "৳",
  INR: "₹",
  CAD: "CA$",
  AUD: "A$",
  JPY: "¥",
  SGD: "S$",
  AED: "د.إ",
};

export const formatCurrency = (amount, currency = "USD") => {
  const sym = CURRENCY_SYMBOLS[currency] || "$";
  return `${sym}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const pctChange = (curr, prev) => {
  if (!prev) return null;
  return (((curr - prev) / prev) * 100).toFixed(1);
};
