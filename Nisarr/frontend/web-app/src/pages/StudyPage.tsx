import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, GraduationCap, Trash2, Search, BookOpen, TrendingUp,
    Award, Brain, ChevronRight, Pencil, Check, X,
    Clock, Calendar, BookMarked, Layers, FolderPlus, FilePlus, Settings, MoreHorizontal
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/ui/date-picker";
import { SEO } from "@/components/seo/SEO";
import { StudyAnalytics } from "@/components/study/StudyAnalytics";
import { useStudy, StudySubject, StudyChapter, StudyPart, StudyCommonPreset } from "@/hooks/useStudy";
import { useToast } from "@/hooks/use-toast";
import { useAI } from "@/contexts/AIContext";

// ─── Color Palette for subjects ──────────────────────────────────────
const SUBJECT_COLORS = [
    { bg: "from-violet-500/20 to-purple-500/10", border: "border-violet-500/30", text: "text-violet-500 dark:text-violet-400", accent: "#8b5cf6", progressBg: "bg-violet-500" },
    { bg: "from-cyan-500/20 to-teal-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400", accent: "#06b6d4", progressBg: "bg-cyan-500" },
    { bg: "from-emerald-500/20 to-green-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400", accent: "#10b981", progressBg: "bg-emerald-500" },
    { bg: "from-rose-500/20 to-pink-500/10", border: "border-rose-500/30", text: "text-rose-600 dark:text-rose-400", accent: "#f43f5e", progressBg: "bg-rose-500" },
    { bg: "from-amber-500/20 to-yellow-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400", accent: "#f59e0b", progressBg: "bg-amber-500" },
    { bg: "from-indigo-500/20 to-blue-500/10", border: "border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400", accent: "#6366f1", progressBg: "bg-indigo-500" },
    { bg: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30", text: "text-orange-600 dark:text-orange-400", accent: "#f97316", progressBg: "bg-orange-500" },
];

const getColor = (i: number) => SUBJECT_COLORS[i % SUBJECT_COLORS.length];

// ─── Status helpers ──────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; next: string }> = {
    "not-started": { label: "Todo", color: "text-muted-foreground", bg: "bg-secondary/60", next: "in-progress" },
    "in-progress": { label: "50%", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/15", next: "completed" },
    "completed": { label: "Done", color: "text-green-500 dark:text-green-400", bg: "bg-green-500/15", next: "not-started" },
};

// ─── Time options ────────────────────────────────────────────────────
const TIME_OPTIONS = [15, 30, 45, 60, 90, 120, 180];

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════

export default function StudyPage() {
    const study = useStudy();
    const { toast } = useToast();
    const { setPageContext } = useAI();

    // ── Local UI state ───────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [filterSubject, setFilterSubject] = useState<string>("all");

    // Presets state
    const [managePresetsOpen, setManagePresetsOpen] = useState(false);
    const [selectedPresetSubjectId, setSelectedPresetSubjectId] = useState<string>("");
    const [newPresetName, setNewPresetName] = useState("");
    const [newPresetMinutes, setNewPresetMinutes] = useState(30);
    const [newPresetParentId, setNewPresetParentId] = useState<string | null>(null);
    const [activePresetTab, setActivePresetTab] = useState<"chapter" | "part">("chapter");
    const [selectedTargetChapterId, setSelectedTargetChapterId] = useState<string>("");
    const [selectedTargetPartId, setSelectedTargetPartId] = useState<string>("");
    const [selectedPresetIds, setSelectedPresetIds] = useState<Set<string>>(new Set());

    // Dialog states
    const [addSubjectOpen, setAddSubjectOpen] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState("");

    const [addChapterOpen, setAddChapterOpen] = useState(false);
    const [addChapterSubjectId, setAddChapterSubjectId] = useState("");
    const [newChapterName, setNewChapterName] = useState("");

    const [addPartOpen, setAddPartOpen] = useState(false);
    const [addPartChapterId, setAddPartChapterId] = useState("");
    const [addPartParentId, setAddPartParentId] = useState<string | null>(null);
    const [newPartName, setNewPartName] = useState("");
    const [newPartMinutes, setNewPartMinutes] = useState(30);
    const [newPartDate, setNewPartDate] = useState("");

    const [editSubjectOpen, setEditSubjectOpen] = useState(false);
    const [editSubjectId, setEditSubjectId] = useState("");
    const [editSubjectName, setEditSubjectName] = useState("");

    const [editChapterOpen, setEditChapterOpen] = useState(false);
    const [editChapterId, setEditChapterId] = useState("");
    const [editChapterName, setEditChapterName] = useState("");

    const [editPartOpen, setEditPartOpen] = useState(false);
    const [editPartId, setEditPartId] = useState("");
    const [editPartData, setEditPartData] = useState({ id: "", name: "", minutes: 30, date: "" });

    // Initially expand all subjects (once loaded)
    useEffect(() => {
        if (study.subjects.length > 0 && expandedSubjects.size === 0) {
            setExpandedSubjects(new Set(study.subjects.map(s => s.id)));
        }
    }, [study.subjects.length]);

    // AI page context
    useEffect(() => {
        setPageContext(`User is on Study Page. Subjects: ${study.subjects.length}, Chapters: ${study.chapters.length}, Parts: ${study.totalParts}, Completed: ${study.completedParts}, Progress: ${study.overallProgress}%. Subject names: ${study.subjects.map(s => s.name).join(", ") || "None"}.`);
    }, [study.subjects, study.chapters, study.totalParts, study.completedParts, study.overallProgress, setPageContext]);

    // ── Toggle helpers ───────────────────────────────────────────────
    const toggleSubject = (id: string) => {
        setExpandedSubjects(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleChapter = (id: string) => {
        setExpandedChapters(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // ── Search / filter ──────────────────────────────────────────────
    const filteredSubjects = useMemo(() => {
        let list = study.subjects;
        if (filterSubject !== "all") list = list.filter(s => s.id === filterSubject);
        if (!searchTerm) return list;
        const q = searchTerm.toLowerCase();
        return list.filter(s => {
            if (s.name.toLowerCase().includes(q)) return true;
            const chs = study.chaptersBySubject[s.id] || [];
            return chs.some(c => {
                if (c.name.toLowerCase().includes(q)) return true;
                const pts = study.partsByChapter[c.id] || [];
                return pts.some(p => p.name.toLowerCase().includes(q));
            });
        });
    }, [study.subjects, study.chaptersBySubject, study.partsByChapter, filterSubject, searchTerm]);

    // ── Handlers ─────────────────────────────────────────────────────
    const handleAddSubject = async () => {
        if (!newSubjectName.trim()) return;
        await study.addSubject.mutateAsync(newSubjectName.trim());
        setNewSubjectName("");
        setAddSubjectOpen(false);
        toast({ title: "📚 Subject created!" });
    };

    const handleAddChapter = async () => {
        if (!newChapterName.trim() || !addChapterSubjectId) return;
        await study.addChapter.mutateAsync({ subjectId: addChapterSubjectId, name: newChapterName.trim() });
        setNewChapterName("");
        setAddChapterOpen(false);
        setExpandedSubjects(p => new Set(p).add(addChapterSubjectId));
    };

    const handleAddPart = async () => {
        if (!newPartName.trim() || !addPartChapterId) return;
        await study.addPart.mutateAsync({
            chapterId: addPartChapterId,
            name: newPartName.trim(),
            estimatedMinutes: newPartMinutes,
            scheduledDate: newPartDate || undefined,
            parentId: addPartParentId || undefined,
        });
        setNewPartName("");
        setNewPartMinutes(30);
        setNewPartDate("");
        setAddPartParentId(null);
        setAddPartOpen(false);
        setExpandedChapters(p => new Set(p).add(addPartChapterId));
    };

    const handleSaveEditSubject = async () => {
        if (!editSubjectName.trim() || !editSubjectId) return;
        await study.renameSubject.mutateAsync({ id: editSubjectId, name: editSubjectName.trim() });
        setEditSubjectOpen(false);
    };

    const handleSaveEditChapter = async () => {
        if (!editChapterName.trim() || !editChapterId) return;
        await study.renameChapter.mutateAsync({ id: editChapterId, name: editChapterName.trim() });
        setEditChapterOpen(false);
    };

    const handleSaveEditPart = async () => {
        if (!editPartData.name.trim() || !editPartId) return;
        await study.updatePart.mutateAsync({
            id: editPartId,
            name: editPartData.name.trim(),
            estimated_minutes: editPartData.minutes,
            scheduled_date: editPartData.date || null,
        });
        setEditPartOpen(false);
    };

    // ── Open dialog helpers ──────────────────────────────────────────
    const openAddChapter = (subjectId: string) => {
        setAddChapterSubjectId(subjectId);
        setNewChapterName("");
        setAddChapterOpen(true);
    };

    const openAddPart = (chapterId: string, parentId: string | null = null) => {
        setAddPartChapterId(chapterId);
        setAddPartParentId(parentId);
        setNewPartName("");
        setNewPartMinutes(30);
        setNewPartDate("");
        setAddPartOpen(true);
    };

    const openEditSubject = (subject: StudySubject) => {
        setEditSubjectId(subject.id);
        setEditSubjectName(subject.name);
        setEditSubjectOpen(true);
    };

    const openEditChapter = (chapter: StudyChapter) => {
        setEditChapterId(chapter.id);
        setEditChapterName(chapter.name);
        setEditChapterOpen(true);
    };

    const openEditPart = (part: StudyPart) => {
        setEditPartId(part.id);
        setEditPartData({
            id: part.id,
            name: part.name,
            minutes: part.estimated_minutes,
            date: part.scheduled_date || "",
        });
        setEditPartOpen(true);
    };

    // ══════════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════════

    return (
        <AppLayout>
            <SEO title="Study Tracker" description="Track your academic progress across subjects, chapters, and parts." />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">

                {/* ═══ HEADER & TOOLBAR ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="hidden md:block">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <GraduationCap className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold font-display tracking-tight">Study</h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-14">Organize subjects, chapters & parts</p>
                    </div>

                    <div className="top-toolbar sm:w-auto flex items-center gap-2 rounded-2xl border border-violet-500 bg-background/40 backdrop-blur-xl p-1.5 shadow-sm">
                        {/* Subject filter dropdown */}
                        <Select value={filterSubject} onValueChange={setFilterSubject}>
                            <SelectTrigger className="h-7 w-auto min-w-[120px] px-2.5 text-xs sm:text-sm bg-transparent hover:bg-primary/10 hover:text-primary transition-colors focus:ring-0 border border-indigo-500/30">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {study.subjects.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Search */}
                        <div className="relative flex-1 min-w-[120px] max-w-[240px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 h-7 text-xs sm:text-sm bg-transparent ring-0 focus-visible:ring-0 focus-visible:bg-primary/5 transition-colors placeholder:text-muted-foreground/50 border border-indigo-500/30"
                            />
                        </div>

                        {/* Manage Presets button */}
                        <Button className="w-full sm:w-auto h-9 text-xs sm:text-sm" variant="secondary" onClick={() => {
                            setSelectedPresetSubjectId("");
                            setManagePresetsOpen(true);
                        }} title="Manage Chapter Templates">
                            <Settings className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Templates</span>
                        </Button>

                        {/* Add Subject button */}
                        <Button size="icon" className="h-8 w-8 sm:w-auto sm:px-3 sm:gap-1.5 shadow-lg shadow-primary/20" onClick={() => setAddSubjectOpen(true)}>
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Subject</span>
                        </Button>
                    </div>
                </div>

                {/* Spacer for fixed toolbar on mobile */}
                <div className="h-8 md:hidden" aria-hidden="true" />

                {/* ═══ STATS ROW ═══ */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                    {[
                        { icon: BookOpen, label: "Subjects", value: study.subjects.length, color: "text-violet-500 dark:text-violet-400", bg: "from-violet-500/15 to-violet-500/5" },
                        { icon: Layers, label: "Chapters", value: study.chapters.length, color: "text-cyan-500 dark:text-cyan-400", bg: "from-cyan-500/15 to-cyan-500/5" },
                        { icon: Award, label: "Parts Done", value: `${study.completedParts}/${study.totalParts}`, color: "text-green-500 dark:text-green-400", bg: "from-green-500/15 to-green-500/5" },
                        { icon: Brain, label: "Progress", value: `${study.overallProgress}%`, color: "text-primary", bg: "from-primary/15 to-primary/5" },
                    ].map(stat => (
                        <div key={stat.label} className={`glass-card p-2 sm:p-3 bg-gradient-to-br ${stat.bg} border border-white/5`}>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`p-1.5 sm:p-2 rounded-lg bg-background/50 ${stat.color}`}>
                                    <stat.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm sm:text-lg font-bold">{stat.value}</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ═══ ANALYTICS ═══ */}
                <StudyAnalytics subjects={study.subjects} chapters={study.chapters} parts={study.parts} chaptersBySubject={study.chaptersBySubject} partsByChapter={study.partsByChapter} subjectProgress={study.subjectProgress} />

                {/* ═══ SUBJECT TREE ═══ */}
                <div className="space-y-3">
                    {study.isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <div className="animate-pulse flex flex-col items-center gap-3">
                                <Brain className="w-10 h-10 opacity-50" />
                                <span>Loading your study data...</span>
                            </div>
                        </div>
                    ) : filteredSubjects.length === 0 ? (
                        /* ── Empty State ── */
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                    <GraduationCap className="w-12 h-12 text-primary opacity-60" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">
                                        {searchTerm ? "No results match your search" : "Start Your Learning Journey"}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {searchTerm ? "Try a different search term" : "Create your first subject to start organizing your study plan!"}
                                    </p>
                                </div>
                                {!searchTerm && (
                                    <Button onClick={() => setAddSubjectOpen(true)} className="gap-2 mt-2">
                                        <Plus className="w-4 h-4" /> Create First Subject
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        filteredSubjects.map((subject, si) => {
                            const color = getColor(subject.color_index ?? si);
                            const isExpanded = expandedSubjects.has(subject.id);
                            const subChapters = study.chaptersBySubject[subject.id] || [];
                            const totalSubParts = subChapters.flatMap(c => study.partsByChapter[c.id] || []);

                            // Calculate Duration & Progress for Subject
                            let subjectTotalMinutes = 0;
                            let subjectCompletedMinutes = 0;

                            subChapters.forEach(ch => {
                                const chParts = study.partsByChapter[ch.id] || [];
                                chParts.forEach(p => {
                                    const mins = Number(p.estimated_minutes) || 30;
                                    subjectTotalMinutes += mins;
                                    if (p.status === "completed") {
                                        subjectCompletedMinutes += mins;
                                    } else if (p.status === "in-progress") {
                                        subjectCompletedMinutes += (mins * 0.5);
                                    }
                                });
                            });

                            const subjectRemainingMinutes = subjectTotalMinutes - subjectCompletedMinutes;
                            const progress = study.subjectProgress[subject.id] || 0;

                            const formatDuration = (mins: number) => {
                                const rounded = Math.ceil(mins);
                                if (rounded === 0) return "0m";
                                const h = Math.floor(rounded / 60);
                                const m = rounded % 60;
                                if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ""}`;
                                return `${m}m`;
                            };

                            return (
                                <motion.div
                                    key={subject.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: si * 0.06 }}
                                    className={`glass-card overflow-hidden border ${color.border}`}
                                >
                                    {/* ── Subject Header ── */}
                                    <div
                                        className={`p-3 sm:p-4 bg-gradient-to-r ${color.bg} cursor-pointer select-none`}
                                        onClick={() => toggleSubject(subject.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex-shrink-0"
                                                >
                                                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${color.text}`} />
                                                </motion.div>

                                                <div className="p-1.5 sm:p-2 rounded-xl bg-background/50 flex-shrink-0">
                                                    <BookMarked className={`w-4 h-4 sm:w-5 sm:h-5 ${color.text}`} />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-sm sm:text-lg truncate">{subject.name}</h3>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                                                        {subChapters.length} chapter{subChapters.length !== 1 ? "s" : ""} · {totalSubParts.length} part{totalSubParts.length !== 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                                {/* Subject Duration & Progress Bar */}
                                                <div className="flex flex-col items-end gap-1 min-w-[80px] sm:min-w-[100px]">
                                                    <div className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                                                        {subjectRemainingMinutes > 0 ? (
                                                            <span>{formatDuration(subjectRemainingMinutes)} left</span>
                                                        ) : (
                                                            <span className="text-green-600 dark:text-green-400">Complete!</span>
                                                        )}
                                                    </div>
                                                    <div className="h-1.5 w-full bg-background/40 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${color.progressBg}`}
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Progress pill */}
                                                <div className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full ${progress >= 100 ? "bg-green-500/20 text-green-500 dark:text-green-400" :
                                                    progress > 50 ? "bg-blue-500/20 text-blue-500 dark:text-blue-400" :
                                                        progress > 0 ? "bg-amber-500/20 text-amber-500 dark:text-amber-400" :
                                                            "bg-secondary/50 text-muted-foreground"
                                                    }`}>
                                                    {progress}%
                                                </div>

                                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56">
                                                            <DropdownMenuItem onClick={() => openAddChapter(subject.id)}>
                                                                <FolderPlus className="mr-2 h-4 w-4" /> Add Chapter
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => { setSelectedPresetSubjectId(subject.id); setManagePresetsOpen(true); }}>
                                                                <Settings className="mr-2 h-4 w-4" /> Manage Templates
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEditSubject(subject)}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Rename Subject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => study.deleteSubject.mutate(subject.id)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Subject
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Chapters ── */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-2 sm:p-3 space-y-1.5">
                                                    {subChapters.length === 0 ? (
                                                        <div className="text-center py-4 text-muted-foreground text-xs sm:text-sm">
                                                            No chapters yet.{" "}
                                                            <button
                                                                className="text-primary hover:underline"
                                                                onClick={() => openAddChapter(subject.id)}
                                                            >
                                                                Add one
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        subChapters.map((chapter, ci) => {
                                                            const isChExpanded = expandedChapters.has(chapter.id);
                                                            const chParts = study.partsByChapter[chapter.id] || [];

                                                            // Calculate Duration & Progress for Chapter
                                                            let chTotalMinutes = 0;
                                                            let chCompletedMinutes = 0;
                                                            chParts.forEach(p => {
                                                                const mins = Number(p.estimated_minutes) || 30;
                                                                chTotalMinutes += mins;
                                                                if (p.status === "completed") {
                                                                    chCompletedMinutes += mins;
                                                                } else if (p.status === "in-progress") {
                                                                    chCompletedMinutes += (mins * 0.5);
                                                                }
                                                            });

                                                            const chRemainingMinutes = chTotalMinutes - chCompletedMinutes;
                                                            const chProgress = study.chapterProgress[chapter.id] || 0;

                                                            return (
                                                                <motion.div
                                                                    key={chapter.id}
                                                                    initial={{ opacity: 0, x: -8 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: ci * 0.03 }}
                                                                    className="rounded-xl border bg-card/50 hover:bg-card/80 transition-colors overflow-hidden"
                                                                >
                                                                    {/* Chapter Row */}
                                                                    <div
                                                                        className="flex items-center gap-2 p-2.5 sm:p-3 cursor-pointer select-none"
                                                                        onClick={() => toggleChapter(chapter.id)}
                                                                    >
                                                                        <motion.div
                                                                            animate={{ rotate: isChExpanded ? 90 : 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                        >
                                                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                                                        </motion.div>

                                                                        <span className="font-medium text-xs sm:text-sm flex-1 truncate">{chapter.name}</span>

                                                                        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>

                                                                            {/* Chapter Duration & Progress */}
                                                                            <div className="flex flex-col items-end gap-0.5 min-w-[60px] sm:min-w-[80px]">
                                                                                <div className="text-[10px] font-medium text-muted-foreground">
                                                                                    {chRemainingMinutes > 0 ? (
                                                                                        <span>{formatDuration(chRemainingMinutes)}</span>
                                                                                    ) : (
                                                                                        <span className="text-green-500">Done</span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                                                                    <div
                                                                                        className={`h-full rounded-full transition-all duration-500 ${chProgress >= 100 ? "bg-green-500" : "bg-primary"}`}
                                                                                        style={{ width: `${chProgress}%` }}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center gap-1">
                                                                                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 font-mono ${chProgress >= 100 ? "bg-green-500/15 text-green-500 dark:text-green-400" :
                                                                                    chProgress > 0 ? "bg-blue-500/15 text-blue-500 dark:text-blue-400" :
                                                                                        ""
                                                                                    }`}>
                                                                                    {chProgress}%
                                                                                </Badge>
                                                                                <span className="text-[10px] text-muted-foreground ml-1 w-8 text-right">{chParts.length}p</span>

                                                                                {/* Actions */}
                                                                                <div className="flex items-center ml-1">
                                                                                    <DropdownMenu>
                                                                                        <DropdownMenuTrigger asChild>
                                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                                                                                <MoreHorizontal className="w-3.5 h-3.5" />
                                                                                            </Button>
                                                                                        </DropdownMenuTrigger>
                                                                                        <DropdownMenuContent align="end" className="w-48">
                                                                                            <DropdownMenuItem onClick={() => openAddPart(chapter.id)}>
                                                                                                <FilePlus className="mr-2 h-4 w-4" /> Add Part
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuItem onClick={() => openEditChapter(chapter)}>
                                                                                                <Pencil className="mr-2 h-4 w-4" /> Rename Chapter
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuSeparator />
                                                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => study.deleteChapter.mutate(chapter.id)}>
                                                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Chapter
                                                                                            </DropdownMenuItem>
                                                                                        </DropdownMenuContent>
                                                                                    </DropdownMenu>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Parts list */}
                                                                    <AnimatePresence>
                                                                        {isChExpanded && chParts.length > 0 && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: "auto", opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="overflow-hidden"
                                                                            >
                                                                                <div className="border-t border-border/30 divide-y divide-border/20">
                                                                                    {chParts.filter(p => !p.parent_id).map((part) => (
                                                                                        <PartRow
                                                                                            key={part.id}
                                                                                            part={part}
                                                                                            allParts={chParts}
                                                                                            onStartEdit={(p) => openEditPart(p)}
                                                                                            onToggleStatus={(p) => study.togglePartStatus.mutate({ id: p.id, currentStatus: p.status })}
                                                                                            onDelete={(p) => study.deletePart.mutate(p.id)}
                                                                                            onAddSubpart={(parentId) => openAddPart(chapter.id, parentId)}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </motion.div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════════════════════
                POPUP DIALOGS
            ══════════════════════════════════════════════════════════ */}

            {/* ── Add Subject Dialog ─────────────────────────────────── */}
            <Dialog open={addSubjectOpen} onOpenChange={setAddSubjectOpen}>
                <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                        <DialogDescription>Create a new subject to organize your study materials.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Input
                            placeholder="Subject name (e.g., Physics, Calculus)"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                            autoFocus
                        />
                        <Button onClick={handleAddSubject} className="w-full" disabled={study.addSubject.isPending}>
                            {study.addSubject.isPending ? "Creating..." : "Create Subject"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Add Chapter Dialog ──────────────────────────────────── */}
            <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
                <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Add Chapter</DialogTitle>
                        <DialogDescription>
                            Add a new chapter to {study.subjects.find(s => s.id === addChapterSubjectId)?.name || "this subject"}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Input
                            placeholder="Chapter name..."
                            value={newChapterName}
                            onChange={e => setNewChapterName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAddChapter()}
                            autoFocus
                        />
                        <Button onClick={handleAddChapter} className="w-full" disabled={study.addChapter.isPending}>
                            {study.addChapter.isPending ? "Adding..." : "Add Chapter"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Add Part Dialog ─────────────────────────────────────── */}
            <Dialog open={addPartOpen} onOpenChange={setAddPartOpen}>
                <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Add Part</DialogTitle>
                        <DialogDescription>
                            Add a learning part to {study.chapters.find(c => c.id === addPartChapterId)?.name || "this chapter"}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Input
                            placeholder="Part name..."
                            value={newPartName}
                            onChange={e => setNewPartName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleAddPart()}
                            autoFocus
                        />
                        <div className="grid grid-cols-2 gap-3">
                            {/* Duration */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Duration
                                </label>
                                <Select
                                    value={String(newPartMinutes)}
                                    onValueChange={(v) => setNewPartMinutes(Number(v))}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_OPTIONS.map(t => (
                                            <SelectItem key={t} value={String(t)}>
                                                {t >= 60 ? `${t / 60}h` : `${t}m`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Date
                                </label>
                                <DatePicker
                                    value={newPartDate}
                                    onChange={(date) => setNewPartDate(date || "")}
                                    className="h-9"
                                    placeholder="Pick a date"
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddPart} className="w-full" disabled={study.addPart.isPending}>
                            {study.addPart.isPending ? "Adding..." : "Add Part"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Edit Subject Dialog ─────────────────────────────────── */}
            <Dialog open={editSubjectOpen} onOpenChange={setEditSubjectOpen}>
                <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Subject</DialogTitle>
                        <DialogDescription>Rename this subject.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Input
                            value={editSubjectName}
                            onChange={e => setEditSubjectName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSaveEditSubject()}
                            autoFocus
                        />
                        <Button onClick={handleSaveEditSubject} className="w-full" disabled={study.renameSubject.isPending}>
                            {study.renameSubject.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Edit Chapter Dialog ─────────────────────────────────── */}
            <Dialog open={editChapterOpen} onOpenChange={setEditChapterOpen}>
                <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Chapter</DialogTitle>
                        <DialogDescription>Rename this chapter.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Input
                            value={editChapterName}
                            onChange={e => setEditChapterName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSaveEditChapter()}
                            autoFocus
                        />
                        <Button onClick={handleSaveEditChapter} className="w-full" disabled={study.renameChapter.isPending}>
                            {study.renameChapter.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Edit Part Dialog ────────────────────────────────────── */}
            <Dialog open={editPartOpen} onOpenChange={setEditPartOpen}>
                <DialogContent className="w-[95vw] max-w-md rounded-2xl sm:rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Part</DialogTitle>
                        <DialogDescription>Update part details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Input
                            placeholder="Part name"
                            value={editPartData.name}
                            onChange={e => setEditPartData({ ...editPartData, name: e.target.value })}
                            onKeyDown={e => e.key === "Enter" && handleSaveEditPart()}
                            autoFocus
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Duration
                                </label>
                                <Select
                                    value={String(editPartData.minutes)}
                                    onValueChange={(v) => setEditPartData({ ...editPartData, minutes: Number(v) })}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_OPTIONS.map(t => (
                                            <SelectItem key={t} value={String(t)}>
                                                {t >= 60 ? `${t / 60}h` : `${t}m`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Date
                                </label>
                                <DatePicker
                                    value={editPartData.date}
                                    onChange={(date) => setEditPartData({ ...editPartData, date: date || "" })}
                                    className="h-9"
                                    placeholder="Pick a date"
                                />
                            </div>
                        </div>
                        <Button onClick={handleSaveEditPart} className="w-full" disabled={study.updatePart.isPending}>
                            {study.updatePart.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Manage Presets Dialog ───────────────────────────────── */}
            <Dialog open={managePresetsOpen} onOpenChange={setManagePresetsOpen}>
                <DialogContent className="w-[95vw] max-w-lg rounded-2xl sm:rounded-xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Manage Chapter Templates</DialogTitle>
                        <DialogDescription>Create templates (like "Read Chapter", "Take Notes") to save time when setting up your study plan.</DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden flex flex-col gap-4">
                        {/* Subject Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground font-medium">Select Subject</label>
                            <Select value={selectedPresetSubjectId} onValueChange={setSelectedPresetSubjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {study.subjects.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedPresetSubjectId && (
                            <>
                                {/* Tabs */}
                                <div className="flex gap-2 mb-4 border-b pb-2">
                                    <button
                                        className={`pb-1 text-sm font-medium transition-colors ${activePresetTab === "chapter" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                        onClick={() => { setActivePresetTab("chapter"); setNewPresetParentId(null); }}
                                    >
                                        Auto-Add to New Chapters
                                    </button>
                                    <button
                                        className={`pb-1 text-sm font-medium transition-colors ${activePresetTab === "part" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                        onClick={() => { setActivePresetTab("part"); setNewPresetParentId(null); setSelectedPresetIds(new Set()); setSelectedTargetChapterId(""); setSelectedTargetPartId(""); }}
                                    >
                                        Add to Existing Chapter
                                    </button>
                                </div>

                                {/* Tab Description & Target Selector */}
                                <div className="space-y-3 mb-4">
                                    <p className="text-xs text-muted-foreground">
                                        {activePresetTab === "chapter"
                                            ? "These templates will be automatically added every time you create a new chapter."
                                            : "Manually insert these reusable parts into any chapter you've already created."}
                                    </p>

                                    {activePresetTab === "part" && (
                                        <div className="flex items-center gap-2">
                                            <Select value={selectedTargetChapterId} onValueChange={(v) => { setSelectedTargetChapterId(v); setSelectedTargetPartId(""); }}>
                                                <SelectTrigger className="h-8 text-xs w-[240px]">
                                                    <SelectValue placeholder="Select Target Chapter..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {study.chaptersBySubject[selectedPresetSubjectId]?.map(chapter => (
                                                        <SelectItem key={chapter.id} value={chapter.id}>{chapter.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {selectedTargetChapterId && (
                                                <Select value={selectedTargetPartId} onValueChange={setSelectedTargetPartId}>
                                                    <SelectTrigger className="h-8 text-xs w-[240px]">
                                                        <SelectValue placeholder="Add under part... (Optional)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="root">-- Add as Root --</SelectItem>
                                                        <SelectItem value="all-parts">-- Add to ALL Parts --</SelectItem>
                                                        {study.partsByChapter[selectedTargetChapterId]?.map(part => (
                                                            <SelectItem key={part.id} value={part.id}>{part.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Add New Preset */}
                                <div className="p-3 bg-secondary/30 rounded-lg space-y-3 border border-border/50">
                                    <h4 className="text-sm font-medium flex items-center justify-between">
                                        <span>Create New {activePresetTab === "chapter" ? "Template" : "Reusable Part"}</span>
                                        {newPresetParentId && (
                                            <Badge variant="secondary" className="text-xs gap-1">
                                                Child of: {study.commonPresets?.find(p => p.id === newPresetParentId)?.name}
                                                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => setNewPresetParentId(null)} />
                                            </Badge>
                                        )}
                                    </h4>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder={newPresetParentId ? "Sub-preset name..." : "Part name (e.g., Read Chapter)"}
                                            value={newPresetName}
                                            onChange={e => setNewPresetName(e.target.value)}
                                            className="h-8 text-sm"
                                        />
                                        <Select value={String(newPresetMinutes)} onValueChange={v => setNewPresetMinutes(Number(v))}>
                                            <SelectTrigger className="h-8 w-[90px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIME_OPTIONS.map(t => <SelectItem key={t} value={String(t)}>{t}m</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Button size="sm" onClick={() => {
                                            if (!newPresetName.trim()) return;
                                            study.addCommonPreset.mutate({
                                                subjectId: selectedPresetSubjectId,
                                                name: newPresetName.trim(),
                                                minutes: newPresetMinutes,
                                                parentId: newPresetParentId || undefined,
                                                type: activePresetTab
                                            });
                                            setNewPresetName("");
                                            setNewPresetParentId(null);
                                        }} disabled={!newPresetName.trim()}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Preset List */}
                                <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1 mt-4">
                                    <h4 className="text-sm font-medium sticky top-0 bg-background pb-2 z-10 flex items-center justify-between">
                                        <span>Existing {activePresetTab === "chapter" ? "Templates" : "Reusable Parts"}</span>
                                        <Badge variant="secondary" className="text-[10px] h-5">
                                            {study.commonPresets?.filter(p => p.subject_id === selectedPresetSubjectId && (p.preset_type === activePresetTab || (!p.preset_type && activePresetTab === "chapter"))).length || 0}
                                        </Badge>
                                    </h4>
                                    {study.commonPresets?.filter(p => p.subject_id === selectedPresetSubjectId && !p.parent_id && (p.preset_type === activePresetTab || (!p.preset_type && activePresetTab === "chapter"))).length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                            No {activePresetTab === "chapter" ? "templates" : "reusable parts"} defined.
                                        </div>
                                    ) : (
                                        study.commonPresets?.filter(p => p.subject_id === selectedPresetSubjectId && !p.parent_id && (p.preset_type === activePresetTab || (!p.preset_type && activePresetTab === "chapter"))).map(preset => (
                                            <PresetRow
                                                key={preset.id}
                                                preset={preset}
                                                allPresets={study.commonPresets?.filter(p => p.subject_id === selectedPresetSubjectId && (p.preset_type === activePresetTab || (!p.preset_type && activePresetTab === "chapter"))) || []}
                                                onDelete={(id) => study.deleteCommonPreset.mutate(id)}
                                                onAddSubPreset={(id) => setNewPresetParentId(id)}
                                                selectable={activePresetTab === "part"}
                                                selectedIds={selectedPresetIds}
                                                onToggleSelect={(id) => {
                                                    const newSet = new Set(selectedPresetIds);
                                                    if (newSet.has(id)) newSet.delete(id);
                                                    else newSet.add(id);
                                                    setSelectedPresetIds(newSet);
                                                }}
                                            />
                                        ))
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="pt-2 border-t mt-auto">
                                    {activePresetTab === "chapter" ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="w-full text-xs"
                                                onClick={() => {
                                                    if (confirm("This will add missing templates to ALL existing chapters in this subject. Continue?")) {
                                                        study.applyPresetsToAllChapters.mutate(selectedPresetSubjectId);
                                                        toast({ title: "Templates applied!" });
                                                    }
                                                }}
                                                disabled={study.applyPresetsToAllChapters.isPending}
                                            >
                                                <FolderPlus className="w-3.5 h-3.5 mr-2" />
                                                Add these to all my existing chapters
                                            </Button>
                                            <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                                New chapters created in this subject will automatically include these parts.
                                            </p>
                                        </>
                                    ) : (
                                        <Button
                                            className="w-full text-xs"
                                            onClick={() => {
                                                if (!selectedTargetChapterId) return;
                                                study.addPresetsToChapter.mutate({
                                                    chapterId: selectedTargetChapterId,
                                                    presetIds: Array.from(selectedPresetIds),
                                                    targetPartId: selectedTargetPartId === "root" ? undefined : selectedTargetPartId
                                                });
                                                toast({ title: "Parts added!" });
                                                setSelectedPresetIds(new Set());
                                            }}
                                            disabled={!selectedTargetChapterId || selectedPresetIds.size === 0 || study.addPresetsToChapter.isPending}
                                        >
                                            <FolderPlus className="w-3.5 h-3.5 mr-2" />
                                            Add {Array.from(selectedPresetIds).length} parts to {selectedTargetPartId === "all-parts" ? "All Top-Level Parts" : (selectedTargetPartId && selectedTargetPartId !== "root" ? "Target Part" : "Chapter Root")}
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function PresetRow({
    preset,
    allPresets,
    level = 0,
    onDelete,
    onAddSubPreset,
    selectable,
    selectedIds,
    onToggleSelect
}: {
    preset: StudyCommonPreset;
    allPresets: StudyCommonPreset[];
    level?: number;
    onDelete: (id: string) => void;
    onAddSubPreset: (id: string) => void;
    selectable?: boolean;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
}) {
    const children = allPresets.filter(p => p.parent_id === preset.id);
    const isSelected = selectedIds?.has(preset.id);

    return (
        <div className="space-y-1">
            <div
                className={`flex items-center justify-between p-2 rounded-md border bg-card/50 hover:bg-card transition-colors group ${selectable ? "cursor-pointer hover:border-primary/50" : ""}`}
                style={{ marginLeft: `${level * 1.5}rem` }}
                onClick={(e) => {
                    // Prevent toggling if clicking on buttons
                    if (selectable && onToggleSelect && !(e.target as HTMLElement).closest('button')) {
                        onToggleSelect(preset.id);
                    }
                }}
            >
                {selectable && onToggleSelect && (
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleSelect(preset.id)}
                            className="mr-3"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {level > 0 && <div className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />}
                    <span className="text-sm font-medium truncate">{preset.name}</span>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 shrink-0">{preset.estimated_minutes}m</Badge>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                        size="icon" variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                        title="Add sub-preset"
                        onClick={() => onAddSubPreset(preset.id)}
                    >
                        <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                        size="icon" variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        title="Delete preset"
                        onClick={() => onDelete(preset.id)}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </div>
            {/* Recursively render children */}
            {children.map(child => (
                <PresetRow
                    key={child.id}
                    preset={child}
                    allPresets={allPresets}
                    level={level + 1}
                    onDelete={onDelete}
                    onAddSubPreset={onAddSubPreset}
                    selectable={selectable}
                    selectedIds={selectedIds}
                    onToggleSelect={onToggleSelect}
                />
            ))}
        </div>
    );
}

function PartRow({
    part,
    allParts,
    level = 0,
    onStartEdit,
    onToggleStatus,
    onDelete,
    onAddSubpart,
}: {
    part: StudyPart;
    allParts: StudyPart[];
    level?: number;
    onStartEdit: (part: StudyPart) => void;
    onToggleStatus: (part: StudyPart) => void;
    onDelete: (part: StudyPart) => void;
    onAddSubpart: (parentId: string) => void;
}) {
    const status = STATUS_MAP[part.status] || STATUS_MAP["not-started"];
    const children = allParts.filter(p => p.parent_id === part.id);

    return (
        <div className="group">
            <div
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-secondary/20 transition-colors ${level > 0 ? "border-t border-border/20" : ""}`}
                style={{ paddingLeft: `${Math.max(1, level * 1.5 + 1)}rem` }}
            >
                {/* Status toggle */}
                <button
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${part.status === "completed" ? "border-green-500 bg-green-500/20" :
                        part.status === "in-progress" ? "border-blue-500 bg-blue-500/20" :
                            "border-muted-foreground/30 hover:border-muted-foreground/60"
                        }`}
                    onClick={() => onToggleStatus(part)}
                    title={`Status: ${status.label} → Click to change`}
                >
                    {part.status === "completed" && <Check className="w-3 h-3 text-green-500 dark:text-green-400" />}
                    {part.status === "in-progress" && <div className="w-2 h-2 rounded-sm bg-blue-500" />}
                </button>

                {/* Part name */}
                <span className={`text-xs sm:text-sm flex-1 truncate ${part.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {part.name}
                </span>

                {/* Meta badges */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Duration badge */}
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 font-normal">
                        <Clock className="w-2.5 h-2.5" />
                        {part.estimated_minutes >= 60 ? `${part.estimated_minutes / 60}h` : `${part.estimated_minutes}m`}
                    </Badge>

                    {/* Date badge */}
                    {part.scheduled_date && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 font-normal">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(part.scheduled_date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </Badge>
                    )}

                    {/* Time badge */}
                    {part.scheduled_time && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                            {part.scheduled_time}
                        </Badge>
                    )}

                    {/* Status badge */}
                    <Badge className={`text-[10px] px-1.5 py-0 ${status.bg} ${status.color} border-0`}>
                        {status.label}
                    </Badge>
                </div>

                {/* Actions (visible on hover) */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAddSubpart(part.id)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Sub-part
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStartEdit(part)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit Part
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(part)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Part
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Render children recursively */}
            {children.length > 0 && (
                <div className="border-l-2 border-border/30 ml-4 sm:ml-6">
                    {children.map(child => (
                        <PartRow
                            key={child.id}
                            part={child}
                            allParts={allParts}
                            level={level + 1}
                            onStartEdit={onStartEdit}
                            onToggleStatus={onToggleStatus}
                            onDelete={onDelete}
                            onAddSubpart={onAddSubpart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
