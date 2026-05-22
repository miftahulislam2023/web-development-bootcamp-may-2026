import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, FileText, Trash2, Tag, Search, StickyNote, BookOpen, Clock,
    Pin, PinOff, CheckSquare, Eye, EyeOff, Bold, Italic, Heading,
    ChevronRight, ChevronDown, Calendar, AlertCircle, Sparkles, Filter,
    Check, List, ListChecks, Copy, Edit3, Loader2, Send, X,
    Archive, ArchiveRestore, Palette, MoreHorizontal, MoreVertical, Undo2, ArrowUpDown, Maximize2, Image as ImageIcon, SlidersHorizontal
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { uploadImage } from "../services/imageUpload";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo/SEO";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotes, Note, NoteColor, NOTE_COLORS } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";
import { enhanceNoteWithAI } from "@/ai/notes/enhanceNote";

// ===== NOTE VIEW (Sidebar Modes) =====
type ViewMode = "notes" | "archive" | "trash";
type SortMode = "newest" | "oldest" | "title-asc" | "title-desc";

const TAG_COLORS = [
    "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/20",
    "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
    "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20",
    "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/20",
    "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/20",
];

const TEXT_COLORS: Record<string, string> = {
    red: "text-red-600 dark:text-red-400",
    orange: "text-orange-600 dark:text-orange-400",
    amber: "text-amber-600 dark:text-amber-400",
    green: "text-green-600 dark:text-green-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    teal: "text-teal-600 dark:text-teal-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
    blue: "text-blue-600 dark:text-blue-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    violet: "text-violet-600 dark:text-violet-400",
    purple: "text-purple-600 dark:text-purple-400",
    fuchsia: "text-fuchsia-600 dark:text-fuchsia-400",
    pink: "text-pink-600 dark:text-pink-400",
    rose: "text-rose-600 dark:text-rose-400",
};

