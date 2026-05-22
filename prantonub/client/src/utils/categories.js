export const CATEGORIES = [
  { name: "Food & Dining",     icon: "🍕", color: "#f97316" },
  { name: "Transportation",    icon: "🚗", color: "#3b82f6" },
  { name: "Shopping",          icon: "🛍️", color: "#ec4899" },
  { name: "Bills & Utilities", icon: "💡", color: "#eab308" },
  { name: "Healthcare",        icon: "💊", color: "#ef4444" },
  { name: "Entertainment",     icon: "🎬", color: "#8b5cf6" },
  { name: "Education",         icon: "📚", color: "#06b6d4" },
  { name: "Travel",            icon: "✈️", color: "#14b8a6" },
  { name: "Savings",           icon: "🏦", color: "#22c55e" },
  { name: "Salary",            icon: "💼", color: "#10b981" },
  { name: "Freelance",         icon: "💻", color: "#6366f1" },
  { name: "Other",             icon: "📦", color: "#94a3b8" },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.name, c]));

export const getCategoryIcon  = name => CATEGORY_MAP[name]?.icon  || "📦";
export const getCategoryColor = name => CATEGORY_MAP[name]?.color || "#94a3b8";

export const CURRENCIES = [
  { code: "USD", symbol: "$",  name: "US Dollar" },
  { code: "EUR", symbol: "€",  name: "Euro" },
  { code: "GBP", symbol: "£",  name: "British Pound" },
  { code: "BDT", symbol: "৳",  name: "Bangladeshi Taka" },
  { code: "INR", symbol: "₹",  name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥",  name: "Japanese Yen" },
  { code: "CNY", symbol: "¥",  name: "Chinese Yuan" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

export const getCurrencySymbol = code =>
  CURRENCIES.find(c => c.code === code)?.symbol || "$";

export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
