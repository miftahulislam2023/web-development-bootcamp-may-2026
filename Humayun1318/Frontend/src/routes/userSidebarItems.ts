// import CategoryPage from "@/pages/dashboard/User/CategoryPage";
// import { InsightPage } from "@/pages/dashboard/User/InsightPage";
// import Overview from "@/pages/dashboard/User/Overview";
// import PrivacyPage from "@/pages/dashboard/User/PrivacyPage";
// import ProfilePage from "@/pages/dashboard/User/ProfilePage";
// import RecurringPage from "@/pages/dashboard/User/RecurringPage";
// import SettingsPage from "@/pages/dashboard/User/SettingsPage";
// import TransactionPage from "@/pages/dashboard/User/TransactionPage";
// import { ISidebarItem } from "@/types";

// export const userSidebarItems: ISidebarItem[] = [
//   {
//     title: "Dashboard",
//     items: [
//       {
//         title: "Overview",
//         url: "/user/overview",
//         component: Overview,
//       },
//       {
//         title: "Categories",
//         url: "/user/categories",
//         component: CategoryPage,
//       },
//       {
//         title: "Transactions",
//         url: "/user/transactions",
//         component: TransactionPage,
//       },
//       {
//         title: "Recurring Transactions",
//         url: "/user/recurring",
//         component: RecurringPage,
//       },
//       {
//         title: "Insights",
//         url: "/user/insights",
//         component: InsightPage,
//       },
//     ],
//   },
//   {
//     title: "Account Management",
//     items: [
//       {
//         title: "Profile",
//         url: "/user/profile",
//         component: ProfilePage,
//       },
//       {
//         title: "Settings",
//         url: "/user/settings",
//         component: SettingsPage,
//       },
//       {
//         title: "Privacy",
//         url: "/user/privacy",
//         component: PrivacyPage,
//       },
//     ],
//   },
// ];
// utils/getSidebarItems.ts
import { 
  LayoutDashboard, 
  Tag, 
  Receipt, 
  Repeat, 
  TrendingUp, 
  User, 
  Settings, 
  Shield,
} from "lucide-react";
import CategoryPage from "@/pages/dashboard/User/CategoryPage";
import { InsightPage } from "@/pages/dashboard/User/InsightPage";
import Overview from "@/pages/dashboard/User/Overview";
import PrivacyPage from "@/pages/dashboard/User/PrivacyPage";
import ProfilePage from "@/pages/dashboard/User/ProfilePage";
import RecurringPage from "@/pages/dashboard/User/RecurringPage";
import SettingsPage from "@/pages/dashboard/User/SettingsPage";
import TransactionPage from "@/pages/dashboard/User/TransactionPage";
import { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/user/overview",
        component: Overview,
        icon: LayoutDashboard,
      },
      {
        title: "Categories",
        url: "/user/categories",
        component: CategoryPage,
        icon: Tag,
      },
      {
        title: "Transactions",
        url: "/user/transactions",
        component: TransactionPage,
        icon: Receipt,
      },
      {
        title: "Recurring Transactions",
        url: "/user/recurring",
        component: RecurringPage,
        icon: Repeat,
      },
      {
        title: "Insights",
        url: "/user/insights",
        component: InsightPage,
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Account Management",
    items: [
      {
        title: "Profile",
        url: "/user/profile",
        component: ProfilePage,
        icon: User,
      },
      {
        title: "Settings",
        url: "/user/settings",
        component: SettingsPage,
        icon: Settings,
      },
      {
        title: "Privacy",
        url: "/user/privacy",
        component: PrivacyPage,
        icon: Shield,
      },
    ],
  },
];