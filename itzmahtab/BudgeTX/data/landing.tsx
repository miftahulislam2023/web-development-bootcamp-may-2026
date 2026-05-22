import {
  BarChart3,
  Wallet,
  PieChart,
  ArrowRightLeft,
  Bell,
  TrendingUp,
} from "lucide-react";

export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Track Every Penny",
    description:
      "Log expenses and income in seconds. See where your money goes with clean charts and reports.",
  },
  {
    icon: <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Multi-Account Dashboard",
    description:
      "Manage all your accounts — checking, savings, credit cards — from one place.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Smart Budgeting",
    description:
      "Set monthly budgets and get gentle nudges before you overspend.",
  },
  {
    icon: <ArrowRightLeft className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Recurring Transactions",
    description:
      "Set it and forget it. BudgeTX handles your rent, subscriptions, and bills automatically.",
  },
  {
    icon: <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Friendly Alerts",
    description:
      "Get email reminders when you're close to your budget limit — no surprises.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Monthly Reports",
    description:
      "A simple breakdown of your month — income, expenses, and where you can improve.",
  },
];

export const howItWorksData = [
  {
    icon: <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "1. Create an Account",
    description:
      "Sign up in under a minute. No credit card needed — just your name and email.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "2. Add Your First Transaction",
    description:
      "Log an expense or income. Categorize it, pick an account, and you're off.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "3. Watch Your Progress",
    description:
      "See your spending habits take shape. Adjust budgets, set goals, stay on track.",
  },
];

export const testimonialsData = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    role: "Small Business Owner",
    quote: "Finally, a finance tool that doesn't overcomplicate things. I track everything in minutes.",
    borderColor: "border-l-blue-500",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    initials: "MC",
    name: "Michael Chen",
    role: "Freelancer",
    quote: "The recurring transaction feature is a lifesaver. My subscriptions and invoices auto-track.",
    borderColor: "border-l-purple-500",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    initials: "ER",
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    quote: "I recommend BudgeTX to clients who want simplicity. The multi-account setup and alerts are perfect.",
    borderColor: "border-l-cyan-500",
    gradient: "from-cyan-500 to-blue-600",
  },
];


