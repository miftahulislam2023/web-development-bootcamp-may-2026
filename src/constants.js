import {
  FiCoffee,
  FiTruck,
  FiShoppingBag,
  FiActivity,
  FiStar,
  FiCreditCard,
  FiMonitor,
  FiMoreHorizontal,
} from "react-icons/fi";

/* ── API base URL ── */
export const API_URL = import.meta.env.VITE_API_URL;

/* ── Categories ── */
/* `icon` = emoji (charts/pills), `Icon` = react-icon component (AddExpense grid) */
export const CATEGORIES = [
  { name: "Food",          icon: "🍕", color: "#e11d48", Icon: FiCoffee        },
  { name: "Transport",     icon: "🚗", color: "#f59e0b", Icon: FiTruck         },
  { name: "Shopping",      icon: "🛒", color: "#8b5cf6", Icon: FiShoppingBag   },
  { name: "Health",        icon: "❤️",  color: "#10b981", Icon: FiActivity      },
  { name: "Sport",         icon: "🏀", color: "#3b82f6", Icon: FiStar          },
  { name: "Bills",         icon: "🧾", color: "#f97316", Icon: FiCreditCard    },
  { name: "Entertainment", icon: "🎮", color: "#ec4899", Icon: FiMonitor       },
  { name: "Other",         icon: "•",  color: "#6b7280", Icon: FiMoreHorizontal },
];

export const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];