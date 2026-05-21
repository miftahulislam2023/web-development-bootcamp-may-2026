'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Shield, Key, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");

    const handleSave = () => {
        setIsEditing(false);
        toast.success("Profile updated!", { description: "Your changes have been saved successfully." });
    };

    const handleAvatarClick = () => {
        toast.info("Avatar managed by OAuth provider", { description: "Change your avatar on GitHub or Google to see it updated here." });
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-violet-600/10 blur-[150px] pointer-events-none"></div>

            <nav className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-8 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
            </nav>

            <main className="max-w-4xl mx-auto p-8 py-12 relative z-10">
                <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Personal Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Identity Column */}
                    <div className="col-span-1">
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none"></div>

                            <div className="relative group cursor-pointer mb-4" onClick={handleAvatarClick}>
                                <Avatar className="h-28 w-28 border-4 border-[#0B0F19] shadow-2xl ring-2 ring-violet-500/30 group-hover:ring-violet-500 transition-all">
                                    <AvatarImage src={session?.user?.image || ""} />
                                    <AvatarFallback className="bg-slate-800 text-violet-400 font-bold text-3xl">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{session?.user?.name}</h2>
                            <p className="text-violet-400 text-sm font-medium mb-6">Pro Member</p>
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                                <h3 className="text-xl font-bold">Account Details</h3>
                                <Button onClick={isEditing ? handleSave : () => setIsEditing(true)} className={isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg" : "bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl"}>
                                    {isEditing ? "Save Changes" : "Edit Profile"}
                                </Button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-2"><User className="w-4 h-4 text-violet-400" /> Full Name</label>
                                    <input disabled={!isEditing} value={name} onChange={(e) => setName(e.target.value)} className={`w-full bg-[#06090F] rounded-xl p-4 text-white transition-all ${isEditing ? 'border border-violet-500 ring-2 ring-violet-500/20' : 'border border-white/5 opacity-70 cursor-not-allowed'}`} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-fuchsia-400" /> Email Address</label>
                                    <div className="relative">
                                        <input disabled value={session?.user?.email || ""} className="w-full bg-[#06090F] border border-white/5 rounded-xl p-4 text-slate-400 cursor-not-allowed" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase bg-white/5 px-2 py-1 rounded">Locked</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Security Validation</h3>
                            <div className="flex justify-between items-center bg-[#06090F] border border-white/5 rounded-xl p-5">
                                <div className="flex items-center gap-4">
                                    <div className="bg-amber-500/10 p-3 rounded-full border border-amber-500/20"><Key className="w-6 h-6 text-amber-400" /></div>
                                    <div><p className="font-bold text-white text-lg">OAuth Secured</p><p className="text-sm text-slate-400">Authentication is managed externally by your provider.</p></div>
                                </div>
                                <Shield className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}