"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, HandCoins, Tags, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/assets/khorcha_logo.png";

const data = {
  user: {
    name: "Dewan Shakib",
    email: "shakib.devv@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: <HandCoins />,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: <Tags />,
    },
    {
      title: "Account",
      url: "/dashboard/account",
      icon: <User />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/dashboard"
                className="absolute top-[0%] left-[0%] w-[30px] h-[25px] -ml-13"
              >
                <Image
                  src={logo}
                  fill
                  className="object-contain dark:invert"
                  alt="processi - brand logo"
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-10">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
