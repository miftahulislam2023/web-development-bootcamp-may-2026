const routeTitleMap: Record<string, string> = {
  overview: "Dashboard Overview",
  transactions: "Transactions",
  insights: "Insights",
  categories: "Categories",
  profile: "Profile",
  settings: "Settings",
  privacy: "Privacy",
};

export const getDashboardPageTitle = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const page = segments[1] || "overview";

  return routeTitleMap[page] || "Dashboard";
};