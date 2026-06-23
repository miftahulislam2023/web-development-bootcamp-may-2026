import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { UserProvider } from "@/providers/user.provider";
import DashboardNavbar from "../modules/dashboard/DashboardNavbar";

export default function DashboardLayout() {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        {/* <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 ">
            <Outlet />
          </div>
        </SidebarInset> */}
        <SidebarInset>
          <DashboardNavbar />
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
