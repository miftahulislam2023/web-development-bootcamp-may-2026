'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BoardGrid({ boards }: { boards: any[] }) {
    const [showAll, setShowAll] = useState(false);

    const visibleBoards = showAll ? boards : boards.slice(0, 4);

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleBoards.map((board) => (
                    <Link key={board.id} href={`/board/${board.id}`} className="group block h-full">
                        <div className="bg-[#0F1523] rounded-3xl border border-white/5 shadow-2xl overflow-hidden hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] hover:border-violet-500/40 hover:bg-white/[0.05] transition-all duration-500 h-full flex flex-col group-hover:-translate-y-2 backdrop-blur-xl">
                            <div className="h-44 bg-[#0A0D14] border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full group-hover:bg-fuchsia-500/30 transition-colors duration-700"></div>
                                <LayoutDashboard className="w-12 h-12 text-slate-600 group-hover:text-violet-300 transition-colors z-10 drop-shadow-2xl" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col relative z-20">
                                <h3 className="font-bold text-white truncate text-xl mb-1 group-hover:text-violet-100 transition-colors">{board.title}</h3>
                                <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">{board.description || <span className="italic text-slate-600">No description provided.</span>}</p>
                                <div className="flex items-center justify-between mt-auto pt-6">
                                    <span className="text-xs font-semibold text-slate-400 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg">
                                        {new Date(board.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <div className="bg-white/5 p-2 rounded-lg border border-white/5 group-hover:bg-violet-600 group-hover:border-violet-500 transition-all shadow-lg">
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {boards.length > 4 && (
                <div className="mt-12 flex justify-center w-full">
                    <Button onClick={() => setShowAll(!showAll)} variant="outline" className="bg-transparent border-white/20 text-slate-300 hover:bg-white/10 hover:text-white rounded-full px-8 py-6 font-bold shadow-lg">
                        {showAll ? "Show Less" : `View All Workspaces (${boards.length})`}
                    </Button>
                </div>
            )}
        </div>
    );
}