function getTagColor(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

// ===== CHECKLIST HELPERS =====
function toggleChecklistItem(content: string, index: number): string {
    const lines = content.split("\n");
    let checkIdx = 0;
    return lines.map(line => {
        const match = line.match(/^(\s*[-*]\s*\[)([ xX])(\]\s*.*)/);
        if (match) {
            if (checkIdx === index) {
                checkIdx++;
                const newState = match[2] === " " ? "x" : " ";
                return match[1] + newState + match[3];
            }
            checkIdx++;
        }
        return line;
    }).join("\n");
}

function getChecklistStats(content: string): { total: number; checked: number } | null {
    const total = (content.match(/\[[ xX]\]/g) || []).length;
    const checked = (content.match(/\[[xX]\]/g) || []).length;
    if (total === 0) return null;
    return { total, checked };
}

// ===== RICH NOTE VIEW =====
function RichNoteView({ content, onToggleCheckbox }: { content: string; onToggleCheckbox?: (index: number) => void }) {
    const lines = content.split("\n");
    let checkIdx = 0;

    return (
        <div className="space-y-0.5">
            {lines.map((line, i) => {
                const checkMatch = line.match(/^\s*[-*]\s*\[([ xX])\]\s*(.*)/);
                if (checkMatch) {
                    const idx = checkIdx++;
                    const checked = checkMatch[1] !== " ";
                    return (
                        <div key={i} className="flex items-start gap-2.5 py-1 group select-none">
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); onToggleCheckbox?.(idx); }}
                                className={cn(
                                    "mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0",
                                    checked
                                        ? "bg-primary border-primary shadow-sm shadow-primary/20"
                                        : "border-muted-foreground/30 hover:border-primary/50 bg-background"
                                )}
                            >
                                <AnimatePresence>
                                    {checked && (
                                        <motion.div
                                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            <span
                                onClick={(e) => { e.stopPropagation(); onToggleCheckbox?.(idx); }}
                                className={cn(
                                    "text-sm flex-1 cursor-pointer transition-all duration-300",
                                    checked ? "line-through text-muted-foreground/50" : "text-foreground/90"
                                )}
                            >
                                {renderInlineFormatting(checkMatch[2])}
                            </span>
                        </div>
                    );
                }

                const h1Match = line.match(/^#\s+(.*)/);
                if (h1Match) return <h2 key={i} className="text-base font-bold mt-2 mb-0.5">{renderInlineFormatting(h1Match[1])}</h2>;
                const h2Match = line.match(/^##\s+(.*)/);
                if (h2Match) return <h3 key={i} className="text-sm font-semibold mt-1.5 mb-0.5">{renderInlineFormatting(h2Match[1])}</h3>;
                const h3Match = line.match(/^###\s+(.*)/);
                if (h3Match) return <h4 key={i} className="text-xs font-bold mt-1 mb-0.5 text-foreground/80">{renderInlineFormatting(h3Match[1])}</h4>;
                const h4Match = line.match(/^####\s+(.*)/);
                if (h4Match) return <h5 key={i} className="text-[11px] font-bold mt-1 mb-0.5 text-foreground/70">{renderInlineFormatting(h4Match[1])}</h5>;
                const h5Match = line.match(/^#####\s+(.*)/);
                if (h5Match) return <h6 key={i} className="text-[10px] font-bold mt-1 mb-0.5 text-foreground/60 uppercase tracking-wider">{renderInlineFormatting(h5Match[1])}</h6>;
                const h6Match = line.match(/^######\s+(.*)/);
                if (h6Match) return <h6 key={i} className="text-[10px] font-medium mt-1 mb-0.5 text-foreground/50 uppercase tracing-widest">{renderInlineFormatting(h6Match[1])}</h6>;

                const bulletMatch = line.match(/^\s*[-*]\s+(.*)/);
                if (bulletMatch) {
                    return (
                        <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
                            <span className="text-muted-foreground mt-1 shrink-0 text-[8px]">●</span>
                            <span className="text-sm">{renderInlineFormatting(bulletMatch[1])}</span>
                        </div>
                    );
                }

                if (!line.trim()) return <div key={i} className="h-1.5" />;
                return <p key={i} className="text-sm py-0.5 leading-relaxed">{renderInlineFormatting(line)}</p>;
            })}
        </div>
    );
}

// ===== INLINE FORMATTING =====
function renderInlineFormatting(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
        if (boldMatch) {
            if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
            parts.push(<strong key={key++} className="font-bold">{boldMatch[2]}</strong>);
            remaining = boldMatch[3]; continue;
        }
        const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)/s);
        if (italicMatch) {
            if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>);
            parts.push(<em key={key++} className="italic">{italicMatch[2]}</em>);
            remaining = italicMatch[3]; continue;
        }
        const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)/s);
        if (codeMatch) {
            if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>);
            parts.push(<code key={key++} className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">{codeMatch[2]}</code>);
            remaining = codeMatch[3]; continue;
        }
        const colorMatch = remaining.match(/^(.*?)<c:([a-z]+)>(.*?)<\/c>(.*)/s);
        if (colorMatch) {
            if (colorMatch[1]) parts.push(<span key={key++}>{colorMatch[1]}</span>);
            const colorClass = TEXT_COLORS[colorMatch[2]] || "text-foreground";
            parts.push(<span key={key++} className={cn("font-medium", colorClass)}>{colorMatch[3]}</span>);
            remaining = colorMatch[4]; continue;
        }
        const imgMatch = remaining.match(/^(.*?)!\[(.*?)\]\((.*?)\)(.*)/s);
        if (imgMatch) {
            if (imgMatch[1]) parts.push(<span key={key++}>{imgMatch[1]}</span>);
            parts.push(
                <img
                    key={key++}
                    src={imgMatch[3]}
                    alt={imgMatch[2]}
                    className="max-w-full h-auto rounded-lg my-2 border border-border/50 shadow-sm"
                    loading="lazy"
                />
            );
            remaining = imgMatch[4]; continue;
        }
        parts.push(<span key={key++}>{remaining}</span>);
        break;
    }
    return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// ===== HIDDEN SYNTAX (for editor) =====
function HiddenSyntax({ children }: { children: React.ReactNode }) {
    return <span className="text-muted-foreground/30 text-[10px] select-none" aria-hidden="true">{children}</span>;
}

function renderEditorLine(text: string, onToggle?: (idxInLine: number) => void) {
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    const checklistRegex = /([-*]\s*)\[([ xX])\]/g;
    let checkMatch;

    while ((checkMatch = checklistRegex.exec(text)) !== null) {
        parts.push(renderFormatting(text.substring(lastIdx, checkMatch.index)));
        const prefix = checkMatch[1];
        const char = checkMatch[2];
        const checked = char.toLowerCase() === "x";
        const matchIdx = checkMatch.index;

        parts.push(<HiddenSyntax key={`prefix-${matchIdx}`}>{prefix}</HiddenSyntax>);
        parts.push(<HiddenSyntax key={`bracket-l-${matchIdx}`}>[</HiddenSyntax>);
        parts.push(
            <span key={`circle-${matchIdx}`} className="relative group">
                <span className="text-transparent select-none" aria-hidden="true">{char}</span>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onToggle) onToggle(matchIdx + prefix.length + 1); }}
                    style={{ width: '14px', height: '14px', borderRadius: '50%', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    className={cn(
                        "border flex items-center justify-center transition-all hover:scale-110 active:scale-95 pointer-events-auto p-0",
                        checked ? "bg-primary border-primary shadow-sm" : "border-muted-foreground/40 bg-background/50"
                    )}
                >
                    {checked && <Check className="w-2.5 h-2.5 text-primary-foreground stroke-[3]" />}
                </button>
            </span>
        );
        parts.push(<HiddenSyntax key={`bracket-r-${matchIdx}`}>]</HiddenSyntax>);
        lastIdx = checklistRegex.lastIndex;
    }

    parts.push(renderFormatting(text.substring(lastIdx)));
    return parts;
}

