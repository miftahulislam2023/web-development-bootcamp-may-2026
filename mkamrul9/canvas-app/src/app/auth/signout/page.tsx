'use client';

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignOut() {
    return (
        <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center items-center relative overflow-hidden text-slate-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-sm bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl text-center">
                <div className="mx-auto bg-red-500/10 border border-red-500/20 p-4 rounded-full w-fit mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                    <LogOut className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Sign Out</h1>
                <p className="text-slate-400 text-sm mb-8">Are you sure you want to securely log out of your Kidraw workspace?</p>

                <div className="flex flex-col gap-3">
                    <Button onClick={() => signOut({ callbackUrl: '/' })} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg">
                        Yes, Sign me out
                    </Button>
                    <Link href="/">
                        <Button variant="ghost" className="w-full h-12 text-slate-400 hover:text-white hover:bg-white/5 font-medium rounded-xl">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Cancel and go back
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}