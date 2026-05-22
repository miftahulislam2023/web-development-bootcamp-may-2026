import { useState, useRef, useEffect, useMemo } from "react";
import {
    Send,
    Sparkles,
    User,
    Bot,
    Loader2,
    X,
    Maximize2,
    Minimize2,
    Search,
    Trash2,
    Check,
    MessageSquare,
    MoreVertical,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { processUserMessage, ChatMessage, AIIntent, executeAction, AllHooks } from "@/ai/core";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { useFinance } from "@/hooks/useFinance";
import { useBudget } from "@/hooks/useBudget";
import { useNotes } from "@/hooks/useNotes";
import { useHabits } from "@/hooks/useHabits";
import { useInventory } from "@/hooks/useInventory";
import { useStudy } from "@/hooks/useStudy";
import { useAI } from "@/contexts/AIContext";
import { useNavigate } from "react-router-dom";

// Render inline markdown formatting: **bold**, *italic*
function renderFormattedText(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
        if (boldMatch) {
            if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
            parts.push(<strong key={key++} className="font-semibold">{boldMatch[2]}</strong>);
            remaining = boldMatch[3];
            continue;
        }
        // Italic: *text*
        const italicMatch = remaining.match(/^(.*?)(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)(.*)/s);
        if (italicMatch) {
            if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>);
            parts.push(<em key={key++}>{italicMatch[2]}</em>);
            remaining = italicMatch[3];
            continue;
        }
        // Checklist: - [ ] or - [x]
        const checkMatch = remaining.match(/^(.*?)[-*]\s*\[([ xX])\]\s*(.*?)(?=\n|[-*]\s*\[|$)(.*)/s);
        if (checkMatch) {
            if (checkMatch[1]) parts.push(<span key={key++}>{checkMatch[1]}</span>);
            const checked = checkMatch[2].toLowerCase() === "x";
            parts.push(
                <div key={key++} className="flex items-start gap-2.5 py-1 select-none">
                    <div
                        className={cn(
                            "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                            checked
                                ? "bg-primary border-primary shadow-sm"
                                : "border-muted-foreground/30 bg-background/50"
                        )}
                    >
                        {checked && <Check className="w-2.5 h-2.5 text-primary-foreground stroke-[3]" />}
                    </div>
                    <span className={cn("text-sm transition-all duration-300", checked && "line-through text-muted-foreground/60 italic")}>
                        {renderFormattedText(checkMatch[3])}
                    </span>
                </div>
            );
            remaining = checkMatch[4];
            continue;
        }
        // No more formatting
        parts.push(<span key={key++}>{remaining}</span>);
        break;
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
}

export function AIChatInterface() {
    const { isChatOpen: isOpen, setChatOpen: setIsOpen, bubbleMessage, bubbleAction, pageContext } = useAI();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [viewportHeight, setViewportHeight] = useState<number | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Detect if keyboard is open (viewport significantly smaller than window)
    const keyboardOpen = isMobile && viewportHeight !== null && viewportHeight < window.innerHeight * 0.75;

    // Lock body scroll when chat is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setShowMenu(false);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const clearConversation = () => {
        setMessages([]);
        localStorage.removeItem("lifeos-chat-history");
        setShowMenu(false);
    };

    // Hooks for executing actions
    const { addTask, updateTask, deleteTask, completeTask, tasks } = useTasks();
    const { addEntry, deleteEntry, updateEntry, expenses } = useFinance();
    const { addBudget, updateBudget, addToSavings, deleteBudget, budgets, savingsGoals } = useBudget();
    const { addNote, updateNote, deleteNote, togglePin, updateColor, archiveNote, trashNote, notes } = useNotes();
    const { addHabit, completeHabit, deleteHabit, deleteAllHabits, habits } = useHabits();
    const { addItem, deleteItem, updateItem, items } = useInventory();
    const { subjects, chapters, parts, addSubject, addChapter, addPart, togglePartStatus, deleteSubject, deleteChapter, deletePart, commonPresets, addPresetsToChapter } = useStudy();
    const navigate = useNavigate();

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("lifeos-chat-history");
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load chat history", e);
            }
        }
    }, []);

    // Save history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("lifeos-chat-history", JSON.stringify(messages));
        }
    }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Keyboard shortcut - CMD+J for AI, CMD+K handled by GlobalSearch
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "j") {
                e.preventDefault();
                setIsOpen(!isOpen);
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Handle Search Button Click
    const handleSearchClick = () => {
        window.dispatchEvent(new CustomEvent("openGlobalSearch"));
    };

    // Focus input on open - only on desktop to avoid triggering mobile keyboard
    useEffect(() => {
        if (isOpen && window.innerWidth >= 768) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
        // On mobile, explicitly blur to prevent keyboard
        if (isOpen && window.innerWidth < 768) {
            setTimeout(() => inputRef.current?.blur(), 50);
        }
    }, [isOpen]);

    // Track visual viewport height for mobile keyboard awareness
    useEffect(() => {
        if (typeof window === 'undefined' || !window.visualViewport) return;
        const vv = window.visualViewport;
        const handleResize = () => {
            setViewportHeight(vv.height);
        };
        handleResize();
        vv.addEventListener('resize', handleResize);
        return () => vv.removeEventListener('resize', handleResize);
    }, [isOpen]);
    const executeIntent = async (intent: AIIntent) => {
        await executeAction(intent, {
            finance: { addEntry, deleteEntry, updateEntry, addBudget, updateBudget, deleteBudget, addToSavings, entries: [], expenses: expenses || [], budgets: budgets || [], savingsGoals: savingsGoals || [] },
            tasks: { addTask, updateTask, deleteTask, completeTask, tasks: tasks || [] },
            notes: { addNote, updateNote, deleteNote, togglePin, updateColor, archiveNote, trashNote, notes: notes || [] },
            habits: { addHabit, completeHabit, deleteHabit, habits: habits || [] },
            inventory: { addItem, updateItem, deleteItem, items: items || [] },
            study: { subjects, chapters, parts, addSubject, deleteSubject, addChapter, deleteChapter, addPart, togglePartStatus, deletePart, addPresetsToChapter, applyPresetsToAllChapters: undefined, commonPresets }
        });
    };


    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            // 1. Gather Context Data
            const currentLocation = window.location.pathname; // using window.location since we might be outside Router context or just easier here. Actually better to use useLocation if inside Router.
            // Wait, AIChatInterface is likely inside AppLayout which is inside Router. Let's assume Router context.
            // But to be safe and avoid Hook errors if I forget the import in this block, I'll use window.location for now or add the hook.
            // Let's add the hook at the top level component.

            // TIME AWARENESS
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
            const todayStr = now.toISOString().split('T')[0];
            const timePeriod = hour < 5 ? 'Late Night' : hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : hour < 22 ? 'Evening' : 'Night';

            // TASK ANALYSIS
            const activeTasks = tasks?.filter(t => t.status === 'todo' || t.status === 'in-progress') || [];
            const overdueTasks = activeTasks.filter(t => t.due_date && t.due_date < todayStr);
            const todayTasks = activeTasks.filter(t => t.due_date === todayStr);
            const urgentTasks = activeTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
            const completedTasks = tasks?.filter(t => t.status === 'done') || [];

            // HABIT ANALYSIS
            const habitsData = habits?.map(h => ({
                name: h.habit_name,
                streak: h.streak_count || 0,
                done_today: h.last_completed_date?.startsWith(todayStr) ?? false,
            })) || [];
            const pendingHabits = habitsData.filter(h => !h.done_today);
            const completedHabits = habitsData.filter(h => h.done_today);

            // FINANCE ANALYSIS
            const totalIncome = expenses?.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0) || 0;
            const totalExpense = expenses?.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0) || 0;
            const balance = totalIncome - totalExpense;
            const todaySpending = expenses?.filter(e => e.type === 'expense' && e.date === todayStr).reduce((a, b) => a + b.amount, 0) || 0;

            // NOTE ANALYSIS (include content previews + checklist stats)
            const notesData = notes?.map(n => {
                const content = n.content || '';
                const totalChecks = (content.match(/\[[ xX]\]/g) || []).length;
                const doneChecks = (content.match(/\[[xX]\]/g) || []).length;
                return {
                    title: n.title,
                    tags: n.tags,
                    preview: content.substring(0, 500),
                    checklist: totalChecks > 0 ? `${doneChecks}/${totalChecks} done` : null,
                };
            }) || [];

            const contextString = `
[SYSTEM CONTEXT - GOD MODE - OMNISCIENT]
⏰ Current Time: ${hour}:${String(minute).padStart(2, '0')} (${timePeriod})
📅 Day: ${dayOfWeek}, ${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
📍 Current Page: ${window.location.pathname}
🔍 Page Context: ${pageContext}

═══ TASKS (${activeTasks.length} active) ═══
🔴 OVERDUE (${overdueTasks.length}): ${overdueTasks.map(t => `"${t.title}" (was due ${t.due_date})`).join(', ') || 'None'}
🟡 DUE TODAY (${todayTasks.length}): ${todayTasks.map(t => `"${t.title}" [${t.priority}]`).join(', ') || 'None'}
🔥 URGENT/HIGH: ${urgentTasks.map(t => `"${t.title}" (due ${t.due_date || 'no date'})`).join(', ') || 'None'}
All Active:
${activeTasks.map(t => `- [${t.priority?.toUpperCase()}] ${t.title} (Due: ${t.due_date || 'none'}) [${t.context_type || 'general'}]${t.start_time ? ` ⏰${t.start_time}-${t.end_time}` : ''}`).join('\n') || '(no active tasks)'}
Recently Completed: ${completedTasks.slice(0, 5).map(t => t.title).join(', ') || 'None'}

═══ HABITS (${completedHabits.length}/${habitsData.length} done today) ═══
✅ Completed: ${completedHabits.map(h => `${h.name} (streak: ${h.streak})`).join(', ') || 'None yet'}
⏳ Pending: ${pendingHabits.map(h => `${h.name} (streak: ${h.streak}${h.streak >= 3 ? ' 🔥' : ''})`).join(', ') || 'All done!'}

═══ FINANCE ═══
💰 Balance: BDT ${balance} (Income: BDT ${totalIncome}, Expenses: BDT ${totalExpense})
📊 Today's Spending: BDT ${todaySpending}
Recent 10 Transactions:
${expenses?.slice(0, 10).map(t => `- ${t.date || 'N/A'}: ${t.type?.toUpperCase()} BDT ${t.amount} (${t.category}) "${t.description}"`).join('\n') || '(no transactions)'}
Budgets: ${budgets?.filter(b => b.type === 'budget').map(b => `${b.name}: BDT ${b.target_amount}/${b.period}`).join(', ') || 'None'}
Savings: ${savingsGoals?.map(s => `${s.name}: BDT ${s.current_amount}/BDT ${s.target_amount}`).join(', ') || 'None'}

═══ STUDY ═══
${subjects?.map(s => {
                const sChapters = chapters?.filter(c => c.subject_id === s.id) || [];
                const sParts = parts?.filter(p => sChapters.some(c => c.id === p.chapter_id)) || [];
                const done = sParts.filter(p => p.status === 'completed').length;
                return `${s.name}: ${sChapters.length} ch, ${done}/${sParts.length} parts done`;
            }).join('\n') || '(no study data)'}
Available Presets (Sub-Chapters): ${commonPresets?.filter(p => !p.parent_id).map(p => p.name).join(', ') || 'None'}

═══ NOTES (${notesData.length} total) ═══
${notesData.map(n => `- "${n.title}" [${n.tags || 'no tags'}]${n.checklist ? ` ✅${n.checklist}` : ''} → ${n.preview.replace(/\n/g, ' ').substring(0, 80)}...`).join('\n') || '(no notes)'}

═══ INVENTORY ═══
${items?.map(i => `- ${i.item_name} (x${i.quantity}) [${i.category || 'uncategorized'}] ${i.status === 'sold' ? '(SOLD)' : ''} ${i.cost ? `BDT ${i.cost}` : ''}`).join('\n') || '(no items)'}
`;

            // Process with history and context
            const results = await processUserMessage(userMsg, messages.filter(m => m.role !== "system"), contextString);

            // Execute all detected actions (supports batch)
            let actionsExecuted = 0;
            for (const result of results) {
                if (!["CHAT", "UNKNOWN", "GET_SUMMARY", "ANALYZE_BUDGET", "CLARIFY"].includes(result.action)) {
                    await executeIntent(result);
                    actionsExecuted++;
                }
            }
            if (actionsExecuted > 0) {
                toast.success(actionsExecuted > 1 ? `${actionsExecuted} actions executed!` : "Action executed successfully");
            }

            // Use the response text from the first intent (carries the combined summary)
            const responseText = results[0]?.response_text || "Done!";
            setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMsg = error instanceof Error ? error.message : "Unknown error";
            setMessages(prev => [...prev, { role: "assistant", content: `Sorry, I ran into an error: ${errorMsg}` }]);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Search Trigger Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="hidden md:flex fixed bottom-36 md:bottom-24 right-4 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary shadow-lg items-center justify-center hover:scale-105 transition-transform border border-border"
                    onClick={handleSearchClick}
                >
                    <Search className="w-6 h-6 text-foreground" />
                </motion.button>
            )}

            {/* Smart Bubble */}
            <AnimatePresence>
                {!isOpen && bubbleMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="fixed bottom-36 md:bottom-24 right-4 md:right-6 z-50 max-w-[250px] pointer-events-auto"
                    >
                        <div
                            className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm shadow-xl cursor-pointer hover:bg-primary/90 transition-colors relative"
                            onClick={() => {
                                if (bubbleAction) bubbleAction();
                                setIsOpen(true);
                            }}
                        >
                            <div className="text-sm font-medium">{bubbleMessage}</div>
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rotate-45 transform origin-center" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button for AI */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="hidden md:flex fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-primary shadow-lg items-center justify-center glow-primary hover:scale-105 transition-transform"
                    onClick={() => setIsOpen(true)}
                >
                    <Sparkles className="w-6 h-6 text-white" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop Blur Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Chat Window Container - 90dvh bottom sheet on mobile, bottom-right on desktop */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className={`fixed left-0 right-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 z-50 ${keyboardOpen ? 'rounded-t-none' : 'rounded-t-3xl'
                                } md:rounded-2xl overflow-hidden`}
                            style={isMobile ? {
                                height: viewportHeight ? viewportHeight : '90dvh',
                                maxHeight: keyboardOpen ? undefined : '90dvh',
                                transitionProperty: 'height, max-height, border-radius',
                                transitionDuration: '300ms',
                                transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)'
                            } : undefined}
                        >
                            <div className={`w-full md:w-[400px] h-full md:h-[600px] md:max-h-[80vh] flex flex-col bg-background md:glass-card overflow-hidden shadow-2xl ${keyboardOpen ? 'border-none' : 'border border-primary/20 md:rounded-2xl'
                                }`} style={{ transition: 'border-radius 300ms cubic-bezier(0.32, 0.72, 0, 1), border 300ms ease' }}>
                                {/* Header */}
                                <div className="px-5 py-4 bg-background flex items-center justify-between z-10 relative shadow-sm border-b border-border/20">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-[15px] tracking-tight text-foreground">LifeSolver AI</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">ONLINE</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center relative">
                                        <div className="flex items-center gap-1 px-2.5 py-1.5 border border-border/50 rounded-full">
                                            <button onClick={() => setShowMenu(!showMenu)} className="hover:bg-secondary/50 rounded-full p-0.5 transition-colors">
                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            <button onClick={() => setIsOpen(false)} className="hover:bg-secondary/50 rounded-full p-0.5 transition-colors">
                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>

                                        {/* Native Context Menu Dropdown */}
                                        {showMenu && (
                                            <>
                                                {/* Click-away backdrop */}
                                                <div className="fixed inset-0 z-[200]" onClick={() => setShowMenu(false)} />
                                                {/* Menu */}
                                                <div className="absolute top-full right-0 mt-2 z-[210] bg-background border border-border/50 rounded-xl shadow-xl min-w-[180px] py-1.5 overflow-hidden">
                                                    <button
                                                        onClick={clearConversation}
                                                        className="flex items-center gap-2.5 w-full py-2.5 px-4 text-red-500 hover:bg-red-500/10 transition-colors text-[13px] font-medium"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Clear Conversation
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.length === 0 && (
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-transparent text-primary mt-1">
                                                <MessageSquare className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                            </div>
                                            <div className="p-4 rounded-[20px] rounded-tl-sm bg-primary/5 text-foreground w-[85%]">
                                                <h4 className="text-xl font-bold text-primary mb-2">Welcome!</h4>
                                                <p className="text-[13px] text-foreground/80 font-medium leading-relaxed">I'm your AI assistant. Ask me anything about your tasks, finances, notes, habits, or anything else!</p>
                                            </div>
                                        </div>
                                    )}
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                        >
                                            <div
                                                className={`w-8 h-8 flex justify-center shrink-0 
                                                ${msg.role === "user" ? "hidden" : "text-primary mt-1"}`}
                                            >
                                                {msg.role === "assistant" && <MessageSquare className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                                            </div>
                                            <div
                                                className={`p-3.5 rounded-[20px] max-w-[85%] text-[13.5px] border 
                            ${msg.role === "user"
                                                        ? "bg-primary/5 text-foreground rounded-tr-sm border-primary/20"
                                                        : "bg-primary/5 text-foreground rounded-tl-sm border-transparent"}`}
                                            >
                                                {msg.role === "assistant" ? (
                                                    <div className="space-y-2 leading-relaxed font-medium">
                                                        {msg.content.split('\n').map((line, li) => {
                                                            if (!line.trim()) return <div key={li} className="h-1" />;
                                                            return (
                                                                <p key={li} className="">
                                                                    {renderFormattedText(line)}
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="font-medium text-foreground">{msg.content}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 flex justify-center shrink-0 mt-1 text-primary">
                                                <MessageSquare className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                            </div>
                                            <div className="p-4 rounded-[20px] rounded-tl-sm bg-primary/5 border border-transparent">
                                                <div className="flex gap-1.5">
                                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <form onSubmit={handleSend} className="p-3 md:p-4 bg-background border-t border-border/20 relative z-20" style={{
                                    paddingBottom: isMobile ? (keyboardOpen ? '0.75rem' : 'max(1.5rem, env(safe-area-inset-bottom))') : undefined,
                                    transitionProperty: 'padding-bottom',
                                    transitionDuration: '300ms',
                                    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)'
                                }}>
                                    <div className="flex items-end gap-2.5">
                                        <textarea
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder="Ask me anything about our services..."
                                            autoFocus={false}
                                            className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl py-3.5 px-4 text-[13.5px] focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none min-h-[48px] max-h-[120px] font-medium placeholder:text-muted-foreground"
                                            disabled={isLoading}
                                            rows={1}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || isLoading}
                                            className="w-12 h-12 shrink-0 rounded-[14px] bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:bg-secondary disabled:text-muted-foreground transition-all hover:opacity-90 active:scale-95 shadow-sm"
                                        >
                                            <Send className="w-5 h-5 ml-0.5" strokeWidth={2} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
