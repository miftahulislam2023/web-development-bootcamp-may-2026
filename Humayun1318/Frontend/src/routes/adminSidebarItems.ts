import { ISidebarItem } from "@/types";
import { lazy } from "react";
import {
  Users,
  Flame,
  BarChart3,
} from "lucide-react";

const AnalyticsPage = lazy(() => import("@/pages/dashboard/Admin/AnalyticsPage"));
const AllUsersPage = lazy(() => import("@/pages/dashboard/Admin/AllUsersPage"));
const CornJobPage = lazy(() => import("@/pages/dashboard/Admin/CornJobPage"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: AnalyticsPage,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        url: "/admin/all-users",
        component: AllUsersPage,
        icon: Users,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Corn Job",
        url: "/admin/corn-job",
        component: CornJobPage,
        icon: Flame,
      },
    ],
  },
];