'use client';
import Link from "next/link";
import { ArrowLeft, Bell, Monitor, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function SettingsPage() {
    const [theme, setTheme] = useState('dark');
    const [emails, setEmails] = useState(true);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 relative overflow-hidden font-sans">
            <nav className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-8 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
            </nav>

            <main className="max-w-4xl mx-auto p-8 py-12 relative z-10">
                <h1 className="text-4xl font-extrabold mb-8 tracking-tight">System Settings</h1>

                <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4"><Monitor className="w-6 h-6 text-violet-400" /> <h3 className="text-xl font-bold">Preferences</h3></div>
                        <div className="flex items-center justify-between p-5 bg-[#06090F] rounded-xl border border-white/5">
                            <div><p className="font-bold text-white text-lg">Theme Mode</p><p className="text-sm text-slate-400">Kidraw defaults to Dark Aurora.</p></div>
                            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                                <Button onClick={() => { setTheme('dark'); toast.success("Dark theme enforced"); }} className={theme === 'dark' ? "bg-violet-600 text-white rounded-lg shadow-md" : "bg-transparent text-slate-400 hover:text-white"}>Dark Mode</Button>
                                <Button onClick={() => { toast.error("Light mode is currently in beta."); }} className={theme === 'light' ? "bg-violet-600 text-white rounded-lg shadow-md" : "bg-transparent text-slate-400 hover:text-white"}>Light Mode</Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4"><Bell className="w-6 h-6 text-amber-400" /> <h3 className="text-xl font-bold">Notifications</h3></div>
                        <div className="flex items-center justify-between p-5 bg-[#06090F] rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer" onClick={() => { setEmails(!emails); toast.success(emails ? "Emails Unsubscribed" : "Emails Subscribed"); }}>
                            <div><p className="font-bold text-white text-lg">Product Updates</p><p className="text-sm text-slate-400">Receive feature announcements and changelogs.</p></div>
                            <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${emails ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${emails ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-950/10 border border-red-500/20 rounded-3xl p-8 shadow-2xl shadow-red-900/10">
                        <div className="flex items-center gap-3 mb-4"><Lock className="w-6 h-6 text-red-400" /> <h3 className="text-xl font-bold text-red-400">Danger Zone</h3></div>
                        <p className="text-sm text-slate-400 mb-6 max-w-xl">Permanently delete your account and wipe all associated boards from the NeonDB database. This action is instantaneous and cannot be reversed.</p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl h-12 px-6 font-bold transition-all"><Trash2 className="w-4 h-4 mr-2" /> Delete Account</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0B0F19] border border-red-500/20 text-slate-50 sm:max-w-[450px]">
                                <DialogHeader><DialogTitle className="text-2xl font-bold text-red-400">Are you absolutely sure?</DialogTitle><DialogDescription className="text-slate-400">This will permanently delete your account and remove your data from our servers.</DialogDescription></DialogHeader>
                                <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
                                    <DialogTrigger asChild><Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl">Cancel</Button></DialogTrigger>
                                    <Button onClick={() => toast.error("Account deletion is disabled in this preview environment.")} className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold">Yes, Delete Everything</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </main>
        </div>
    );
}