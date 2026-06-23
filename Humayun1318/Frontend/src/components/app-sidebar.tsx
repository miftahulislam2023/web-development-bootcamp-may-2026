// import * as React from "react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import { Link, useLocation } from "react-router";
// import { getSidebarItems } from "@/utils/getSidebarItems";
// import { Skeleton } from "./ui/skeleton";
// import { useUser } from "@/hooks/useUser";

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const location = useLocation();
//   const { user: userData, isLoading } = useUser();

//   const data = {
//     navMain: isLoading ? [] : getSidebarItems(userData?.role!),
//   };

//   const isActive = (url: string) => location.pathname === url;

//   return (
//     <Sidebar {...props}>
//       <SidebarHeader className="">
//         {/* Logo mark — always visible on the form side */}
//         <Link
//           to="/"
//           className="mb-8 flex items-center gap-2 hover:opacity-80 transition-opacity"
//         >
//           <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm font-bold shadow-sm">
//             $
//           </span>
//           <span className="text-sm font-bold tracking-wide text-foreground">
//             ExpenseTracker
//           </span>
//         </Link>
//       </SidebarHeader>
//       <SidebarContent>
//         {/* We create a SidebarGroup for each parent. */}
//         {isLoading ? (
//           <div className="space-y-3 p-4">
//             <Skeleton className="w-full h-6" />
//             <Skeleton className="h-4 w-3/4" />
//             <Skeleton className="h-4 w-3/4" />
//           </div>
//         ) : (
//           data.navMain.map((item) => (
//             <SidebarGroup key={item.title}>
//               <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
//               <SidebarGroupContent>
//                 <SidebarMenu>
//                   {item.items.map((item) => (
//                     <SidebarMenuItem key={item.title}>
//                       <SidebarMenuButton asChild isActive={isActive(item.url)}>
//                         <Link to={item.url}>{item.title}</Link>
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   ))}
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>
//           ))
//         )}
//       </SidebarContent>
//       <SidebarRail />
//     </Sidebar>
//   );
// }
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { Skeleton } from "./ui/skeleton";
import { useUser } from "@/hooks/useUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { user: userData, isLoading } = useUser();

  const data = {
    navMain: isLoading ? [] : getSidebarItems(userData?.role!),
  };

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm font-bold shadow-sm">
            $
          </span>
          <span className="text-sm font-bold tracking-wide text-foreground">
            ExpenseTracker
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="w-full h-6" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          data.navMain.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className="font-medium text-sm py-2.5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold hover:bg-muted/50"
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          {item.icon && (
                            <item.icon className="h-4 w-4 text-muted-foreground/70 group-data-[active=true]:text-primary" />
                          )}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
