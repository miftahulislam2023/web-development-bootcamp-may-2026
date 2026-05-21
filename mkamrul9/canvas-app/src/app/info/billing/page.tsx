import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 relative overflow-hidden">
            <nav className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-8 flex items-center">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
            </nav>

            <main className="max-w-4xl mx-auto p-8 py-12 relative z-10">
                <h1 className="text-3xl font-extrabold mb-8">Billing & Subscription</h1>

                <div className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 border border-violet-500/30 rounded-3xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8"><CreditCard className="w-24 h-24 text-white/5" /></div>
                    <div className="inline-block bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">CURRENT PLAN</div>
                    <h2 className="text-4xl font-extrabold mb-2">Kidraw Pro <span className="text-xl text-slate-400 font-medium ml-2">Lifetime Access</span></h2>
                    <p className="text-slate-300 max-w-md mb-8">You are currently on the free builder tier. Enjoy unlimited boards, all shapes, and real-time collaboration forever.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Infinite Canvas</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Advanced Export (SVG/PNG)</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Real-time Cloud Sync</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Laser Presentation Tool</div>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
                    <p className="text-slate-400 text-sm mb-4">No payment methods are attached to your account because your current plan is 100% free.</p>
                    <Button variant="outline" className="bg-white/5 border-white/10">Add Payment Method</Button>
                </div>
            </main>
        </div>
    );
}