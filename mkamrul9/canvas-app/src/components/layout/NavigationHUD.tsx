'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles, User, Settings, LayoutDashboard, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function NavigationHUD() {
    const { data: session } = useSession();
    if (!session?.user) return null;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 top-6 left-6 flex items-center gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/?view=landing" className="flex items-center gap-2 bg-[#0B0F19] px-4 py-2 rounded-xl shadow-2xl border border-slate-700 hover:bg-slate-900 hover:scale-105 transition-all">
                            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1.5 rounded-lg"><Sparkles className="w-4 h-4 text-white" /></div>
                            <span className="font-extrabold text-white tracking-tight">Kidraw</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">View Homepage</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="h-10 w-10 border-2 border-slate-700 shadow-2xl ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                                    <AvatarImage src={session.user.image || ""} />
                                    <AvatarFallback className="bg-slate-800 text-violet-400 font-bold">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">Account & Navigation</TooltipContent>
                    </Tooltip>

                    <DropdownMenuContent align="start" className="w-64 p-2 rounded-xl bg-[#0B0F19] border-slate-700 text-slate-50 shadow-2xl">
                        <DropdownMenuLabel className="font-normal pb-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                                <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard</DropdownMenuItem></Link>
                            <Link href="/?view=landing"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Sparkles className="w-4 h-4 mr-2" /> Landing Page</DropdownMenuItem></Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/info/profile"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem></Link>
                            <Link href="/info/settings"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem></Link>
                            <Link href="/info/billing"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem></Link>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TooltipProvider>
    );
}