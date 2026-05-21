'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Hand, Square, Circle, Pen, Undo, Redo, Type, Eraser, XSquare, Wand2, ImagePlus, Lasso, SquareDashed, Triangle, Diamond, Star, Hexagon, ArrowUpRight, Minus, Shapes } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// custom type for our custom button
// also used in actonToolbar. we can use the type in the type file to reuse this later
type ToolBtnProps = {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    className?: string;
    disabled?: boolean; // not in actionToolbar
};

// Our custom button component with custom props
function ToolBtn({ icon, label, onClick, isActive = false, className = "", disabled = false }: ToolBtnProps) {
    return (
        // wrapping the button with tooltip to show the label on hover
        <Tooltip>
            {/* using TooltipTrigger to trigger the tooltip on hover. asChild is used to pass the props to the child component  */}
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                    className={`w-10 h-10 rounded-lg transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'} ${className}`}
                >
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">{label}</TooltipContent>
        </Tooltip>
    );
}

type ActiveMenu = 'pen' | 'shape' | 'eraser' | 'select' | null;
type ToolName = 'select' | 'lasso' | 'hand' | 'pen' | 'shape' | 'text' | 'image' | 'eraser' | 'object-eraser' | 'comment' | 'laser';

// Main custom Toolbar component
export default function Toolbar() {
    const {
        activeTool,
        setActiveTool,
        undo,
        redo,
        historyStep,
        history,
        activeEraserType,
        setActiveEraserType,
        eraserSize,
        setEraserSize,
        activeShape,
        setActiveShape,
        penSize,
        setPenSize,
        isLocked,
    } = useCanvasStore();

    // state to manage which dropdown menu is open. null means no menu is open
    const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);

    // if menu was already open and user clicks the same tool, we close the menu. if user clicks a different tool, we open the new menu
    const toggleMenu = (menu: Exclude<ActiveMenu, null>) => setActiveMenu(activeMenu === menu ? null : menu);
    const closeMenu = () => setActiveMenu(null);
    const handleToolClick = (tool: ToolName) => {
        setActiveTool(tool);
        if (!['shape', 'pen', 'eraser', 'select'].includes(tool)) closeMenu();
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-[#0B0F19]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex items-center gap-1 p-1.5 transition-all">
                <div className="relative flex items-center">
                    <ToolBtn
                        icon={activeTool === 'lasso' ? <Lasso className="w-4 h-4" /> : activeTool === 'select' ? <SquareDashed className="w-4 h-4" /> : <MousePointer2 className="w-4 h-4" />}
                        label="Select Tools (V)"
                        onClick={() => { setActiveTool(activeTool === 'lasso' ? 'lasso' : 'select'); toggleMenu('select'); }}
                        isActive={activeTool === 'select' || activeTool === 'lasso'}
                    />
                    {activeMenu === 'select' && (
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 flex gap-1 min-w-[140px]">
                            <Button variant="ghost" size="sm" className={`flex-1 text-xs ${activeTool === 'select' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} onClick={() => { setActiveTool('select'); closeMenu(); }}><SquareDashed className="w-3 h-3 mr-1" /> Box</Button>
                            <Button variant="ghost" size="sm" className={`flex-1 text-xs ${activeTool === 'lasso' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} onClick={() => { setActiveTool('lasso'); closeMenu(); }}><Lasso className="w-3 h-3 mr-1" /> Lasso</Button>
                        </div>
                    )}
                </div>

                <ToolBtn icon={<Hand className="w-4 h-4" />} label="Pan Canvas (H)" onClick={() => handleToolClick('hand')} isActive={activeTool === 'hand'} />

                <div className="relative flex items-center">
                    <ToolBtn icon={<Pen className="w-4 h-4" />} label="Draw (P)" onClick={() => { setActiveTool('pen'); toggleMenu('pen'); }} isActive={activeTool === 'pen'} />
                    {activeMenu === 'pen' && (
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 flex items-center justify-around w-[120px]">
                            {[2, 4, 8].map((size) => (
                                <button key={size} onClick={() => setPenSize(size)} className={`rounded-full transition-all ${penSize === size ? 'bg-violet-500 ring-2 ring-violet-200' : 'bg-slate-600 hover:bg-slate-500'}`} style={{ width: size === 2 ? 10 : size === 4 ? 14 : 20, height: size === 2 ? 10 : size === 4 ? 14 : 20 }} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative flex items-center">
                    <ToolBtn icon={activeShape === 'rectangle' ? <Square className="w-4 h-4" /> : activeShape === 'ellipse' ? <Circle className="w-4 h-4" /> : <Shapes className="w-4 h-4" />} label="Shapes (S)" onClick={() => { setActiveTool('shape'); toggleMenu('shape'); }} isActive={activeTool === 'shape'} />
                    {activeMenu === 'shape' && (
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 grid grid-cols-4 gap-1 min-w-[160px]">
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('rectangle'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><Square className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('ellipse'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><Circle className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('triangle'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><Triangle className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('diamond'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><Diamond className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('star'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><Star className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('hexagon'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><Hexagon className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('arrow'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><ArrowUpRight className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveShape('straight-line'); closeMenu(); }} className="text-slate-400 hover:text-white hover:bg-white/10"><Minus className="w-4 h-4" /></Button>
                        </div>
                    )}
                </div>

                <ToolBtn icon={<Type className="w-4 h-4" />} label="Text (T)" onClick={() => handleToolClick('text')} isActive={activeTool === 'text'} />

                <ToolBtn
                    icon={<ImagePlus className="w-4 h-4" />}
                    label="Insert Image"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    isActive={activeTool === 'image'}
                />
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                                window.dispatchEvent(new CustomEvent('insert-image', { detail: ev.target?.result }));
                                setActiveTool('image');
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        }
                    }}
                />

                <ToolBtn icon={<Wand2 className="w-4 h-4" />} label="Laser Pointer" onClick={() => handleToolClick('laser')} isActive={activeTool === 'laser'} />

                <div className="relative flex items-center">
                    <ToolBtn icon={activeEraserType === 'object-eraser' ? <XSquare className="w-4 h-4" /> : <Eraser className="w-4 h-4" />} label="Eraser (E)" onClick={() => { setActiveTool(activeEraserType); toggleMenu('eraser'); }} isActive={activeTool === 'eraser' || activeTool === 'object-eraser'} />
                    {activeMenu === 'eraser' && (
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-2 flex flex-col gap-2 min-w-[140px]">
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className={`flex-1 text-xs ${activeEraserType === 'eraser' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} onClick={() => setActiveEraserType('eraser')}>
                                    Normal
                                </Button>
                                <Button variant="ghost" size="sm" className={`flex-1 text-xs ${activeEraserType === 'object-eraser' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} onClick={() => setActiveEraserType('object-eraser')}>
                                    Object
                                </Button>
                            </div>
                            {activeEraserType === 'eraser' && (
                                <div className="flex items-center justify-around py-1 mt-1">
                                    {[10, 20, 50].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setEraserSize(size)}
                                            className={`rounded-full transition-all ${eraserSize === size ? 'bg-violet-500 ring-2 ring-violet-300/40' : 'bg-white/20 hover:bg-white/30'}`}
                                            style={{ width: size === 10 ? 12 : size === 20 ? 18 : 24, height: size === 10 ? 12 : size === 20 ? 18 : 24 }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-[1px] h-8 bg-white/10 mx-1"></div>

                <ToolBtn icon={<Undo className="w-4 h-4" />} label="Undo" onClick={undo} disabled={historyStep === 0 || isLocked} />
                <ToolBtn icon={<Redo className="w-4 h-4" />} label="Redo" onClick={redo} disabled={historyStep === history.length - 1 || isLocked} />
            </div>
        </TooltipProvider>
    );
}