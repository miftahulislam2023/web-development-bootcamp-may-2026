'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Download, Cloud, RefreshCcw, Lock, Unlock, Image as ImageIcon, FileImage, PenTool } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ToolBtnProps = {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    className?: string;
};

function ToolBtn({ icon, label, onClick, isActive = false, className = "" }: ToolBtnProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    className={`w-10 h-10 rounded-lg transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${className}`}
                >
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">{label}</TooltipContent>
        </Tooltip>
    );
}

export default function ActionToolbar() {
    const { activeTool, setActiveTool, clear, saveToCloud, isSaving, boardId, isLocked, toggleLock } = useCanvasStore();
    const [resetOpen, setResetOpen] = useState(false);

    const handleExport = (format: 'png' | 'jpeg' | 'svg') => {
        window.dispatchEvent(new CustomEvent('export-canvas', { detail: format }));
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 top-6 right-6 bg-[#0B0F19] rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-1 p-1.5 transition-all">
                <ToolBtn icon={<MessageSquare className="w-4 h-4" />} label="Add Comment (C)" onClick={() => setActiveTool('comment')} isActive={activeTool === 'comment'} />
                <ToolBtn icon={isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />} label={isLocked ? "Unlock Board" : "Lock Board"} onClick={toggleLock} isActive={isLocked} className={isLocked ? "!bg-amber-500 !text-white" : ""} />

                <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>

                {/* CUSTOM RESET DIALOG */}
                <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                    <Tooltip><TooltipTrigger asChild><DialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLocked} className="w-10 h-10 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"><RefreshCcw className="w-4 h-4" /></Button>
                    </DialogTrigger></TooltipTrigger><TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">Reset Board</TooltipContent></Tooltip>

                    <DialogContent className="bg-[#0B0F19] border border-white/10 text-slate-50 sm:max-w-[450px] shadow-[0_0_100px_rgba(239,68,68,0.15)] rounded-2xl p-0 overflow-hidden">
                        <DialogHeader className="px-6 pt-6 mb-2">
                            <DialogTitle className="text-2xl font-bold text-white">Reset Workspace?</DialogTitle>
                            <DialogDescription className="text-slate-400">This will permanently clear all shapes, images, and text from the canvas. This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="px-6 py-4 border-t border-white/5 bg-[#05070B] flex gap-2 sm:justify-end">
                            <Button variant="ghost" onClick={() => setResetOpen(false)} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl">Cancel</Button>
                            <Button onClick={() => { clear(); setResetOpen(false); toast.success("Workspace reset."); }} className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold">Yes, Reset Canvas</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"><Download className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">Export Board</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="w-40 bg-[#0B0F19] border-slate-700 text-slate-300">
                        <DropdownMenuItem onClick={() => handleExport('png')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><ImageIcon className="w-4 h-4 mr-2" /> PNG Image</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('jpeg')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><FileImage className="w-4 h-4 mr-2" /> JPEG Image</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('svg')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><PenTool className="w-4 h-4 mr-2" /> SVG Vector</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ToolBtn icon={<Cloud className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />} label={isSaving ? "Saving..." : "Save to Cloud"} onClick={() => boardId && saveToCloud(boardId)} className="hover:!text-blue-400 hover:!bg-blue-500/10" />
            </div>
        </TooltipProvider>
    );
}