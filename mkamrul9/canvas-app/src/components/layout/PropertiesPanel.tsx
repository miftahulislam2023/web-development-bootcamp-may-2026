'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Plus, Blend, Grid } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DEFAULT_COLORS = ['#0f172a', '#64748b', '#e11d48', '#d97706', '#059669', '#4f46e5', '#7c3aed', '#ffffff'];

type ToolBtnProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive: boolean;
};

function ToolBtn({ icon, label, onClick, isActive }: ToolBtnProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClick} className={`w-10 h-10 rounded-lg transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-slate-900 border-slate-700 text-white text-xs mr-2">{label}</TooltipContent>
        </Tooltip>
    );
}

export default function PropertiesPanel() {
    const { activeColor, setActiveColor, bgPattern, setBgPattern, backgroundColor, setBackgroundColor, customColors, addCustomColor, activeOpacity, setOpacity, selectedLayerId, updateLayer, saveHistory } = useCanvasStore();

    const [activeMenu, setActiveMenu] = useState<'opacity' | 'bg' | null>(null);

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const op = parseFloat(e.target.value);
        setOpacity(op);
        if (selectedLayerId) { updateLayer(selectedLayerId, { opacity: op }); saveHistory(); }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 right-6 top-1/2 -translate-y-1/2 bg-[#0B0F19] rounded-2xl shadow-2xl border border-slate-700 w-14 flex flex-col items-center py-3 gap-2 transition-all">
                <div className="relative w-full flex justify-center">
                    <ToolBtn icon={<Blend className="w-4 h-4" />} label="Opacity Settings" onClick={() => setActiveMenu(activeMenu === 'opacity' ? null : 'opacity')} isActive={activeMenu === 'opacity'} />
                    {activeMenu === 'opacity' && (
                        <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-4 w-56 flex flex-col gap-4 z-50">
                            <div className="flex justify-between items-center text-sm font-bold text-white border-b border-slate-800 pb-2">
                                <span>Opacity</span>
                                <span className="text-violet-400">{Math.round(activeOpacity * 100)}%</span>
                            </div>
                            <input type="range" min="0.1" max="1" step="0.05" value={activeOpacity} onChange={handleOpacityChange} className="w-full cursor-pointer accent-violet-500 h-2 bg-slate-800 rounded-lg appearance-none" />
                        </div>
                    )}
                </div>

                <div className="relative w-full flex justify-center">
                    <ToolBtn icon={<Grid className="w-4 h-4" />} label="Background Settings" onClick={() => setActiveMenu(activeMenu === 'bg' ? null : 'bg')} isActive={activeMenu === 'bg'} />
                    {activeMenu === 'bg' && (
                        <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-4 w-60 flex flex-col gap-4 z-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Canvas Pattern</span>
                            <div className="flex bg-[#05070B] p-1 rounded-lg border border-slate-800">
                                {['solid', 'dotted', 'grid'].map((pat) => (
                                    <button key={pat} onClick={() => setBgPattern(pat as 'solid' | 'dotted' | 'grid')} className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${bgPattern === pat ? 'bg-violet-600 shadow-md text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                                        {pat}
                                    </button>
                                ))}
                            </div>

                            <div className="h-[1px] bg-slate-800 w-full"></div>

                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Canvas Color</span>
                            <label className="w-full h-10 rounded-lg border-2 border-slate-700 cursor-pointer overflow-hidden relative shadow-inner hover:border-violet-500 transition-colors">
                                <div className="absolute inset-0" style={{ backgroundColor }}></div>
                                <input type="color" value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={(e) => setBackgroundColor(e.target.value)} />
                            </label>
                        </div>
                    )}
                </div>

                <div className="w-8 h-[1px] bg-slate-700 my-1"></div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <label className="relative w-8 h-8 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <div className="absolute inset-0 rounded-full bg-[conic-gradient(red,yellow,green,blue,magenta,red)] opacity-90"></div>
                            <div className="absolute inset-[3px] bg-[#0B0F19] rounded-full flex items-center justify-center"><Plus className="w-3 h-3 text-white" /></div>
                            <input type="color" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onInput={(e) => setActiveColor((e.target as HTMLInputElement).value)} onBlur={(e) => addCustomColor((e.target as HTMLInputElement).value)} />
                        </label>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-slate-900 border-slate-700 text-white text-xs mr-2">Custom Color</TooltipContent>
                </Tooltip>

                <div className="flex flex-col gap-2 mt-2">
                    {[...customColors, ...DEFAULT_COLORS].slice(0, 6).map((color, index) => (
                        <button key={`${color}-${index}`} onClick={() => setActiveColor(color)} className={`w-6 h-6 rounded-full border-2 transition-all shadow-md ${activeColor === color ? 'border-violet-500 scale-125' : 'border-slate-700 hover:scale-110'}`} style={{ backgroundColor: color }} />
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
}