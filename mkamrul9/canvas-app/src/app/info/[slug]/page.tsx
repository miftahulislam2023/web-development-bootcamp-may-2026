import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    // Convert slug like "privacy-policy" to "Privacy Policy"
    const title = resolvedParams.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none"></div>

            <nav className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-8 flex items-center">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Kidraw
                </Link>
            </nav>

            <main className="flex-1 max-w-3xl w-full mx-auto p-8 py-20 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-fuchsia-300 mb-6">
                    <Sparkles className="w-3 h-3" /> Kidraw Legal & Info
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-8">{title}</h1>

                <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-slate-400 text-lg leading-relaxed">
                        This is a placeholder page for <strong>{title}</strong>. In a production environment, this page would contain the official documentation, terms, or guidelines associated with this topic.
                    </p>
                    <div className="h-[1px] bg-white/10 my-8 w-full"></div>
                    <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </main>
        </div>
    );
}