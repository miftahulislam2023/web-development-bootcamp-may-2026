'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { ZoomIn, ZoomOut, Share2, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
                    className={`h-8 w-8 rounded-md transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${className}`}
                >
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white text-xs">{label}</TooltipContent>
        </Tooltip>
    );
}

export default function ZoomHUD() {
    const { zoom, setZoom, setCamera, layers, camera } = useCanvasStore();
    const [showMinimap, setShowMinimap] = useState(false);
    const [shareSetting, setShareSetting] = useState('VIEW');
    const [isDraggingMap, setIsDraggingMap] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 5));
    const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));
    const resetView = () => { setZoom(1); setCamera({ x: 0, y: 0 }); };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!", { description: "Share setting applied." });
    };

    const navigateMinimap = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const pctX = (e.clientX - rect.left) / rect.width;
        const pctY = (e.clientY - rect.top) / rect.height;
        setCamera({ x: -(pctX - 0.5) * 10000, y: -(pctY - 0.5) * 10000 });
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 bottom-6 left-6 flex flex-col gap-2">
                {showMinimap && (
                    <div className="bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-2 w-56 h-36 relative overflow-hidden select-none">
                        <div
                            className="absolute inset-0 m-4 border border-slate-700 bg-[#06090F] overflow-hidden rounded cursor-crosshair touch-none"
                            onPointerDown={(e) => { setIsDraggingMap(true); navigateMinimap(e); e.currentTarget.setPointerCapture(e.pointerId); }}
                            onPointerMove={(e) => { if (isDraggingMap) navigateMinimap(e); }}
                            onPointerUp={(e) => { setIsDraggingMap(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
                        >
                            {layers.map(layer => (
                                <div key={layer.id} className="absolute bg-violet-500/40 rounded-sm pointer-events-none" style={{ left: `${(layer.x / 10000) * 100 + 50}%`, top: `${(layer.y / 10000) * 100 + 50}%`, width: '4px', height: '4px' }} />
                            ))}
                            <div className="absolute border-2 border-violet-500 bg-violet-500/10 rounded pointer-events-none" style={{ left: `${(-camera.x / 10000) * 100 + 50}%`, top: `${(-camera.y / 10000) * 100 + 50}%`, width: `${(window.innerWidth / 10000) * 100 / zoom}%`, height: `${(window.innerHeight / 10000) * 100 / zoom}%`, transform: 'translate(-50%, -50%)' }} />
                        </div>
                    </div>
                )}

                <div className="bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-2 flex items-center gap-1">
                    <Dialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button variant="default" size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 mr-1 font-bold shadow-md"><Share2 className="w-3 h-3 mr-2" /> Share</Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white text-xs">Share Workspace</TooltipContent>
                        </Tooltip>
                        <DialogContent className="bg-[#0B0F19] border-slate-700 text-slate-50">
                            <DialogHeader><DialogTitle className="text-white">Share Workspace</DialogTitle></DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-300">Access Role:</span>
                                    <select className="border border-slate-700 bg-[#0B0F19] text-white rounded p-2 text-sm outline-none w-full" value={shareSetting} onChange={(e) => setShareSetting(e.target.value)}>
                                        <option value="VIEW">Viewer</option><option value="COMMENT">Commenter</option><option value="EDIT">Editor</option>
                                    </select>
                                </div>
                                <Button onClick={copyLink} className="w-full bg-violet-600 hover:bg-violet-700 text-white">Copy Link</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                    <ToolBtn icon={<MapIcon className="w-4 h-4" />} label="Toggle Minimap" onClick={() => setShowMinimap(!showMinimap)} isActive={showMinimap} />
                    <ToolBtn icon={<ZoomOut className="w-4 h-4" />} label="Zoom Out" onClick={handleZoomOut} />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-xs font-bold text-slate-300 w-12 text-center cursor-pointer hover:text-white select-none" onClick={resetView}>{Math.round(zoom * 100)}%</div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white text-xs">Reset View</TooltipContent>
                    </Tooltip>

                    <ToolBtn icon={<ZoomIn className="w-4 h-4" />} label="Zoom In" onClick={handleZoomIn} />
                </div>
            </div>
        </TooltipProvider>
    );
}