function renderFormatting(text: string) {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    const headingMatch = remaining.match(/^(#{1,6}\s)/);
    if (headingMatch) {
        parts.push(<HiddenSyntax key={`fmt-${key++}`}>{headingMatch[1]}</HiddenSyntax>);
        const afterPrefix = remaining.substring(headingMatch[1].length);
        parts.push(<span key={`fmt-${key++}`} className="text-primary font-medium">{renderFormattingInline(afterPrefix)}</span>);
        return parts;
    }

    const bulletMatch = remaining.match(/^(\s*[-*]\s+)(?!\[)/);
    if (bulletMatch) {
        parts.push(<HiddenSyntax key={`fmt-${key++}`}>{bulletMatch[1]}</HiddenSyntax>);
        remaining = remaining.substring(bulletMatch[1].length);
    }

    parts.push(...renderFormattingInline(remaining, key));
    return parts;
}

function renderFormattingInline(text: string, keyOffset: number = 0): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = keyOffset;

    while (remaining.length > 0) {
        const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
        if (boldMatch) {
            if (boldMatch[1]) parts.push(<span key={`ifmt-${key++}`} className="text-foreground">{boldMatch[1]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>**</HiddenSyntax>);
            parts.push(<span key={`ifmt-${key++}`} className="text-primary font-medium">{boldMatch[2]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>**</HiddenSyntax>);
            remaining = boldMatch[3]; continue;
        }
        const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)/s);
        if (italicMatch) {
            if (italicMatch[1]) parts.push(<span key={`ifmt-${key++}`} className="text-foreground">{italicMatch[1]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>*</HiddenSyntax>);
            parts.push(<span key={`ifmt-${key++}`} className="text-primary/70">{italicMatch[2]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>*</HiddenSyntax>);
            remaining = italicMatch[3]; continue;
        }
        const colorMatch = remaining.match(/^(.*?)<c:([a-z]+)>(.*?)<\/c>(.*)/s);
        if (colorMatch) {
            if (colorMatch[1]) parts.push(<span key={`ifmt-${key++}`} className="text-foreground">{colorMatch[1]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>{`<c:${colorMatch[2]}>`}</HiddenSyntax>);
            const colorClass = TEXT_COLORS[colorMatch[2]] || "text-foreground";
            parts.push(<span key={`ifmt-${key++}`} className={cn("font-medium", colorClass)}>{colorMatch[3]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>{`</c>`}</HiddenSyntax>);
            remaining = colorMatch[4]; continue;
        }
        const imgMatch = remaining.match(/^(.*?)!\[(.*?)\]\((.*?)\)(.*)/s);
        if (imgMatch) {
            if (imgMatch[1]) parts.push(<span key={`ifmt-${key++}`} className="text-foreground">{imgMatch[1]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>![</HiddenSyntax>);
            parts.push(<span key={`ifmt-${key++}`} className="text-primary">{imgMatch[2]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>](</HiddenSyntax>);
            parts.push(<span key={`ifmt-${key++}`} className="text-muted-foreground/50 underline decoration-dotted break-all">{imgMatch[3]}</span>);
            parts.push(<HiddenSyntax key={`ifmt-${key++}`}>{")"}</HiddenSyntax>);
            remaining = imgMatch[4]; continue;
        }
        parts.push(<span key={`ifmt-${key++}`} className="text-foreground">{remaining}</span>);
        break;
    }
    return parts;
}

// ===== HYBRID EDITOR =====
function NoteEditor({ value, onChange, textareaRef, placeholder, className, onImageUpload }: {
    value: string;
    onChange: (val: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    placeholder?: string;
    className?: string;
    onImageUpload?: (file: File) => Promise<string | null>;
}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isBoosting, setIsBoosting] = useState(false);

    const handleDrop = async (e: React.DragEvent) => {
        if (!onImageUpload) return;
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const image = files.find(f => f.type.startsWith("image/"));
        if (!image) return;

        setIsBoosting(true);
        const url = await onImageUpload(image);
        setIsBoosting(false);

        if (url && textareaRef.current) {
            const ta = textareaRef.current;
            const start = ta.selectionStart || value.length;
            const textToInsert = `![${image.name}](${url})`;
            const newValue = value.slice(0, start) + textToInsert + value.slice(start);
            onChange(newValue);
        }
    };

    const handleScroll = () => {
        if (textareaRef.current && overlayRef.current) {
            overlayRef.current.scrollTop = textareaRef.current.scrollTop;
            overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const handleToggleAtPosition = (lineIdx: number, charIdx: number) => {
        const lines = value.split("\n");
        const line = lines[lineIdx];
        if (!line) return;
        const char = line[charIdx];
        const newChar = char.toLowerCase() === "x" ? " " : "x";
        lines[lineIdx] = line.substring(0, charIdx) + newChar + line.substring(charIdx + 1);
        onChange(lines.join("\n"));
    };

    const typographyStyles = "text-sm leading-relaxed whitespace-pre-wrap break-words";
    const paddingStyles = "px-4 py-3 sm:px-5 sm:py-4";

    const wordCount = useMemo(() => {
        return value.trim().split(/\s+/).filter(Boolean).length;
    }, [value]);

    return (
        <div className={cn("relative rounded-xl border border-white/[0.08] bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-md overflow-hidden ring-offset-background transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_24px_-4px_rgba(0,0,0,0.15)]", className)}>
            <div ref={overlayRef} aria-hidden="true" className={cn("absolute inset-0 z-20 pointer-events-none select-none overflow-hidden", typographyStyles, paddingStyles)}>
                {value.split("\n").map((line, i) => (
                    <div key={i} className="min-h-[1.5em]">
                        {renderEditorLine(line, (charIdx) => handleToggleAtPosition(i, charIdx))}
                    </div>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                placeholder={placeholder}
                spellCheck={false}
                className={cn(
                    "w-full bg-transparent relative z-10 border-none focus-visible:ring-0 focus:outline-none shadow-none resize-none min-h-[200px] sm:min-h-[300px] text-transparent caret-primary selection:bg-primary/20",
                    typographyStyles, paddingStyles,
                    isBoosting && "opacity-50"
                )}
            />
            {value.length > 0 && (
                <div className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/50 z-20 pointer-events-none">
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                </div>
            )}
        </div>
    );
}

// ===== TOOLBAR WITH AI =====
function NoteToolbar({ textareaRef, onContentChange, noteTitle, allNotes, onImageUpload }: {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    onContentChange: (content: string) => void;
    noteTitle?: string;
    allNotes?: Note[];
    onImageUpload?: (file: File) => Promise<string | null>;
}) {
    const [copied, setCopied] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [showPalette, setShowPalette] = useState(false); // For text color picker
    const [includeOtherNotes, setIncludeOtherNotes] = useState(false);
    const aiInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cursorRef = useRef({ start: 0, end: 0 });

    const saveCursor = () => {
        const ta = textareaRef.current;
        if (ta) cursorRef.current = { start: ta.selectionStart, end: ta.selectionEnd };
    };

    const insert = (prefix: string, suffix: string = "") => {
        const ta = textareaRef.current;
        if (!ta) return;
        const { start, end } = cursorRef.current;
        const val = ta.value;
        const selected = val.substring(start, end);
        const newContent = val.substring(0, start) + prefix + selected + suffix + val.substring(end);
        const newPos = start + prefix.length + selected.length;
        onContentChange(newContent);
        cursorRef.current = { start: newPos, end: newPos };
        setTimeout(() => { ta.focus(); ta.selectionStart = newPos; ta.selectionEnd = newPos; }, 20);
    };

    const addNewLine = (prefix: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const { start } = cursorRef.current;
        const val = ta.value;
        const before = val.substring(0, start);
        const after = val.substring(start);
        const needsNewline = before.length > 0 && !before.endsWith("\n");
        const toInsert = (needsNewline ? "\n" : "") + prefix;
        const newContent = before + toInsert + after;
        const newPos = start + toInsert.length;
        onContentChange(newContent);
        cursorRef.current = { start: newPos, end: newPos };
        setTimeout(() => { ta.focus(); ta.selectionStart = newPos; ta.selectionEnd = newPos; }, 20);
    };

    const handleCopy = () => {
        const ta = textareaRef.current;
        if (ta) navigator.clipboard.writeText(ta.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleAiEnhance = async () => {
        if (!aiPrompt.trim() || aiLoading) return;
        setAiLoading(true);
        setAiError(null);
        try {
            const currentContent = textareaRef.current?.value || "";
            const result = await enhanceNoteWithAI(
                aiPrompt.trim(),
                { title: noteTitle || "", content: currentContent },
                (allNotes || []).map(n => ({ title: n.title, content: n.content, tags: n.tags })),
                includeOtherNotes
            );
            onContentChange(result);
            setAiPrompt("");
            setAiOpen(false);
        } catch (err: any) {
            setAiError(err?.message || "AI enhancement failed");
        } finally {
            setAiLoading(false);
        }
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !onImageUpload) return;
        const file = e.target.files[0];
        setUploading(true);
        saveCursor(); // Save position before upload
        try {
            const url = await onImageUpload(file);
            if (url) {
                // Restore cursor logic partially via insert
                insert(`![${file.name}](${url})`);
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const tools = [
        { icon: Bold, label: "Bold", action: () => insert("**", "**") },
        { icon: Italic, label: "Italic", action: () => insert("*", "*") },
        { icon: Heading, label: "Heading", action: () => addNewLine("## ") },
        { icon: List, label: "Bullet List", action: () => addNewLine("- ") },
        { icon: ListChecks, label: "Checklist", action: () => addNewLine("- [ ] ") },
        { icon: uploading ? Loader2 : ImageIcon, label: "Image", action: () => fileInputRef.current?.click() },
        { icon: copied ? Check : Copy, label: "Copy", action: handleCopy },
    ];

    const aiSuggestions = [
        "Organize this note with headings and checklists",
        "Make this more detailed and actionable",
        "Summarize all my notes on this topic",
        "Create a study plan from my notes",
    ];

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border border-white/[0.06] bg-gradient-to-r from-secondary/40 to-secondary/20 rounded-xl backdrop-blur-sm shadow-sm">
                {tools.map((tool, i) => (
                    <Button key={i} type="button" variant="ghost" size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                        onMouseDown={(e) => { e.preventDefault(); saveCursor(); }}
                        onClick={() => tool.action()}
                        title={tool.label}
                    >
                        <tool.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                ))}

                {/* Text Color Button */}
                <div className="relative">
                    <Button type="button" variant="ghost" size="icon"
                        className={cn("h-7 w-7 sm:h-8 sm:w-8 rounded-lg transition-colors", showPalette ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-primary/10")}
                        onMouseDown={(e) => { e.preventDefault(); saveCursor(); }}
                        onClick={() => setShowPalette(!showPalette)}
                        title="Text Color"
                    >
                        <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <AnimatePresence>
                        {showPalette && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-popover border border-border rounded-xl shadow-xl grid grid-cols-4 gap-1 w-[140px] z-50"
                            >
                                {Object.keys(TEXT_COLORS).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => { insert(`<c:${color}>`, `</c>`); setShowPalette(false); }}
                                        className={cn(
                                            "w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform",
                                            color === "red" && "bg-red-500",
                                            color === "orange" && "bg-orange-500",
                                            color === "amber" && "bg-amber-500",
                                            color === "green" && "bg-green-500",
                                            color === "emerald" && "bg-emerald-500",
                                            color === "teal" && "bg-teal-500",
                                            color === "cyan" && "bg-cyan-500",
                                            color === "blue" && "bg-blue-500",
                                            color === "indigo" && "bg-indigo-500",
                                            color === "violet" && "bg-violet-500",
                                            color === "purple" && "bg-purple-500",
                                            color === "fuchsia" && "bg-fuchsia-500",
                                            color === "pink" && "bg-pink-500",
                                            color === "rose" && "bg-rose-500",
                                        )}
                                        title={color}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-px h-5 bg-border/50 mx-0.5" />
                <Button
                    type="button" variant={aiOpen ? "default" : "ghost"} size="sm"
                    className={cn(
                        "h-7 sm:h-8 rounded-lg gap-1.5 text-xs font-medium transition-all",
                        aiOpen
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                            : "text-muted-foreground hover:text-foreground hover:bg-violet-500/10"
                    )}
                    onClick={() => { setAiOpen(!aiOpen); setAiError(null); if (!aiOpen) setTimeout(() => aiInputRef.current?.focus(), 100); }}
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">AI</span>
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
            </div>
            <AnimatePresence>
                {aiOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="p-3 sm:p-4 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5 backdrop-blur-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                                <p className="text-xs text-violet-300/80 font-medium">Ask AI to enhance your note</p>
                                <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto" onClick={() => setAiOpen(false)}><X className="w-3 h-3" /></Button>
                            </div>
                            <div className="flex gap-2">
                                <Input ref={aiInputRef} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiEnhance(); } }}
                                    placeholder="e.g., 'Organize and improve this note'" className="flex-1 text-sm bg-background/50 border-violet-500/20" disabled={aiLoading}
                                />
                                <Button onClick={handleAiEnhance} disabled={aiLoading || !aiPrompt.trim()} size="icon"
                                    className="h-9 w-9 shrink-0 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg shadow-lg shadow-violet-500/25"
                                >
                                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIncludeOtherNotes(!includeOtherNotes)}
                                    className={cn(
                                        "h-7 text-[10px] sm:text-xs rounded-full border-violet-500/20 transition-colors",
                                        includeOtherNotes
                                            ? "bg-violet-500/20 text-violet-200 border-violet-500/40"
                                            : "bg-transparent text-violet-300/60 hover:text-violet-300 hover:bg-violet-500/10"
                                    )}
                                >
                                    <BookOpen className="w-3 h-3 mr-1.5" />
                                    Count other Note {includeOtherNotes ? "(On)" : "(Off)"}
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {aiSuggestions.map((s, i) => (
                                    <button key={i} onClick={() => { setAiPrompt(s); aiInputRef.current?.focus(); }}
                                        className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-violet-500/20 text-violet-300/70 hover:text-violet-200 hover:bg-violet-500/10 transition-colors"
                                    >{s}</button>
                                ))}
                            </div>
                            {aiError && (
                                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{aiError}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ===== COLOR PICKER =====
function ColorPicker({ currentColor, onColorChange }: { currentColor: NoteColor; onColorChange: (color: NoteColor) => void }) {
    return (
        <div className="flex flex-wrap gap-2 p-2">
            {(Object.keys(NOTE_COLORS) as NoteColor[]).map(color => {
                const c = NOTE_COLORS[color];
                return (
                    <button
                        key={color}
                        onClick={() => onColorChange(color)}
                        title={c.label}
                        className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                            c.light,
                            currentColor === color ? "border-primary ring-2 ring-primary/30 scale-110" : "border-transparent"
                        )}
                    >
                        {currentColor === color && <Check className="w-4 h-4 mx-auto text-primary" />}
                    </button>
                );
            })}
        </div>
    );
}

// ===== NOTE CARD =====
function NoteCard({ note, serialNumber, onSelect, onExpand, onToggleCheckbox, onTogglePin, onArchive, onTrash, onColorChange, viewMode }: {
    note: Note;
    serialNumber: number;
    onSelect: () => void;
    onExpand: () => void;
    onToggleCheckbox: (index: number) => void;
    onTogglePin: () => void;
    onArchive: () => void;
    onTrash: () => void;
    onColorChange: (color: NoteColor) => void;
    viewMode: ViewMode;
}) {



    const stats = getChecklistStats(note.content || "");
    const colorClasses = NOTE_COLORS[note.color] || NOTE_COLORS.default;

    // Plain text preview (first 1 line, no markdown)
    const previewText = useMemo(() => {
        if (!note.content) return "";
        const lines = note.content.split("\n").filter(l => l.trim());
        return lines.slice(0, 1).map(l =>
            l.replace(/^#+\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").replace(/^[-*]\s*\[[ xX]\]\s*/, "☐ ").replace(/^[-*]\s+/, "• ")
        ).join("\n");
    }, [note.content]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={onExpand}
            className={cn(
                "group break-inside-avoid mb-3 sm:mb-4 rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer",
                colorClasses.light, colorClasses.dark,
                note.is_pinned
                    ? "border-primary/30 shadow-md shadow-primary/10"
                    : note.color === "default"
                        ? "border-black/[0.08] dark:border-white/[0.08] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
                        : "border-black/[0.08] dark:border-transparent hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5",
            )}
        >
            <div className="p-4">
                {/* Header: Title + Actions */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        {note.title && (
                            <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug truncate">{note.title}</h3>
                        )}
                        {!!note.is_pinned && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <Pin className="w-3 h-3 text-primary fill-primary" />
                                <span className="text-[10px] text-primary font-medium">Pinned</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="w-7 h-7 rounded-full bg-muted/60 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground">#{serialNumber}</span>
                        <button
                            className="w-7 h-7 rounded-full bg-muted/60 dark:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
                            onClick={onExpand}
                            title="Expand to popup"
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-7 h-7 rounded-full bg-muted/60 dark:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                                    <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={onSelect}>
                                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onTogglePin}>
                                    {note.is_pinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
                                    {note.is_pinned ? "Unpin" : "Pin"}
                                </DropdownMenuItem>

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Palette className="w-4 h-4 mr-2" /> Color
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="p-1">
                                        <div className="grid grid-cols-4 gap-1 p-1">
                                            {(Object.keys(NOTE_COLORS) as NoteColor[]).map(color => {
                                                const c = NOTE_COLORS[color];
                                                return (
                                                    <button
                                                        key={color}
                                                        onClick={() => onColorChange(color)}
                                                        title={c.label}
                                                        className={cn(
                                                            "w-6 h-6 rounded-full border transition-all hover:scale-110",
                                                            c.light,
                                                            note.color === color ? "border-primary ring-1 ring-primary/30" : "border-transparent"
                                                        )}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuSeparator />
                                {viewMode !== "trash" ? (
                                    <>
                                        <DropdownMenuItem onClick={onArchive}>
                                            {note.is_archived ? <ArchiveRestore className="w-4 h-4 mr-2" /> : <Archive className="w-4 h-4 mr-2" />}
                                            {note.is_archived ? "Unarchive" : "Archive"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={onTrash} className="text-destructive focus:text-destructive">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={onTrash}>
                                            <Undo2 className="w-4 h-4 mr-2" /> Restore
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={onTrash} className="text-destructive focus:text-destructive">
                                            <Trash2 className="w-4 h-4 mr-2" /> Build forever
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Preview Text */}
                {note.content && (
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1 whitespace-pre-line leading-relaxed">{previewText}</p>
                )}

                {/* Checklist Progress */}
                {stats && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                            <span>{stats.checked}/{stats.total}</span>
                            <span>{Math.round((stats.checked / stats.total) * 100)}%</span>
                        </div>
                        <div className="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/70 rounded-full transition-all duration-500" style={{ width: `${(stats.checked / stats.total) * 100}%` }} />
                        </div>
                    </div>
                )}

                {/* Tags */}
                {note.tags && (
                    <div className="flex flex-nowrap gap-1 mt-2.5 overflow-x-auto no-scrollbar mask-fade-right">
                        {note.tags.split(",").map((t, i) => {
                            const trimmed = t.trim();
                            if (!trimmed) return null;
                            return (
                                <span key={i} className={cn("text-[10px] px-2 py-0.5 rounded-full border shrink-0", getTagColor(trimmed))}>
                                    #{trimmed}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ===== MAIN PAGE =====
// Masonry Logic
function useMasonryColumns() {
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width >= 1024) setColumns(3);      // lg+
            else if (width >= 640) setColumns(2);  // sm
            else setColumns(1);                    // default
        };

        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    return columns;
}

function MasonryGrid({ notes, renderItem }: { notes: any[]; renderItem: (note: any) => React.ReactNode }) {
    const numCols = useMasonryColumns();
    const [cols, setCols] = useState<any[][]>([[]]);

    useEffect(() => {
        const newCols: any[][] = Array.from({ length: numCols }, () => []);
        notes.forEach((note, i) => {
            newCols[i % numCols].push(note);
        });
        setCols(newCols);
    }, [notes, numCols]);

    return (
        <div className="flex gap-3 sm:gap-4 items-start">
            {cols.map((col, i) => (
                <div key={i} className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
                    {col.map(note => renderItem(note))}
                </div>
            ))}
        </div>
    );
}

export default function NotesPage() {
    const { notes, isLoading, addNote, updateNote, togglePin, updateColor, archiveNote, trashNote, deleteNote } = useNotes();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [viewNote, setViewNote] = useState<Note | null>(null); // Read-only mode
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("notes");
    const [sortMode, setSortMode] = useState<SortMode>("newest");
    const [newNote, setNewNote] = useState({ title: "", content: "", tags: "", color: "default" as NoteColor });

    const newTextareaRef = useRef<HTMLTextAreaElement>(null);
    const editTextareaRef = useRef<HTMLTextAreaElement>(null);

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        notes.forEach(n => n.tags?.split(",").forEach(t => { const trimmed = t.trim(); if (trimmed) tagSet.add(trimmed); }));
        return Array.from(tagSet).sort();
    }, [notes]);

    const filteredNotes = useMemo(() => {
        let result = notes.filter((note) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = !query || note.title.toLowerCase().includes(query) || note.content?.toLowerCase().includes(query) || note.tags?.toLowerCase().includes(query);
            const matchesTag = !activeTag || note.tags?.split(",").map(t => t.trim()).includes(activeTag);

            // View mode filter
            if (viewMode === "notes") return matchesSearch && matchesTag && !note.is_archived && !note.is_trashed;
            if (viewMode === "archive") return matchesSearch && matchesTag && note.is_archived && !note.is_trashed;
            if (viewMode === "trash") return matchesSearch && note.is_trashed;
            return false;
        });

        result.sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            switch (sortMode) {
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                case "newest":
                default:
                    return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
            }
        });
        return result;
    }, [notes, searchQuery, activeTag, viewMode, sortMode]);

    const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.is_pinned), [filteredNotes]);
    const unpinnedNotes = useMemo(() => filteredNotes.filter(n => !n.is_pinned), [filteredNotes]);

    const handleAddNote = async () => {
        if (!newNote.title.trim()) return;
        await addNote.mutateAsync(newNote);
        setNewNote({ title: "", content: "", tags: "", color: "default" });
        setIsDialogOpen(false);
    };

    const handleUpdateNote = async () => {
        if (!selectedNote) return;
        await updateNote.mutateAsync(selectedNote);
        setSelectedNote(null);
    };

    const handleUploadImage = async (file: File) => {
        try {
            return await uploadImage(file);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image. Please check API key.");
            return null;
        }
    };

    const handleCheckboxToggle = async (note: Note, index: number) => {
        const newContent = toggleChecklistItem(note.content || "", index);
        const updated = { ...note, content: newContent };
        if (selectedNote?.id === note.id) setSelectedNote(updated);
        if (viewNote?.id === note.id) setViewNote(updated);
        await updateNote.mutateAsync(updated);
    };

    const totalNotes = notes.filter(n => !n.is_archived && !n.is_trashed).length;
    const archivedCount = notes.filter(n => n.is_archived && !n.is_trashed).length;
    const trashedCount = notes.filter(n => n.is_trashed).length;

    return (
        <AppLayout>
            <SEO title="Notes" description="Capture your thoughts and ideas." />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 sm:space-y-6">

                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="hidden md:block">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <StickyNote className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold font-display tracking-tight">Notes</h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-14">Capture thoughts, checklists, and ideas</p>
                    </div>
                    <div className="top-toolbar w-full sm:w-auto flex items-center gap-2 rounded-2xl border border-violet-500 bg-background/40 backdrop-blur-xl p-1.5 shadow-sm">
                        {/* View Mode Dropdown */}
                        {/* Filter Menu */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border border-amber-400/50 bg-amber-400/10 text-amber-500 hover:bg-amber-400/20 hover:text-amber-600 hover:border-amber-400 transition-all shadow-sm shrink-0">
                                    <SlidersHorizontal className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4" align="start">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                            <Filter className="w-3.5 h-3.5" />
                                            View Mode
                                        </h4>
                                        <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="notes">📝 Notes{totalNotes > 0 ? ` (${totalNotes})` : ""}</SelectItem>
                                                <SelectItem value="archive">📦 Archive{archivedCount > 0 ? ` (${archivedCount})` : ""}</SelectItem>
                                                <SelectItem value="trash">🗑️ Trash{trashedCount > 0 ? ` (${trashedCount})` : ""}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                            <ArrowUpDown className="w-3.5 h-3.5" />
                                            Sort By
                                        </h4>
                                        <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">Newest first</SelectItem>
                                                <SelectItem value="oldest">Oldest first</SelectItem>
                                                <SelectItem value="title-asc">Title A→Z</SelectItem>
                                                <SelectItem value="title-desc">Title Z→A</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Divider */}
                        <div className="h-4 w-px bg-border/40 mx-1" />
                        {/* Search */}
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-full sm:w-48 md:w-64 bg-secondary/20 border border-indigo-500/30 ring-0 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/50 text-xs sm:text-sm h-8 rounded-xl" />
                        </div>
                        {/* New Note */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="icon" className="h-8 w-8 rounded-xl shadow-lg shadow-primary/20 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-4 h-4" /></Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-xl border-white/[0.08] bg-gradient-to-b from-background to-background/95 backdrop-blur-xl shadow-2xl">
                                <DialogHeader><DialogTitle className="flex items-center gap-2"><StickyNote className="w-4 h-4 text-primary" />Create Note</DialogTitle></DialogHeader>
                                <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                                    <Input placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} className="text-base sm:text-lg font-semibold" />
                                    <NoteEditor
                                        textareaRef={newTextareaRef}
                                        value={newNote.content}
                                        onChange={(val) => setNewNote({ ...newNote, content: val })}
                                        placeholder={"Take a note...\n\n- [ ] Checklist item"}
                                        onImageUpload={handleUploadImage}
                                    />
                                    <NoteToolbar textareaRef={newTextareaRef} onContentChange={(c) => setNewNote({ ...newNote, content: c })} noteTitle={newNote.title} allNotes={notes} onImageUpload={handleUploadImage} />
                                    <div className="space-y-2">
                                        <Input placeholder="Tags (comma separated)" value={newNote.tags} onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })} />
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1.5">Background color</p>
                                            <ColorPicker currentColor={newNote.color as NoteColor} onColorChange={(c) => setNewNote({ ...newNote, color: c })} />
                                        </div>
                                    </div>
                                    <Button onClick={handleAddNote} className="w-full rounded-xl h-10 sm:h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20" disabled={addNote.isPending}>
                                        {addNote.isPending ? "Creating..." : "Create Note"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Spacer for fixed toolbar on mobile */}
                <div className="h-8 md:hidden" aria-hidden="true" />

                {/* ===== TAG FILTER ===== */}
                {viewMode === "notes" && allTags.length > 0 && (
                    <div className="flex flex-nowrap gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1 mask-fade-right">
                        <Button variant={!activeTag ? "default" : "outline"} size="sm" className="text-xs h-7 sm:h-8 rounded-full shrink-0" onClick={() => setActiveTag(null)}>All</Button>
                        {allTags.map(tag => (
                            <Button key={tag} variant={activeTag === tag ? "default" : "outline"} size="sm" className="text-xs h-7 sm:h-8 rounded-full shrink-0" onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
                                #{tag}
                            </Button>
                        ))}
                    </div>
                )}

                {/* ===== NOTES MASONRY GRID ===== */}
                {isLoading ? (
                    <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
                ) : filteredNotes.length === 0 ? (
                    <div className="text-center py-16 sm:py-20">
                        <div className="p-4 bg-primary/5 rounded-full w-fit mx-auto mb-4">
                            {viewMode === "notes" && <StickyNote className="w-10 h-10 text-primary/30" />}
                            {viewMode === "archive" && <Archive className="w-10 h-10 text-primary/30" />}
                            {viewMode === "trash" && <Trash2 className="w-10 h-10 text-primary/30" />}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                            {viewMode === "notes" && "No notes yet. Create your first note!"}
                            {viewMode === "archive" && "No archived notes"}
                            {viewMode === "trash" && "Trash is empty"}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Pinned Section */}
                        {viewMode === "notes" && pinnedNotes.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Pin className="w-3 h-3" /> Pinned
                                </p>
                                <MasonryGrid
                                    notes={pinnedNotes}
                                    renderItem={(note) => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            serialNumber={note.serial_number}
                                            viewMode={viewMode}
                                            onSelect={() => setSelectedNote(note)}
                                            onExpand={() => setViewNote(note)}
                                            onToggleCheckbox={(idx) => handleCheckboxToggle(note, idx)}
                                            onTogglePin={() => togglePin.mutate(note)}
                                            onArchive={() => archiveNote.mutate({ id: note.id, archive: !note.is_archived })}
                                            onTrash={() => trashNote.mutate({ id: note.id, trash: true })}
                                            onColorChange={(c) => updateColor.mutate({ id: note.id, color: c })}
                                        />
                                    )}
                                />
                            </div>
                        )}

                        {/* Others / Unpinned Section */}
                        {(viewMode !== "notes" ? filteredNotes : unpinnedNotes).length > 0 && (
                            <div>
                                {viewMode === "notes" && pinnedNotes.length > 0 && (
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Others</p>
                                )}
                                <MasonryGrid
                                    notes={(viewMode !== "notes" ? filteredNotes : unpinnedNotes)}
                                    renderItem={(note) => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            serialNumber={note.serial_number}
                                            viewMode={viewMode}
                                            onSelect={() => setSelectedNote(note)}
                                            onExpand={() => setViewNote(note)}
                                            onToggleCheckbox={(idx) => handleCheckboxToggle(note, idx)}
                                            onTogglePin={() => togglePin.mutate(note)}
                                            onArchive={() => archiveNote.mutate({ id: note.id, archive: !note.is_archived })}
                                            onTrash={() => viewMode === "trash" ? deleteNote.mutate(note.id) : trashNote.mutate({ id: note.id, trash: true })}
                                            onColorChange={(c) => updateColor.mutate({ id: note.id, color: c })}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* ===== READ-ONLY DIALOG ===== */}
                <Dialog open={!!viewNote} onOpenChange={(open) => !open && setViewNote(null)}>
                    <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-xl border-white/[0.08] bg-gradient-to-b from-background to-background/95 backdrop-blur-xl shadow-2xl p-0 gap-0">
                        {viewNote && (
                            <>
                                <DialogHeader className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-row items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <DialogTitle className="text-xl font-bold font-display leading-tight truncate">
                                            {viewNote.title || "Untitled Note"}
                                        </DialogTitle>
                                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                                            <span className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">#{viewNote.serial_number}</span>
                                            <span>•</span>
                                            <span>{new Date(viewNote.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => { setViewNote(null); setSelectedNote(viewNote); }} className="gap-2 h-9">
                                            <Edit3 className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </Button>
                                    </div>
                                </DialogHeader>
                                <div className="p-5 sm:p-8 overflow-y-auto">
                                    <div className={cn("prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:tight prose-li:my-0",
                                        NOTE_COLORS[viewNote.color].light.replace("bg-", "prose-p:text-").replace("100", "900") // subtle theme hint? or just stick to default
                                    )}>
                                        {/* Render using RichNoteView for nice checkboxes and cleanup */}
                                        <RichNoteView content={viewNote.content || ""} onToggleCheckbox={(idx) => handleCheckboxToggle(viewNote, idx)} />
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* ===== VIEW/EDIT DIALOG ===== */}
                <Dialog open={!!selectedNote} onOpenChange={(open) => { if (!open) setSelectedNote(null); }}>
                    <DialogContent className={cn(
                        "w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-xl border-white/[0.08] backdrop-blur-xl shadow-2xl",
                        selectedNote ? `${NOTE_COLORS[selectedNote.color]?.light || ""} ${NOTE_COLORS[selectedNote.color]?.dark || ""}` : ""
                    )}>
                        {selectedNote && (
                            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                                <DialogHeader>
                                    <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <Edit3 className="w-4 h-4 text-primary" />Edit Note
                                    </DialogTitle>
                                </DialogHeader>
                                <Input
                                    value={selectedNote.title}
                                    onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                                    className="text-lg sm:text-xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/40"
                                    placeholder="Note title..."
                                />
                                <NoteEditor
                                    textareaRef={editTextareaRef}
                                    value={selectedNote.content || ""}
                                    onChange={(val) => setSelectedNote({ ...selectedNote, content: val })}
                                    onImageUpload={handleUploadImage}
                                />
                                <NoteToolbar textareaRef={editTextareaRef} onContentChange={(c) => setSelectedNote({ ...selectedNote, content: c })} noteTitle={selectedNote.title} allNotes={notes} onImageUpload={handleUploadImage} />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                                        <Input placeholder="Tags (comma separated)..." value={selectedNote.tags || ""} onChange={(e) => setSelectedNote({ ...selectedNote, tags: e.target.value })} className="flex-1 pl-9" />
                                    </div>
                                    <Button onClick={handleUpdateNote} disabled={updateNote.isPending} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20">
                                        {updateNote.isPending ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1.5">Background</p>
                                    <ColorPicker currentColor={selectedNote.color} onColorChange={(c) => setSelectedNote({ ...selectedNote, color: c })} />
                                </div>
                                <div className="pt-3 sm:pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground">
                                    <span>Edited {new Date(selectedNote.updated_at || selectedNote.created_at).toLocaleString()}</span>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => { archiveNote.mutate({ id: selectedNote.id, archive: !selectedNote.is_archived }); setSelectedNote(null); }}>
                                            <Archive className="w-3.5 h-3.5 mr-1.5" />{selectedNote.is_archived ? "Unarchive" : "Archive"}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { trashNote.mutate({ id: selectedNote.id, trash: true }); setSelectedNote(null); }}>
                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </motion.div>
        </AppLayout>
    );
}
