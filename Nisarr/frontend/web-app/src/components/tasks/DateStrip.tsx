import { useRef, useEffect } from "react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface DateStripProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    taskCounts: Record<string, { total: number; done: number }>; // key: YYYY-MM-DD
}

export function DateStrip({ selectedDate, onSelectDate, taskCounts }: DateStripProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const days: Date[] = [];

    // Generate range: -7 days to +14 days from Today
    const today = startOfDay(new Date());
    for (let i = -7; i <= 14; i++) {
        days.push(addDays(today, i));
    }

    // Scroll to selected date on mount or change
    useEffect(() => {
        if (scrollRef.current) {
            const index = days.findIndex(d => isSameDay(d, selectedDate));
            if (index !== -1) {
                const itemWidth = 72; // Circle + gap
                const centerOffset = scrollRef.current.clientWidth / 2 - itemWidth / 2;
                scrollRef.current.scrollTo({
                    left: index * itemWidth - centerOffset,
                    behavior: "smooth"
                });
            }
        }
    }, [selectedDate]);

    // SVG config
    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    return (
        <div
            ref={scrollRef}
            className="date-carousel"
        >
            {days.map((date, i) => {
                const dateKey = format(date, "yyyy-MM-dd");
                const count = taskCounts[dateKey] || { total: 0, done: 0 };
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);
                const isFuture = date > new Date() && !isToday;

                // Progress
                const pct = count.total > 0 ? (count.done / count.total) * 100 : 0;
                const isAllDone = count.total > 0 && count.done === count.total;
                const strokeDashoffset = circumference - (pct / 100) * circumference;

                // Day label (2-char uppercase)
                const dayLabel = format(date, "EEE").slice(0, 2).toUpperCase();

                return (
                    <motion.div
                        key={dateKey}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.5), duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center gap-1 sm:gap-1.5 shrink-0"
                    >
                        {/* Day label */}
                        <span className={cn(
                            "text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider",
                            isToday ? "text-primary" :
                                isSelected ? "text-primary" :
                                    "text-muted-foreground/70"
                        )}>
                            {dayLabel}
                        </span>

                        {/* Circular progress ring button */}
                        <button
                            onClick={() => onSelectDate(date)}
                            className={cn(
                                "relative flex items-center justify-center rounded-full transition-all duration-500",
                                "w-10 h-10 sm:w-14 sm:h-14",
                                isSelected && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background scale-110"
                            )}
                        >
                            {/* SVG Ring */}
                            <svg
                                className="absolute inset-0 w-full h-full -rotate-90"
                                viewBox="0 0 48 48"
                            >
                                {/* Background track */}
                                <circle
                                    cx="24" cy="24" r={radius}
                                    fill="none"
                                    stroke="hsl(var(--border))"
                                    strokeWidth="3"
                                    opacity={isFuture ? 0.3 : 0.5}
                                />
                                {/* Progress arc */}
                                {pct > 0 && (
                                    <motion.circle
                                        cx="24" cy="24" r={radius}
                                        fill="none"
                                        stroke={
                                            pct >= 100 ? "url(#taskGradientFull)" :
                                                pct >= 50 ? "url(#taskGradientHalf)" :
                                                    "url(#taskGradientLow)"
                                        }
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        initial={{ strokeDashoffset: circumference }}
                                        animate={{ strokeDashoffset }}
                                        transition={{ delay: 0.3 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                                    />
                                )}
                                {/* Gradient definitions */}
                                <defs>
                                    <linearGradient id="taskGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#22d3ee" />
                                    </linearGradient>
                                    <linearGradient id="taskGradientHalf" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#4ade80" />
                                        <stop offset="100%" stopColor="#34d399" />
                                    </linearGradient>
                                    <linearGradient id="taskGradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fbbf24" />
                                        <stop offset="100%" stopColor="#f59e0b" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Inner circle with date number */}
                            <div className={cn(
                                "relative z-10 flex items-center justify-center rounded-full transition-all duration-300",
                                "w-7 h-7 sm:w-10 sm:h-10",
                                pct >= 100 ? "bg-emerald-500/15" :
                                    isToday ? "bg-primary/10" :
                                        isFuture ? "bg-secondary/20" : "bg-secondary/30"
                            )}>
                                <span className={cn(
                                    "text-[11px] sm:text-sm font-bold leading-none",
                                    pct >= 100 ? "text-emerald-400" :
                                        pct > 0 ? "text-foreground" :
                                            isToday ? "text-primary" :
                                                isFuture ? "text-muted-foreground/40" : "text-muted-foreground/70"
                                )}>
                                    {format(date, "d")}
                                </span>
                            </div>

                            {/* Completed checkmark overlay */}
                            {isAllDone && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.6 + i * 0.05, type: "spring", stiffness: 300 }}
                                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30"
                                >
                                    <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white stroke-[3px]" />
                                </motion.div>
                            )}

                            {/* Today indicator dot */}
                            {isToday && !isSelected && !isAllDone && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                                />
                            )}
                        </button>

                        {/* Count label */}
                        <span className={cn(
                            "text-[8px] sm:text-[10px] font-medium tabular-nums",
                            isAllDone ? "text-emerald-400" :
                                pct > 0 ? "text-muted-foreground" :
                                    "text-muted-foreground/40"
                        )}>
                            {count.done}/{count.total}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}
