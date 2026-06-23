import { ModeToggle } from "@/components/layout/ModeToggler";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getDashboardPageTitle } from "@/utils/getDashboardPageTitle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Settings,
  LogOut,
  UserCircle,
  Shield,
  BarChart3,
  Users,
  Flame,
} from "lucide-react";
import { getInitials } from "@/utils/getInitials";

export default function DashboardNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: userData, clearUser, isLoading } = useUser();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...", { position: "top-center" });

    try {
      await logout(undefined).unwrap();
      dispatch(authApi.util.resetApiState());

      clearUser();

      toast.success("Logged out successfully", {
        id: toastId,
        position: "top-center",
      });

      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to logout", {
        id: toastId,
        position: "top-center",
      });
    }
  };
  const pageTitle = getDashboardPageTitle(location.pathname);
  const isAdmin = userData?.role === "admin";
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>

        {/* MIDDLE → PAGE TITLE */}
        <div className="font-heading text-base lg:text-lg font-semibold">
          {pageTitle}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {userData?.email && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative cursor-pointer h-8 w-8 rounded-full p-0 border-4 border-primary hover:bg-muted/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm font-medium">
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 sm:w-64"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {userData.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isAdmin ? (
                  // Admin dropdown - only 3 routes
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/analytics")}
                      className="cursor-pointer"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Analytics</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/all-users")}
                      className="cursor-pointer"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>All Users</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/corn-job")}
                      className="cursor-pointer"
                    >
                      <Flame className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  // User dropdown - profile, settings, privacy
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate("/user/profile")}
                      className="cursor-pointer"
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/user/settings")}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/user/privacy")}
                      className="cursor-pointer"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Privacy Policy</span>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                {/* Logout button for both */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        {isLoading ? (
          <div className="space-y-6">
            {/* KPI Cards Skeleton - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                  <div className="h-px bg-border" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>

            {/* Charts Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Balance Trend Chart Skeleton - takes 2/3 width */}
              <div className="lg:col-span-2">
                <div className="rounded-xl border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-80 w-full rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Spending Breakdown Chart Skeleton */}
              <div>
                <div className="rounded-xl border bg-card p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
